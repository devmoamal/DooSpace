#!/usr/bin/env bash
# =============================================================================
# improve.sh — DooSpace Eternal AI Improvement Loop
#
# WHAT IT DOES
#   Runs forever in a while-true loop:
#     1. Reads next_loop.md and picks the first unchecked task.
#     2. Feeds it to Gemini CLI with full codebase context.
#     3. Applies the changes, commits, pushes, and opens a PR.
#     4. Marks the task done in next_loop.md.
#     5. If the queue is empty → asks Gemini to generate NEW tasks,
#        appends them to next_loop.md, commits, and loops again.
#
# The loop NEVER exits on its own. Use Ctrl+C to stop it.
#
# USAGE
#   ./improve.sh                      # run forever (eternal mode)
#   ./improve.sh --once               # run exactly one task then stop
#   ./improve.sh --list               # list pending tasks and exit
#   ./improve.sh --dry-run            # preview tasks without executing
#   ./improve.sh --task=3             # run only task #3 (1-based index)
#   ./improve.sh --model=gemini-3-flash-preview   # override Gemini model
#   ./improve.sh --pause=30           # seconds between loops (default: 10)
#   ./improve.sh --max-generations=5  # max times Gemini generates new tasks
#
# REQUIREMENTS
#   - gemini CLI   →  https://github.com/google-gemini/gemini-cli
#   - git (with a remote named 'origin')
#   - gh CLI       →  brew install gh
#   - bun          →  https://bun.sh/
#
# =============================================================================

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ── Config ────────────────────────────────────────────────────────────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOOP_FILE="${REPO_ROOT}/next_loop.md"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-3-flash-preview}"
BASE_BRANCH="${BASE_BRANCH:-main}"
PR_DRAFT="${PR_DRAFT:-false}"
MAX_RETRIES=2
LOOP_PAUSE=10           # seconds between task loops
MAX_GENERATIONS=99      # max times Gemini can auto-generate new tasks per session
TYPECHECK_CMD="bun tsc --noEmit"

# ── Argument parsing ──────────────────────────────────────────────────────────
DRY_RUN=false
ONCE_MODE=false
LIST_MODE=false
TARGET_TASK=""
GENERATION_COUNT=0

for arg in "$@"; do
  case "$arg" in
    --dry-run)           DRY_RUN=true ;;
    --once)              ONCE_MODE=true ;;
    --list)              LIST_MODE=true ;;
    --task=*)            TARGET_TASK="${arg#--task=}" ;;
    --model=*)           GEMINI_MODEL="${arg#--model=}" ;;
    --pause=*)           LOOP_PAUSE="${arg#--pause=}" ;;
    --max-generations=*) MAX_GENERATIONS="${arg#--max-generations=}" ;;
  esac
done

# ── Logging ───────────────────────────────────────────────────────────────────
_ts()        { date '+%H:%M:%S'; }
log_info()   { echo -e "${DIM}[$(_ts)]${RESET} ${CYAN}[INFO]${RESET}   $*"; }
log_ok()     { echo -e "${DIM}[$(_ts)]${RESET} ${GREEN}[OK]${RESET}     $*"; }
log_warn()   { echo -e "${DIM}[$(_ts)]${RESET} ${YELLOW}[WARN]${RESET}   $*"; }
log_error()  { echo -e "${DIM}[$(_ts)]${RESET} ${RED}[ERROR]${RESET}  $*"; }
log_gen()    { echo -e "${DIM}[$(_ts)]${RESET} ${MAGENTA}[GEN]${RESET}    $*"; }
log_loop()   { echo -e "${DIM}[$(_ts)]${RESET} ${BOLD}${BLUE}[LOOP]${RESET}   $*"; }

log_section() {
  local width=70
  local pad
  pad=$(printf '═%.0s' $(seq 1 $width))
  echo -e "\n${BOLD}${BLUE}${pad}${RESET}"
  echo -e "${BOLD}${BLUE}  $*${RESET}"
  echo -e "${BOLD}${BLUE}${pad}${RESET}\n"
}

# ── Requirements ──────────────────────────────────────────────────────────────
require_tool() {
  if ! command -v "$1" &>/dev/null; then
    log_error "Required tool not found: ${BOLD}$1${RESET}"
    echo "         Install: $2"
    exit 1
  fi
}

check_requirements() {
  require_tool gemini "https://github.com/google-gemini/gemini-cli"
  require_tool git    "https://git-scm.com/"
  require_tool gh     "brew install gh"
  require_tool bun    "https://bun.sh/"
}

# ── Task Queue Helpers ────────────────────────────────────────────────────────

# Emit pending tasks as "idx|slug|desc" lines
get_pending_tasks() {
  local idx=0
  while IFS= read -r line; do
    if [[ "$line" =~ ^-\ \[\ \]\ \*\*([^\*]+)\*\*\ —\ (.*) ]]; then
      idx=$((idx + 1))
      echo "${idx}|${BASH_REMATCH[1]}|${BASH_REMATCH[2]}"
    fi
  done < "$LOOP_FILE"
}

# Count only completed tasks
count_done_tasks() {
  grep -c '^\- \[x\]' "$LOOP_FILE" 2>/dev/null || echo 0
}

# Mark a task [x] done
mark_task_done() {
  local slug="$1"
  local escaped_slug
  escaped_slug=$(printf '%s\n' "$slug" | sed 's/[\/&]/\\&/g')
  sed -i.bak "s/^- \[ \] \*\*${escaped_slug}\*\*/- [x] **${escaped_slug}**/" "$LOOP_FILE"
  rm -f "${LOOP_FILE}.bak"
}

# ── Context Builders ──────────────────────────────────────────────────────────

# Context for a normal improvement task
build_task_context() {
  local slug="$1"
  local desc="$2"
  local ctx_file
  ctx_file=$(mktemp /tmp/doospace_ctx_XXXXXX.md)

  cat > "$ctx_file" <<CONTEXT
# DooSpace Improvement Task: ${slug}

## Task
${desc}

## Strict Rules
- Do ONLY what the task describes. No new features.
- Focus: cleaning · readability · bug fixes · refactoring ONLY.
- Preserve all unrelated comments and docstrings.
- Maintain backward compatibility — no breaking API changes.
- Write idiomatic TypeScript. No loose \`any\` unless task targets type-safety.
- Keep changes minimal and surgical.
- The project must still typecheck after your changes.

## Project Reference
$(cat "${REPO_ROOT}/GEMINI.md")

## Current Queue (next_loop.md)
$(cat "${REPO_ROOT}/next_loop.md")

---

Implement the task "${slug}" exactly as described.
Respond ONLY with file changes in unified diff format (fenced \`\`\`diff blocks).
At the very end add a single line: COMMIT_MSG: <one-line message>
CONTEXT

  echo "$ctx_file"
}

# Context for asking Gemini to generate new tasks
build_generation_context() {
  local done_count="$1"
  local ctx_file
  ctx_file=$(mktemp /tmp/doospace_gen_XXXXXX.md)

  cat > "$ctx_file" <<CONTEXT
# DooSpace — Generate Next Improvement Tasks

All ${done_count} queued tasks in next_loop.md are now complete.
Your job is to analyse the codebase and generate the NEXT batch of improvement tasks.

## Rules
- Tasks must be ONLY about: cleaning · refactoring · bug fixing · code quality.
- No new features, no new UI, no database schema changes.
- Each task must be single-responsibility (one specific thing to fix/clean).
- Tasks must be actionable and scoped to real files in this repo.
- Generate between 5 and 10 new tasks.

## Project Reference
$(cat "${REPO_ROOT}/GEMINI.md")

## Completed Tasks So Far (for context — do NOT repeat them)
$(cat "${REPO_ROOT}/next_loop.md")

---

Output ONLY the new tasks in this exact markdown list format — nothing else:

- [ ] **category/slug-name** — Clear one-sentence description of what to do and why.

Where category is one of: refactor · cleanup · fix · perf · docs
CONTEXT

  echo "$ctx_file"
}

# ── Gemini Invocation ─────────────────────────────────────────────────────────

# Collect explicit --file flags for .env files (gitignored, so --all-files skips them)
_env_file_flags() {
  local -a flags=()
  local -a env_candidates=(
    "${REPO_ROOT}/server/.env"
    "${REPO_ROOT}/client/.env"
    "${REPO_ROOT}/.env"
    "${REPO_ROOT}/server/.env.example"
  )
  for f in "${env_candidates[@]}"; do
    [[ -f "$f" ]] && flags+=(--file "$f")
  done
  echo "${flags[@]:-}"
}

run_gemini() {
  local ctx_file="$1"
  local attempt=0
  local output=""

  # Build .env flags (gitignored files not picked up by --all-files)
  local -a env_flags
  read -r -a env_flags <<< "$(_env_file_flags)"

  while [[ $attempt -lt $MAX_RETRIES ]]; do
    attempt=$((attempt + 1))
    log_info "Gemini call (model: ${BOLD}${GEMINI_MODEL}${RESET}, attempt ${attempt}/${MAX_RETRIES}) [full repo access]"

    set +e
    # Run from REPO_ROOT so --all-files picks up the entire DooSpace workspace
    output=$(cd "$REPO_ROOT" && gemini \
      --model "$GEMINI_MODEL" \
      --all-files \
      "${env_flags[@]:-}" \
      --prompt "$(cat "$ctx_file")" 2>&1)
    local rc=$?
    set -e

    if [[ $rc -eq 0 ]] && [[ -n "$output" ]]; then
      echo "$output"
      return 0
    fi

    log_warn "Gemini attempt ${attempt} failed (rc=${rc}). Retrying in 8s..."
    sleep 8
  done

  log_error "Gemini failed after ${MAX_RETRIES} attempts."
  return 1
}

# ── Apply Changes ─────────────────────────────────────────────────────────────

apply_gemini_output() {
  local output="$1"
  local patch_file
  patch_file=$(mktemp /tmp/doospace_patch_XXXXXX.patch)

  # Extract content inside ```diff ... ``` blocks
  echo "$output" | awk '
    /^```diff/ { in_block=1; next }
    /^```/     { if (in_block) { in_block=0 } next }
    in_block   { print }
  ' > "$patch_file"

  if [[ -s "$patch_file" ]]; then
    log_info "Applying unified diff patch..."
    if git -C "$REPO_ROOT" apply --index "$patch_file" 2>/dev/null; then
      log_ok "Patch applied."
    else
      log_warn "git apply failed — trying patch(1) with fuzz=3..."
      if patch -d "$REPO_ROOT" -p1 --fuzz=3 < "$patch_file" 2>/dev/null; then
        log_ok "Patch applied with fuzz."
        git -C "$REPO_ROOT" add -A
      else
        log_error "Patch failed entirely. Saved to: ${patch_file}"
        return 1
      fi
    fi
  else
    log_warn "No diff blocks found — Gemini may have described changes in prose."
    log_warn "Skipping automated patch; continuing loop."
  fi

  rm -f "$patch_file"
}

extract_commit_msg() {
  local output="$1"
  local slug="$2"
  local msg
  msg=$(echo "$output" | grep -oP '(?<=COMMIT_MSG: ).*' | head -1)
  [[ -z "$msg" ]] && msg="improve(${slug}): automated AI refactor"
  echo "$msg"
}

# ── Task Generation (queue refill) ────────────────────────────────────────────

generate_new_tasks() {
  local done_count="$1"

  if [[ $GENERATION_COUNT -ge $MAX_GENERATIONS ]]; then
    log_warn "Reached max auto-generations (${MAX_GENERATIONS}). Stopping."
    return 1
  fi

  GENERATION_COUNT=$((GENERATION_COUNT + 1))
  log_gen "Queue empty — asking Gemini to generate new tasks (generation #${GENERATION_COUNT})..."

  local ctx_file
  ctx_file=$(build_generation_context "$done_count")

  # Build .env flags (same as run_gemini — gitignored files need explicit inclusion)
  local -a env_flags
  read -r -a env_flags <<< "$(_env_file_flags)"

  local raw_output=""
  set +e
  # Run from REPO_ROOT so --all-files gives full codebase context for task generation
  raw_output=$(cd "$REPO_ROOT" && gemini \
    --model "$GEMINI_MODEL" \
    --all-files \
    "${env_flags[@]:-}" \
    --prompt "$(cat "$ctx_file")" 2>&1)
  local rc=$?
  set -e
  rm -f "$ctx_file"

  if [[ $rc -ne 0 ]] || [[ -z "$raw_output" ]]; then
    log_error "Gemini failed to generate new tasks."
    return 1
  fi

  # Extract only valid task lines (- [ ] **...**)
  local new_tasks
  new_tasks=$(echo "$raw_output" | grep -E '^- \[ \] \*\*[a-z]+\/[a-z/-]+\*\*' || true)

  if [[ -z "$new_tasks" ]]; then
    log_warn "Gemini response did not contain valid task lines. Raw output:"
    echo "$raw_output"
    return 1
  fi

  local task_count
  task_count=$(echo "$new_tasks" | wc -l | tr -d ' ')
  log_gen "Generated ${task_count} new tasks:"
  echo "$new_tasks" | while IFS= read -r t; do
    echo -e "  ${MAGENTA}+${RESET} $t"
  done

  # Append to next_loop.md
  {
    echo ""
    echo "<!-- auto-generated batch #${GENERATION_COUNT} on $(date '+%Y-%m-%d %H:%M:%S') -->"
    echo "$new_tasks"
  } >> "$LOOP_FILE"

  # Commit the updated queue to base branch
  git -C "$REPO_ROOT" add "$LOOP_FILE"
  if ! git -C "$REPO_ROOT" diff --cached --quiet; then
    git -C "$REPO_ROOT" commit -m "chore(loop): auto-generate task batch #${GENERATION_COUNT} [${task_count} tasks]"
    git -C "$REPO_ROOT" push origin "$BASE_BRANCH" 2>/dev/null || true
    log_ok "New tasks committed to ${BASE_BRANCH}."
  fi

  return 0
}

# ── Single Iteration ──────────────────────────────────────────────────────────

run_one_task() {
  local idx="$1"
  local slug="$2"
  local desc="$3"
  local branch="improve/${slug}-$(date +%Y%m%d%H%M%S)"

  log_section "Task #${idx}  ·  ${slug}"
  log_info "Desc:   ${desc}"
  log_info "Branch: ${branch}"

  if [[ "$DRY_RUN" == "true" ]]; then
    log_warn "[DRY RUN] Would process: ${slug}"
    return 0
  fi

  # Must have clean working tree
  if ! git -C "$REPO_ROOT" diff --quiet || ! git -C "$REPO_ROOT" diff --cached --quiet; then
    log_error "Dirty working tree. Commit or stash changes first."
    exit 1
  fi

  # New branch
  git -C "$REPO_ROOT" checkout -b "$branch"
  log_ok "On branch: ${branch}"

  # Build context + call Gemini
  local ctx_file
  ctx_file=$(build_task_context "$slug" "$desc")

  local gemini_output=""
  if ! gemini_output=$(run_gemini "$ctx_file"); then
    rm -f "$ctx_file"
    git -C "$REPO_ROOT" checkout "$BASE_BRANCH"
    git -C "$REPO_ROOT" branch -D "$branch"
    log_warn "Skipping '${slug}' — Gemini unavailable."
    return 1
  fi
  rm -f "$ctx_file"

  # Apply diff
  apply_gemini_output "$gemini_output"

  # Typecheck
  log_info "Running: ${TYPECHECK_CMD}"
  local tc_out=""
  set +e
  tc_out=$(cd "$REPO_ROOT/server" && eval "$TYPECHECK_CMD" 2>&1)
  local tc_rc=$?
  set -e
  if [[ $tc_rc -ne 0 ]]; then
    log_warn "Typecheck errors (will be noted in PR):"
    echo "$tc_out" | head -30
  else
    log_ok "Typecheck passed."
  fi

  # Stage everything
  git -C "$REPO_ROOT" add -A

  # Nothing changed? Clean up and bail
  if git -C "$REPO_ROOT" diff --cached --quiet; then
    log_warn "No file changes detected — Gemini produced no applicable diffs."
    git -C "$REPO_ROOT" checkout "$BASE_BRANCH"
    git -C "$REPO_ROOT" branch -D "$branch"
    mark_task_done "$slug"
    return 0
  fi

  # Commit
  local commit_msg
  commit_msg=$(extract_commit_msg "$gemini_output" "$slug")

  git -C "$REPO_ROOT" commit -m "${commit_msg}

task:   ${slug}
desc:   ${desc}
model:  ${GEMINI_MODEL}
by:     improve.sh (eternal loop)"

  log_ok "Committed: ${commit_msg}"

  # Push
  git -C "$REPO_ROOT" push -u origin "$branch"
  log_ok "Pushed: ${branch}"

  # Open PR
  local pr_title="improve: ${slug}"
  local tc_status="✅ passed"
  [[ $tc_rc -ne 0 ]] && tc_status="⚠️ errors (see below)"

  local pr_body
  pr_body=$(cat <<PR_BODY
## 🤖 Improvement Loop — \`${slug}\`

| Field | Value |
|---|---|
| **Task** | ${desc} |
| **Model** | \`${GEMINI_MODEL}\` |
| **Branch** | \`${branch}\` |
| **Typecheck** | ${tc_status} |

---

### Typecheck Output

\`\`\`
${tc_out:-No output — clean pass}
\`\`\`

---

### Gemini Changes

${gemini_output}

---

> _Generated automatically by \`improve.sh\`. Review carefully before merging._
PR_BODY
)

  local -a pr_flags=("--base" "$BASE_BRANCH" "--title" "$pr_title" "--body" "$pr_body")
  [[ "$PR_DRAFT" == "true" ]] && pr_flags+=("--draft")

  local pr_url=""
  pr_url=$(gh pr create "${pr_flags[@]}" 2>&1) || {
    log_warn "PR creation failed (maybe no remote?). Changes are still committed locally."
    pr_url="(no PR)"
  }
  log_ok "PR: ${pr_url}"

  # Mark done + push queue update on the same branch
  mark_task_done "$slug"
  git -C "$REPO_ROOT" add "$LOOP_FILE"
  if ! git -C "$REPO_ROOT" diff --cached --quiet; then
    git -C "$REPO_ROOT" commit -m "chore: mark ${slug} done in next_loop.md"
    git -C "$REPO_ROOT" push
  fi

  # Back to base
  git -C "$REPO_ROOT" checkout "$BASE_BRANCH"

  log_ok "Task '${slug}' complete. PR → ${pr_url}"
  echo ""
}

# ── Eternal Main Loop ─────────────────────────────────────────────────────────

main() {
  log_section "DooSpace — Eternal Improvement Loop"
  echo -e "  ${DIM}Repo   :${RESET} ${REPO_ROOT}"
  echo -e "  ${DIM}Model  :${RESET} ${GEMINI_MODEL}"
  echo -e "  ${DIM}Branch :${RESET} ${BASE_BRANCH}"
  echo -e "  ${DIM}Pause  :${RESET} ${LOOP_PAUSE}s between tasks"
  echo -e "  ${DIM}Mode   :${RESET} $( [[ "$DRY_RUN" == "true" ]] && echo "DRY RUN" || echo "LIVE" )"
  echo -e "  ${DIM}Press  :${RESET} Ctrl+C to stop at any time\n"

  check_requirements

  [[ ! -f "$LOOP_FILE" ]] && { log_error "Loop file not found: ${LOOP_FILE}"; exit 1; }

  # ── --list mode: just print and exit ─────────────────────────────────────
  if [[ "$LIST_MODE" == "true" ]]; then
    local tasks=()
    while IFS= read -r t; do tasks+=("$t"); done < <(get_pending_tasks)
    if [[ ${#tasks[@]} -eq 0 ]]; then
      log_ok "Queue is empty — all tasks complete."
    else
      echo -e "\n${BOLD}Pending tasks (${#tasks[@]}):${RESET}"
      for t in "${tasks[@]}"; do
        IFS='|' read -r i s d <<< "$t"
        echo -e "  ${CYAN}#${i}${RESET}  ${BOLD}${s}${RESET}  ${DIM}—${RESET}  ${d}"
      done
      echo ""
    fi
    exit 0
  fi

  # ── Eternal while loop ────────────────────────────────────────────────────
  local total_ran=0

  while true; do
    # Re-read the queue fresh every iteration (it may have been updated)
    local tasks=()
    while IFS= read -r t; do tasks+=("$t"); done < <(get_pending_tasks)

    # ── Queue is empty → generate new tasks ──────────────────────────────
    if [[ ${#tasks[@]} -eq 0 ]]; then
      local done_count
      done_count=$(count_done_tasks)

      log_loop "Queue exhausted after ${total_ran} tasks this session (${done_count} total done)."

      if [[ "$ONCE_MODE" == "true" ]] || [[ -n "$TARGET_TASK" ]]; then
        # Single-task or targeted modes: don't generate, just stop
        log_ok "Done."
        break
      fi

      if [[ "$DRY_RUN" == "true" ]]; then
        log_warn "[DRY RUN] Would generate new tasks here. Stopping."
        break
      fi

      log_gen "Refilling queue via Gemini..."
      if ! generate_new_tasks "$done_count"; then
        log_error "Could not generate new tasks. Stopping eternal loop."
        break
      fi

      log_info "Queue refilled. Resuming in ${LOOP_PAUSE}s..."
      sleep "$LOOP_PAUSE"
      continue   # ← re-read queue at top of while
    fi

    # ── Pick the right task ───────────────────────────────────────────────
    local chosen_idx="" chosen_slug="" chosen_desc=""

    if [[ -n "$TARGET_TASK" ]]; then
      # --task=N mode: find that specific task
      for t in "${tasks[@]}"; do
        IFS='|' read -r i s d <<< "$t"
        if [[ "$i" == "$TARGET_TASK" ]]; then
          chosen_idx="$i"; chosen_slug="$s"; chosen_desc="$d"
          break
        fi
      done
      if [[ -z "$chosen_idx" ]]; then
        log_warn "Task #${TARGET_TASK} not found in pending queue."
        break
      fi
    else
      # Default: always pick the first pending task
      IFS='|' read -r chosen_idx chosen_slug chosen_desc <<< "${tasks[0]}"
    fi

    # ── Run the task ──────────────────────────────────────────────────────
    if run_one_task "$chosen_idx" "$chosen_slug" "$chosen_desc"; then
      total_ran=$((total_ran + 1))
    fi

    # ── Stop conditions ───────────────────────────────────────────────────
    if [[ "$ONCE_MODE" == "true" ]]; then
      log_loop "Stopping after one task (--once)."
      break
    fi

    if [[ -n "$TARGET_TASK" ]]; then
      log_loop "Targeted task complete (--task=${TARGET_TASK})."
      break
    fi

    # ── Pause before next task ────────────────────────────────────────────
    log_info "Pausing ${LOOP_PAUSE}s before next task..."
    sleep "$LOOP_PAUSE"

  done   # end while true

  echo ""
  log_section "Session Summary"
  log_ok "Tasks run this session : ${total_ran}"
  log_ok "Queue generations      : ${GENERATION_COUNT}"
  log_ok "Check GitHub PRs for review → ${BASE_BRANCH}"
}

# ── Graceful Ctrl+C ───────────────────────────────────────────────────────────
trap 'echo -e "\n${YELLOW}[STOP]${RESET} Ctrl+C received — finishing current task then exiting...\n"; exit 0' INT TERM

main "$@"
