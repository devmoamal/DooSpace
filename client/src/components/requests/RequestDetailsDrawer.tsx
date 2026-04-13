import { X } from "lucide-react";
import { cn } from "@/lib/cn";

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

  const isSuccess = request.status < 400;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-100" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-[440px] bg-bg border-l border-border z-101 flex flex-col">
        {/* Header */}
        <header className="h-11 flex items-center justify-between px-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={cn(
                "text-[12px] font-mono font-semibold tabular-nums shrink-0",
                isSuccess ? "text-brand" : "text-red-500",
              )}
            >
              {request.status}
            </span>
            <span className="text-[11px] font-mono text-text-muted uppercase shrink-0">
              {request.method}
            </span>
            <span className="text-[11px] font-mono text-text truncate">
              {request.path}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-subtle hover:text-text-muted transition-colors rounded hover:bg-surface shrink-0 ml-3"
          >
            <X size={15} />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border">
          {/* Meta */}
          <section className="px-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-1">
                  Source
                </p>
                <p className="text-[13px] font-mono text-text">
                  {getDooName(request.doo_id)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-1">
                  Duration
                </p>
                <p className="text-[13px] font-mono text-text">
                  {request.duration ?? 0}ms
                </p>
              </div>
            </div>
          </section>

          {/* DooPix */}
          {request.doo_pix && request.doo_pix.length > 0 && (
            <section className="px-5 py-4">
              <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-3">
                Signature
              </p>
              <div className="grid grid-cols-24 w-fit rounded overflow-hidden">
                {request.doo_pix.map((row: string[], y: number) =>
                  row.map((color: string, x: number) => (
                    <div
                      key={`${x}-${y}`}
                      className="w-[8px] h-[8px]"
                      style={{
                        backgroundColor: color || "var(--color-surface)",
                      }}
                    />
                  )),
                )}
              </div>
            </section>
          )}

          {/* Logs */}
          <section className="px-5 py-4">
            <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-3">
              Trace&nbsp;·&nbsp;{request.logs?.length ?? 0} lines
            </p>
            <div className="font-mono text-[11px] space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar">
              {request.logs && request.logs.length > 0 ? (
                request.logs.map((log: string, idx: number) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-text-subtle shrink-0 w-5 text-right select-none tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="text-text-muted">{log}</span>
                  </div>
                ))
              ) : (
                <span className="text-text-subtle">—</span>
              )}
            </div>
          </section>

          {/* Response */}
          <section className="px-5 py-4">
            <p className="text-[10px] text-text-subtle uppercase tracking-widest mb-3">
              Response
            </p>
            {request.response ? (
              <pre className="text-[12px] font-mono text-text whitespace-pre-wrap break-all leading-relaxed">
                {request.response}
              </pre>
            ) : (
              <span className="text-[11px] font-mono text-text-subtle">
                null
              </span>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
