import { useState, useEffect } from "react";
import { Terminal, Zap, History } from "lucide-react";
import { DooPix } from "@/components/ui/DooPix";
import { cn } from "@/lib/cn";

interface StatusPanelProps {
  requests: any[];
  className?: string;
}

export function StatusPanel({ requests, className }: StatusPanelProps) {
  const [activeTab, setActiveTab] = useState<"logs" | "pix" | "history">("pix");
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (selectedIdx === 0 && requests.length > 0) {
      // Stay on latest
    }
  }, [requests]);

  const selectedRequest = requests[selectedIdx] || {};
  const logs = selectedRequest.logs || [];
  const pixels = selectedRequest.doo_pix || [];

  const tabs = [
    { id: "pix" as const, icon: Zap, label: "Display" },
    { id: "logs" as const, icon: Terminal, label: "Logs" },
    { id: "history" as const, icon: History, label: "History" },
  ];

  return (
    <div className={cn("flex flex-col overflow-hidden h-full p-4 gap-4", className)}>
      {/* Tabs */}
      <div className="flex bg-surface border border-border rounded p-0.5 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-1.5 text-[10px] font-medium uppercase tracking-widest rounded transition-colors cursor-pointer",
              activeTab === tab.id
                ? "bg-bg text-text"
                : "text-text-subtle hover:text-text-muted"
            )}
          >
            <div className="flex items-center justify-center gap-1.5">
              <tab.icon size={10} />
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "pix" ? (
          <div className="space-y-4 flex flex-col items-center w-full overflow-y-auto no-scrollbar pb-4">
            <DooPix pixels={pixels} className="border-border" />

            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="p-3 bg-surface rounded border border-border text-center">
                <div
                  className={cn(
                    "text-lg font-mono font-semibold tabular-nums",
                    selectedRequest.status < 400 ? "text-brand" : "text-red-500"
                  )}
                >
                  {selectedRequest.status || "—"}
                </div>
                <div className="text-[9px] text-text-subtle uppercase tracking-widest mt-0.5">
                  Status
                </div>
              </div>
              <div className="p-3 bg-surface rounded border border-border text-center">
                <div className="text-lg font-mono font-semibold text-text tabular-nums">
                  {selectedRequest.duration ? `${selectedRequest.duration}ms` : "—"}
                </div>
                <div className="text-[9px] text-text-subtle uppercase tracking-widest mt-0.5">
                  Latency
                </div>
              </div>
            </div>

            {selectedRequest.id && (
              <div className="w-full p-3 bg-surface rounded border border-border">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-text-subtle">{selectedRequest.method}</span>
                  <span className="text-text-muted truncate max-w-[140px] ml-2">
                    {selectedRequest.path}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "logs" ? (
          <div className="w-full font-mono text-[11px] space-y-1 overflow-y-auto custom-scrollbar">
            {logs.length > 0 ? (
              logs.map((log: string, i: number) => (
                <div
                  key={i}
                  className="px-3 py-2 bg-surface rounded border border-border text-text-muted break-all border-l-2 border-l-brand"
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <Terminal size={20} className="mx-auto text-text-subtle mb-2 opacity-30" />
                <p className="text-[11px] text-text-subtle">No logs</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full space-y-1 overflow-y-auto custom-scrollbar">
            {requests.length > 0 ? (
              requests.map((req: any, i: number) => (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelectedIdx(i);
                    setActiveTab("pix");
                  }}
                  className={cn(
                    "w-full p-3 rounded border transition-colors text-left cursor-pointer",
                    selectedIdx === i
                      ? "bg-surface border-border"
                      : "bg-bg border-border hover:bg-surface"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={cn(
                        "text-[10px] font-mono font-semibold uppercase",
                        req.status < 400 ? "text-brand" : "text-red-500"
                      )}
                    >
                      {req.method} {req.status}
                    </span>
                    <span className="text-[10px] text-text-subtle font-mono tabular-nums">
                      {new Date(req.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-muted font-mono truncate">
                    {req.path}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-16">
                <History size={20} className="mx-auto text-text-subtle mb-2 opacity-30" />
                <p className="text-[11px] text-text-subtle">No history</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
