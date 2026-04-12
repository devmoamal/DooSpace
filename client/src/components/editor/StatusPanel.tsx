import { useState, useEffect } from "react";
import { Terminal, Zap, History, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DooPix } from "@/components/ui/DooPix";
import { cn } from "@/lib/cn";

interface StatusPanelProps {
  requests: any[];
  className?: string;
}

export function StatusPanel({ requests, className }: StatusPanelProps) {
  const [activeTab, setActiveTab] = useState<"logs" | "pix" | "history">("pix");
  const [selectedIdx, setSelectedIdx] = useState(0);
  
  // Update selection if new requests come in and we are on the latest
  useEffect(() => {
    if (selectedIdx === 0 && requests.length > 0) {
      // Stay on latest
    }
  }, [requests]);

  const selectedRequest = requests[selectedIdx] || {};
  const logs = selectedRequest.logs || [];
  const pixels = selectedRequest.doo_pix || Array.from({ length: 24 }, () => Array.from({ length: 24 }, () => "white"));

  return (
    <div className={cn("flex flex-col overflow-hidden h-full p-6 gap-6", className)}>
      {/* Tabs */}
      <div className="flex p-1 bg-bg border border-border rounded-xl shrink-0">
        <button
          onClick={() => setActiveTab("pix")}
          className={cn(
            "flex-1 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg transition-all",
            activeTab === "pix" ? "bg-surface text-brand shadow-sm border border-border" : "text-text/30 hover:text-text/50"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Zap size={10} />
            Display
          </div>
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={cn(
            "flex-1 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg transition-all",
            activeTab === "logs" ? "bg-surface text-brand shadow-sm border border-border" : "text-text/30 hover:text-text/50"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Terminal size={10} />
            Logs
          </div>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex-1 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg transition-all",
            activeTab === "history" ? "bg-surface text-brand shadow-sm border border-border" : "text-text/30 hover:text-text/50"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <History size={10} />
            History
          </div>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "pix" ? (
          <div className="space-y-6 flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-300 overflow-y-auto no-scrollbar pb-6">
            <DooPix pixels={pixels} size={240} className="shadow-2xl shadow-brand/10 rounded-[32px] border border-brand/20 bg-bg" />
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="p-4 bg-bg rounded-2xl border border-border/80 text-center shadow-sm">
                <div className={cn(
                  "text-xl font-serif",
                  selectedRequest.status < 400 ? "text-emerald-600" : "text-red-500"
                )}>
                  {selectedRequest.status || "—"}
                </div>
                <div className="text-[7px] font-black uppercase tracking-[0.2em] text-text/20 mt-1">Status</div>
              </div>
              <div className="p-4 bg-bg rounded-2xl border border-border/80 text-center shadow-sm">
                <div className="text-brand text-xl font-serif">
                  {selectedRequest.duration ? `${selectedRequest.duration}ms` : "—"}
                </div>
                <div className="text-[7px] font-black uppercase tracking-[0.2em] text-text/20 mt-1">Latency</div>
              </div>
            </div>

            {selectedRequest.id && (
              <div className="w-full p-4 bg-bg rounded-2xl border border-border/50">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-text/40 font-bold">{selectedRequest.method}</span>
                  <span className="text-text/60 truncate max-w-[120px]">{selectedRequest.path}</span>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "logs" ? (
          <div className="w-full font-mono text-[10px] space-y-3 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-300">
            {logs.length > 0 ? (
              logs.map((log: string, i: number) => (
                <div key={i} className="p-3 bg-bg/50 rounded-xl border border-border/60 text-text/60 break-all border-l-2 border-l-brand shadow-sm">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-center py-24 space-y-4">
                <Terminal size={32} className="mx-auto text-text/5" />
                <div className="text-text/10 font-serif text-lg tracking-tight">No logs</div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full space-y-2 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-left-4 duration-300">
            {requests.length > 0 ? (
              requests.map((req: any, i: number) => (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelectedIdx(i);
                    setActiveTab("pix");
                  }}
                  className={cn(
                    "w-full p-3 rounded-xl border transition-all text-left group",
                    selectedIdx === i 
                      ? "bg-brand/5 border-brand/20 shadow-sm" 
                      : "bg-bg/50 border-border/40 hover:border-brand/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                     <span className={cn(
                       "px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider",
                       req.status < 400 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                     )}>
                       {req.method} {req.status}
                     </span>
                     <span className="text-[8px] text-text/20 font-bold">
                        {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                  </div>
                  <div className="text-[9px] text-text/50 font-medium truncate">
                     {req.path}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-24 space-y-4">
                 <History size={32} className="mx-auto text-text/5" />
                 <div className="text-text/10 font-serif text-lg tracking-tight">Empty history</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
