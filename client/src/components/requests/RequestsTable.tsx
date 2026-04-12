import { cn } from "@/lib/cn";
import { DooAvatar } from "@/components/ui/DooAvatar";

interface Request {
  id: number;
  doo_id: number;
  method: string;
  path: string;
  status: number;
  duration?: number;
  created_at: string;
}

interface RequestsTableProps {
  requests: Request[];
  getDooName: (id: number) => string;
}

export function RequestsTable({ requests, getDooName }: RequestsTableProps) {
  return (
    <div className="flex-1 flex flex-col bg-bg border border-border rounded-lg overflow-hidden min-h-0">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border sticky top-0 z-10">
              <th className="px-6 py-3 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-bg">
                Doo
              </th>
              <th className="px-6 py-3 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-bg">
                Interface
              </th>
              <th className="px-6 py-3 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-bg">
                Status
              </th>
              <th className="px-6 py-3 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-bg">
                Latency
              </th>
              <th className="px-6 py-3 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-bg text-center">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {requests.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-surface-lighter transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <DooAvatar
                      id={req.doo_id}
                      size={28}
                      className="rounded-md ring-1 ring-border/50 group-hover:ring-brand/40 transition-all"
                    />
                    <span className="font-semibold text-[13px] text-text tracking-tight">
                      {getDooName(req.doo_id)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-bg border border-border text-text-muted rounded uppercase tracking-wider">
                      {req.method}
                    </span>
                    <span className="text-[11px] font-medium text-text-muted truncate max-w-[200px] font-mono">
                      {req.path}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
                      req.status < 400
                        ? "bg-brand/5 text-brand border-brand/20"
                        : "bg-red-500/5 text-red-500 border-red-500/20",
                    )}
                  >
                    {req.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-mono font-bold">
                    {req.duration || 0} MS
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-[10px] text-text-muted font-bold opacity-40 font-mono tracking-tighter uppercase whitespace-nowrap">
                    {new Date(req.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
