# DooSpace — Improvement Loop Queue

This file is maintained by `improve.sh`. Each loop picks the **first unchecked item**, works on it, commits the result, opens a pull request, then checks it off before moving on.

> **Do not reorder or delete completed items.** Add new items at the bottom.

---

## Queue

- [ ] **refactor/runtime-error-handling** — Harden `executor.ts`: wrap sandbox execution with structured error types, distinguish transpilation errors from runtime errors, and surface cleaner error messages to the client.
- [ ] **refactor/parser-robustness** — Improve `lib/parser.ts` regex to handle multi-line route registrations, template literals in paths, and edge cases like trailing commas.
- [ ] **cleanup/dead-test-files** — Remove `test_loops.ts` and `test_transpilation.ts` from `server/src/` (they are one-off scripts that should not live in src; move to a dedicated `scripts/` or delete if obsolete).
- [ ] **refactor/repository-consistency** — Audit all repositories to ensure consistent error handling, naming conventions, and that all methods follow the same return-type patterns.
- [ ] **refactor/service-layer-thinning** — Ensure services do not duplicate repository logic; each service method should have a single clear responsibility.
- [ ] **cleanup/type-safety** — Replace all `any` types in `executor.ts`, `context.ts`, and route handlers with proper TypeScript types or generics.
- [ ] **refactor/doobox-ttl** — Move TTL expiry filtering from the repository query into a proper SQL `WHERE expireAt > NOW()` clause for correctness and performance.
- [ ] **refactor/secrets-proxy** — Simplify `DooSecrets.asProxy()` — remove the unused `_target` params and tighten the Proxy trap signatures.
- [ ] **cleanup/console-logs** — Audit server source for `console.log` debug statements left in production code; replace with the structured `logger.ts` utility.
- [ ] **refactor/route-validation** — Add Zod validation schemas to all route handlers that accept a request body, and return typed 400 errors on invalid input.
- [ ] **cleanup/imports** — Audit all files for unused imports and sort/group imports consistently (builtin → external → internal → relative).
- [ ] **refactor/canvas** — Review `runtime/canvas.ts`; document what it does, clean up its API, and ensure it is consistently used across the codebase.
- [ ] **cleanup/env-config** — Centralize all `process.env` reads into `server/src/config/` so no route or service accesses env vars directly.
- [ ] **refactor/loop-service** — Review `loop.service.ts` (largest service at 5.6 KB); split into focused units if it handles too many concerns.
- [ ] **cleanup/shared-types** — Audit `shared/src/` to ensure all exported types are actually used by both client and server; remove orphaned types.
