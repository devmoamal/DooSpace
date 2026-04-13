import { Hash, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { type Endpoint } from "@doospace/shared";

interface EndpointsPanelProps {
  endpoints: Endpoint[];
  className?: string;
}

export function EndpointsPanel({
  endpoints,
  className,
}: EndpointsPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-hidden bg-surface",
        className,
      )}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* High-Density Routes List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2">
            <Hash size={11} className="text-text/30" />
            <span className="text-[10px] font-bold text-text/40 uppercase tracking-widest leading-none">
              Routes
            </span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {endpoints.length > 0 ? (
              <div className="space-y-0.5">
                {endpoints.map((ep, i) => {
                  const { method, path } = ep;

                  return (
                    <div
                      key={i}
                      className="group flex flex-col px-4 py-3 hover:bg-surface-lighter/50 transition-colors cursor-default border-b border-border/10 last:border-0"
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <span
                          className={cn(
                            "w-10 text-center text-[8px] font-black px-1.5 py-0.5 rounded-md border leading-none uppercase tracking-tighter shrink-0",
                            method === "GET"
                              ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                              : method === "POST"
                                ? "bg-blue-500/5 text-blue-600 border-blue-500/10"
                                : "bg-amber-500/5 text-amber-600 border-amber-500/10",
                          )}
                        >
                          {method}
                        </span>

                        <span className="flex-1 font-mono text-[11px] text-text/80 truncate tracking-tight font-medium">
                          {path}
                        </span>
                      </div>

                      {(ep.request_type || ep.response_type) && (
                        <div className="flex items-center gap-1.5 ml-0 sm:ml-[44px]">
                          {ep.request_type ? (
                            <span className="text-[9px] font-mono text-text/40 bg-text/5 px-1.5 py-0.5 rounded border border-border/20 truncate max-w-[120px]">
                              {ep.request_type}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-text/20 italic">any</span>
                          )}
                          
                          <ArrowRight size={8} className="text-text/20 shrink-0" />
                          
                          {ep.response_type ? (
                            <span className="text-[9px] font-mono text-brand/60 bg-brand/5 px-1.5 py-0.5 rounded border border-brand/10 truncate max-w-[120px]">
                              {ep.response_type}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-text/20 italic">any</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-10 h-10 rounded-full bg-surface-lighter flex items-center justify-center mb-3">
                  <Hash size={16} className="text-text/10" />
                </div>
                <p className="text-[10px] text-text/30 text-center leading-relaxed">
                  No endpoints detected. <br />
                  Define one using{" "}
                  <code className="text-brand/50 px-1">doo.get()</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
