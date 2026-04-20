import { X, Zap, Database, ArrowRightLeft, AlertCircle, Info, Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { DooPix } from "@/components/ui/DooPix";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";

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

const LOG_STYLES: Record<LogKind, { dot: string; text: string; icon: any; variant: any }> = {
  error:   { dot: "bg-red-500",    text: "text-red-400",    icon: AlertCircle,    variant: "danger" },
  callDoo: { dot: "bg-brand",      text: "text-brand",      icon: ArrowRightLeft, variant: "brand" },
  db:      { dot: "bg-amber-600",  text: "text-amber-500",  icon: Database,       variant: "warning" },
  fetch:   { dot: "bg-blue-500",   text: "text-blue-400",   icon: Zap,            variant: "info" },
  log:     { dot: "bg-text-subtle",text: "text-text-muted", icon: Info,           variant: "neutral" },
  info:    { dot: "bg-purple-500", text: "text-purple-400", icon: Info,           variant: "neutral" },
};

export function RequestDetailsDrawer({ request, onClose, getDooName }: RequestDetailsDrawerProps) {
  if (!request) return null;
  const isSuccess = request.status < 400 && request.status !== 0;

  const logs: string[] = Array.isArray(request.logs) ? request.logs : [];

  return (
    <>
      <div className="fixed inset-0 z-100 bg-black/10 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-[500px] bg-bg border-l border-border z-101 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 ease-out rounded-none">
        {/* Header */}
        <header className="h-11 flex items-center justify-between px-5 border-b border-border bg-bg/80 backdrop-blur-md shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <Badge 
              variant={isSuccess ? "success" : "danger"} 
              size="sm" 
              className="font-mono tabular-nums font-bold"
            >
              {request.status || "000"}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-text-subtle">{request.method}</span>
              <ChevronRight size={10} className="text-text-subtle/30" />
              <span className="text-[11px] font-mono text-text-muted truncate max-w-[200px]">{request.path}</span>
            </div>
          </div>
          <IconButton
            onClick={onClose}
            variant="ghost"
            size="sm"
            title="Close details"
            className="text-text-subtle"
          >
            <X size={16} />
          </IconButton>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Metadata Grid */}
          <section className="px-6 py-6 grid grid-cols-3 gap-6 border-b border-border/50 bg-bg-alt/30">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-text-subtle">Trigger</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-brand/50" />
                <p className="text-[12px] font-bold text-text font-mono tracking-tight">{getDooName(request.doo_id)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-text-subtle">Duration</p>
              <p className="text-[12px] font-bold text-text font-mono tabular-nums">{request.duration ?? 0}ms</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-text-subtle">Steps</p>
              <p className="text-[12px] font-bold text-text font-mono tabular-nums">{logs.length} events</p>
            </div>
          </section>

          {/* DooPix Signature */}
          {request.doo_pix && (
            <section className="px-6 py-6 border-b border-border/50">
              <p className="text-[10px] font-bold text-text-subtle mb-4">Execution Fingerprint</p>
              <div className="p-1 border border-border bg-black/5 rounded-none">
                <DooPix
                  pixels={request.doo_pix}
                  pixelSize={8}
                  maxCols={32}
                  className="w-full"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
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
                    brand: "call", purple: "chain", db: "data", fetch: "req", log: "log", error: "err",
                  };
                  return (
                    <div key={kind} className="flex items-center gap-1.5 px-2 py-0.5 bg-surface/50 border border-border/50">
                      <span className={`w-1.5 h-1.5 rounded-none shrink-0 ${colorMap[kind]}`} />
                      <span className="text-[9px] font-bold text-text-subtle">{labelMap[kind]}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Trace Events */}
          <section className="px-6 py-6 border-b border-border/50">
             <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-text-subtle">Trace Events</p>
                <Badge variant="neutral" size="xs" className="font-bold opacity-60">{logs.length}</Badge>
             </div>
            <div className="space-y-1 font-mono text-[11px]">
              {logs.length > 0 ? (
                logs.map((log: string, idx: number) => {
                  const kind = classifyLog(log);
                  const style = LOG_STYLES[kind];
                  const IconComp = style.icon;
                  const text = log.replace(/^\[\d{4}-.*?Z\]\s*/, "").replace(/^ERROR:\s*/i, "");
                  const isError = kind === "error";
                  
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-start gap-3 px-3 py-2 border border-transparent transition-all group",
                        isError ? "bg-red-500/5 border-red-500/10" : "hover:bg-surface hover:border-border/50",
                      )}
                    >
                       <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                          <IconComp size={12} className={cn(style.text, "opacity-70 group-hover:opacity-100 transition-opacity")} />
                       </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                           <span className="text-[9px] font-bold text-text-subtle/40 tabular-nums">STEP {String(idx + 1).padStart(2, '0')}</span>
                           <Badge variant={style.variant} size="xs" className="text-[8px] px-1 py-0 h-3 font-black">{(kind === "callDoo" ? "DOO" : kind).toUpperCase()}</Badge>
                        </div>
                        <span className={cn("inline-block break-all leading-relaxed", isError ? "text-red-400 font-bold" : "text-text-muted")}>
                          {text}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 flex flex-col items-center justify-center opacity-30 border border-dashed border-border">
                   <Terminal size={20} className="mb-2" />
                   <p className="text-[10px] font-bold text-center">No trace data recorded</p>
                </div>
              )}
            </div>
          </section>

          {/* Response Payload */}
          <section className="px-6 py-8">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-[10px] font-bold text-text-subtle">Terminal Payload</p>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            {request.response ? (
              <div className="relative group">
                <pre className={cn(
                  "text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed p-4 border border-border shadow-inner transition-all",
                  isSuccess ? "text-text bg-surface/50 group-hover:bg-surface" : "text-red-400 bg-red-500/5 border-red-500/20",
                )}>
                  {(() => {
                    try { return JSON.stringify(JSON.parse(request.response), null, 2); }
                    catch { return request.response; }
                  })()}
                </pre>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <IconButton size="xs" variant="ghost" title="Copy payload">
                      <ArrowRightLeft size={10} className="rotate-90" />
                   </IconButton>
                </div>
              </div>
            ) : (
              <div className="p-8 border border-border border-dashed flex flex-col items-center justify-center bg-bg-alt/20">
                 <p className="text-[10px] font-bold font-mono text-text-subtle">VOID : NULL</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
