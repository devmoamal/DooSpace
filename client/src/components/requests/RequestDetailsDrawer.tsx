import {
  X,
  ChevronRight,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DooPix } from "@/components/ui/DooPix";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { TraceEventsTab } from "./tabs/TraceEventsTab";

interface RequestDetailsDrawerProps {
  request: any | null;
  onClose: () => void;
  getDooName: (id: number) => string;
}

export function RequestDetailsDrawer({
  request,
  onClose,
  getDooName,
}: RequestDetailsDrawerProps) {
  if (!request) return null;
  const isSuccess = request.status < 400 && request.status !== 0;

  const logs: string[] = Array.isArray(request.logs) ? request.logs : [];

  return (
    <>
      <div
        className="fixed inset-0 z-100 bg-black/10 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

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
              <span className="text-[10px] font-bold text-text-subtle">
                {request.method}
              </span>
              <ChevronRight size={10} className="text-text-subtle/30" />
              <span className="text-[11px] font-mono text-text-muted truncate max-w-[200px]">
                {request.path}
              </span>
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
                <p className="text-[12px] font-bold text-text font-mono tracking-tight">
                  {getDooName(request.doo_id)}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-text-subtle">Duration</p>
              <p className="text-[12px] font-bold text-text font-mono tabular-nums">
                {request.duration ?? 0}ms
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-text-subtle">Steps</p>
              <p className="text-[12px] font-bold text-text font-mono tabular-nums">
                {logs.length} events
              </p>
            </div>
          </section>

          {/* DooPix Signature */}
          {request.doo_pix && (
            <section className="px-6 py-6 border-b border-border/50">
              <p className="text-[10px] font-bold text-text-subtle mb-4">
                Execution Fingerprint
              </p>
              <div className="p-1 border border-border bg-black/5 rounded-none">
                <DooPix
                  pixels={request.doo_pix}
                  pixelSize={8}
                  maxCols={32}
                  className="w-full"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {(
                  ["brand", "purple", "db", "fetch", "log", "error"] as const
                ).map((kind) => {
                  const colorMap: Record<string, string> = {
                    brand: "bg-brand",
                    purple: "bg-purple-500",
                    db: "bg-amber-600",
                    fetch: "bg-blue-500",
                    log: "bg-yellow-400",
                    error: "bg-red-500",
                  };
                  const labelMap: Record<string, string> = {
                    brand: "call",
                    purple: "chain",
                    db: "data",
                    fetch: "req",
                    log: "log",
                    error: "err",
                  };
                  return (
                    <div
                      key={kind}
                      className="flex items-center gap-1.5 px-2 py-0.5 bg-surface/50 border border-border/50"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-none shrink-0 ${colorMap[kind]}`}
                      />
                      <span className="text-[9px] font-bold text-text-subtle">
                        {labelMap[kind]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Trace Events */}
          <TraceEventsTab logs={logs} />

          {/* Response Payload */}
          <section className="px-6 py-8">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-[10px] font-bold text-text-subtle">
                Terminal Payload
              </p>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            {request.response ? (
              <div className="relative group">
                <pre
                  className={cn(
                    "text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed p-4 border border-border shadow-inner transition-all",
                    isSuccess
                      ? "text-text bg-surface/50 group-hover:bg-surface"
                      : "text-red-400 bg-red-500/5 border-red-500/20",
                  )}
                >
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(request.response), null, 2);
                    } catch {
                      return request.response;
                    }
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
                <p className="text-[10px] font-bold font-mono text-text-subtle">
                  VOID : NULL
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
