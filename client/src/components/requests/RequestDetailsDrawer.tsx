import { X, Zap, Database, ArrowRightLeft, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { DooPix } from "@/components/ui/DooPix";
import { useThemeStore } from "@/stores/theme.store";

interface RequestDetailsDrawerProps {
  request: any | null;
  onClose: () => void;
  getDooName: (id: number) => string;
}

// ── Semantic log classifier ───────────────────────────────────────────────────
type LogKind = "error" | "callDoo" | "db" | "fetch" | "log" | "info";

function classifyLog(line: string): LogKind {
  const l = line.toLowerCase();
  if (l.includes("error") || l.includes("exception") || l.includes("fail")) return "error";
  if (l.includes("calldoo") || l.includes("doo #") || l.includes("→ doo")) return "callDoo";
  if (l.includes("doobox") || l.includes("db ") || l.includes("insert") || l.includes("select") || l.includes("set(") || l.includes("get(")) return "db";
  if (l.includes("fetch") || l.includes("http") || l.includes("request") || l.includes("response")) return "fetch";
  return "log";
}

const LOG_STYLES: Record<LogKind, { dot: string; text: string; icon: any }> = {
  error:   { dot: "bg-red-500",    text: "text-red-400",    icon: AlertCircle },
  callDoo: { dot: "bg-brand",      text: "text-brand",      icon: ArrowRightLeft },
  db:      { dot: "bg-amber-600",  text: "text-amber-500",  icon: Database },
  fetch:   { dot: "bg-blue-500",   text: "text-blue-400",   icon: Zap },
  log:     { dot: "bg-text-subtle",text: "text-text-muted", icon: Info },
  info:    { dot: "bg-purple-500", text: "text-purple-400", icon: Info },
};

export function RequestDetailsDrawer({ request, onClose, getDooName }: RequestDetailsDrawerProps) {
  if (!request) return null;
  const { theme } = useThemeStore();
  const isSuccess = request.status < 400;

  const logs: string[] = Array.isArray(request.logs) ? request.logs : [];

  return (
    <>
      <div className="fixed inset-0 z-100" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-[460px] bg-bg border-l border-border z-101 flex flex-col">
        {/* Header */}
        <header className="h-11 flex items-center justify-between px-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className={cn(
              "text-[12px] font-mono font-semibold tabular-nums shrink-0 px-1.5 py-0.5 rounded text-[10px]",
              isSuccess
                ? "text-brand bg-brand/10"
                : "text-red-500 bg-red-500/10",
            )}>
              {request.status}
            </span>
            <span className="text-[10px] font-mono text-text-subtle uppercase shrink-0 tracking-wider">
              {request.method}
            </span>
            <span className="text-[11px] font-mono text-text-muted truncate">{request.path}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-subtle hover:text-text-muted transition-colors rounded hover:bg-surface shrink-0 ml-3 cursor-pointer"
          >
            <X size={15} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border">
          {/* Meta */}
          <section className="px-5 py-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-1.5">Source</p>
              <p className="text-[12px] font-mono text-text">{getDooName(request.doo_id)}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-1.5">Duration</p>
              <p className="text-[12px] font-mono text-text tabular-nums">{request.duration ?? 0}ms</p>
            </div>
            <div>
              <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-1.5">Trace</p>
              <p className="text-[12px] font-mono text-text tabular-nums">{logs.length} events</p>
            </div>
          </section>

          {/* DooPix — only renders when there are actual trace events */}
          {request.doo_pix && (
            <section className="px-5 py-4">
              <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-3">Signature</p>
              <DooPix
                pixels={request.doo_pix}
                pixelSize={10}
                maxCols={20}
                className="w-full"
              />
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                {(["brand", "purple", "db", "fetch", "log", "error"] as const).map((kind) => {
                  const colorMap: Record<string, string> = {
                    brand:  "bg-brand",
                    purple: "bg-purple-500",
                    db:     "bg-amber-600",
                    fetch:  "bg-blue-500",
                    log:    "bg-yellow-400",
                    error:  "bg-red-500",
                  };
                  const labelMap: Record<string, string> = {
                    brand: "callDoo", purple: "chain", db: "db", fetch: "fetch", log: "log", error: "error",
                  };
                  return (
                    <div key={kind} className="flex items-center gap-1.5">
                      <span className={`w-[7px] h-[7px] rounded-[1px] shrink-0 ${colorMap[kind]}`} />
                      <span className="text-[9px] font-mono text-text-subtle">{labelMap[kind]}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Execution Trace */}
          <section className="px-5 py-4">
            <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-3">
              Trace · {logs.length}
            </p>
            <div className="space-y-0 font-mono text-[11px]">
              {logs.length > 0 ? (
                logs.map((log: string, idx: number) => {
                  const kind = classifyLog(log);
                  const style = LOG_STYLES[kind];
                  const IconComp = style.icon;
                  // Strip timestamp prefix if present
                  const text = log.replace(/^\[\d{4}-.*?Z\]\s*/, "").replace(/^ERROR:\s*/i, "");
                  const isError = kind === "error";
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-start gap-2.5 px-3 py-1.5 rounded-sm transition-colors",
                        isError ? "bg-red-500/5" : "hover:bg-surface",
                      )}
                    >
                      <span className="shrink-0 mt-0.5">
                        <IconComp size={10} className={style.text} />
                      </span>
                      <span className="text-text-subtle shrink-0 w-4 text-right select-none tabular-nums">
                        {idx + 1}
                      </span>
                      <span className={cn("flex-1 break-all leading-relaxed", style.text)}>
                        {text}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span className="text-text-subtle px-3">—</span>
              )}
            </div>
          </section>

          {/* Response */}
          <section className="px-5 py-4">
            <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-3">Response</p>
            {request.response ? (
              <pre className={cn(
                "text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed rounded p-3",
                isSuccess ? "text-text bg-surface" : "text-red-400 bg-red-500/5",
              )}>
                {(() => {
                  try { return JSON.stringify(JSON.parse(request.response), null, 2); }
                  catch { return request.response; }
                })()}
              </pre>
            ) : (
              <span className="text-[11px] font-mono text-text-subtle px-3">null</span>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
