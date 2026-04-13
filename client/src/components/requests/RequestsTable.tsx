import { cn } from "@/lib/cn";

interface Request {
  id: string;
  doo_id: number;
  method: string;
  path: string;
  status: number;
  duration: number;
  created_at: string;
}

interface RequestsTableProps {
  requests: Request[];
  getDooName: (id: number) => string;
  onSelect: (request: Request) => void;
  selectedId?: string | null;
}

const METHOD_COLOR: Record<string, string> = {
  GET:    "text-brand",
  POST:   "text-blue-500",
  PUT:    "text-amber-500",
  PATCH:  "text-amber-500",
  DELETE: "text-red-500",
};

export function RequestsTable({ requests, getDooName, onSelect, selectedId }: RequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-[11px] font-mono text-text-subtle uppercase tracking-widest">
          No requests yet
        </p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-border">
          <th className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest w-32">Doo</th>
          <th className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest w-16">Method</th>
          <th className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest">Path</th>
          <th className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest w-16 text-center">Status</th>
          <th className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest w-28 text-right">When</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => {
          const isSelected = selectedId === req.id;
          const isError = req.status >= 400;
          const methodColor = METHOD_COLOR[req.method.toUpperCase()] ?? "text-text-muted";

          return (
            <tr
              key={req.id}
              onClick={() => onSelect(req)}
              className={cn(
                "border-b border-border cursor-pointer transition-colors",
                isSelected ? "bg-surface" : "hover:bg-surface",
              )}
            >
              <td className="px-4 py-3">
                <span className="text-[12px] font-mono text-text-muted truncate block max-w-[120px]">
                  {getDooName(req.doo_id)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={cn("text-[10px] font-mono font-semibold uppercase tracking-wide", methodColor)}>
                  {req.method}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-[12px] font-mono text-text truncate block max-w-md">
                  {req.path}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={cn(
                  "text-[12px] font-mono tabular-nums font-medium",
                  isError ? "text-red-500" : "text-brand"
                )}>
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-[11px] font-mono text-text-muted tabular-nums">
                  {new Date(req.created_at).toLocaleTimeString([], {
                    hour: "2-digit", minute: "2-digit", hour12: false,
                  })}
                </span>
                <span className="text-[10px] font-mono text-text-subtle tabular-nums ml-2">
                  {req.duration}ms
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
