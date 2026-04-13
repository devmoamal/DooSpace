import { cn } from "@/lib/cn";
import { DooAvatar } from "@/components/ui/DooAvatar";

interface RequestsTableProps {
  requests: any[];
  getDooName: (id: number) => string;
  onSelect: (request: any) => void;
  selectedId?: string | null;
}

export function RequestsTable({ requests, getDooName, onSelect, selectedId }: RequestsTableProps) {
  return (
    <div className="flex-1 flex flex-col bg-bg border border-border rounded-xl overflow-hidden min-h-0 shadow-sm transition-all duration-200">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-surface border-b border-border sticky top-0 z-10 backdrop-blur-md">
              <th className="w-48 px-6 py-4 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-surface/50">
                Orchestration Unit
              </th>
              <th className="px-6 py-4 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-surface/50">
                Interface
              </th>
              <th className="w-24 px-6 py-4 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-surface/50">
                Status
              </th>
              <th className="w-28 px-6 py-4 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-surface/50">
                Latency
              </th>
              <th className="w-32 px-6 py-4 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-surface/50 text-right">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {requests.map((req) => {
              const isSelected = selectedId === req.id;
              const isSuccess = req.status < 400;

              return (
                <tr
                  key={req.id}
                  onClick={() => onSelect(req)}
                  className={cn(
                    "hover:bg-surface/50 transition-all group cursor-pointer relative",
                    isSelected ? "bg-brand/4" : ""
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <DooAvatar
                          id={req.doo_id}
                          size={28}
                          className={cn(
                            "rounded ring-1 transition-all duration-200",
                            isSelected ? "ring-brand shadow-sm shadow-brand/10" : "ring-border"
                          )}
                        />
                        {isSelected && (
                          <div className="absolute -left-6 top-1 bottom-1 w-[3px] bg-brand rounded-r-full shadow-[0_0_10px_rgba(62,207,142,0.3)]" />
                        )}
                      </div>
                      <span className={cn(
                        "font-bold text-[13px] tracking-tight transition-colors",
                        isSelected ? "text-brand" : "text-text group-hover:text-brand"
                      )}>
                        {getDooName(req.doo_id)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black px-1.5 py-0.5 bg-bg border border-border text-text-muted rounded uppercase tracking-wider shrink-0 font-mono">
                        {req.method}
                      </span>
                      <span className="text-[12px] font-medium text-text-muted/80 truncate max-w-full group-hover:text-text transition-colors">
                        {req.path}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border",
                      isSuccess 
                        ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" 
                        : "bg-red-500/5 text-red-500 border-red-500/10"
                    )}>
                      {req.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[12px] text-text-muted font-mono font-bold group-hover:text-text transition-colors">
                      {req.duration || 0} MS
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] text-text-muted font-bold font-mono tracking-tighter uppercase whitespace-nowrap opacity-40 group-hover:opacity-80 transition-opacity">
                      {new Date(req.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                      })}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
