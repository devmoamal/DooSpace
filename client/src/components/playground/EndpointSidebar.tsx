import { cn } from "@/lib/cn";
import { type Endpoint } from "@doospace/shared";

interface EndpointSidebarProps {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  onSelect: (ep: Endpoint | null) => void;
  onMethodChange: (m: string) => void;
  onPathChange: (p: string) => void;
}

export function EndpointSidebar({
  endpoints,
  selectedEndpoint,
  onSelect,
  onMethodChange,
  onPathChange,
}: EndpointSidebarProps) {
  return (
    <aside className="w-64 border-r border-border flex flex-col bg-bg overflow-y-auto">
      <div className="px-4 py-3 border-b border-border text-[10px] font-semibold text-text-muted uppercase tracking-widest shrink-0">
        Endpoints
      </div>
      <div className="flex-1 p-2 space-y-0.5">
        <button
          onClick={() => {
            onSelect(null);
            onMethodChange("GET");
            onPathChange("/");
          }}
          className={cn(
            "w-full text-left px-3 py-2 text-[11px] font-medium rounded transition-colors",
            !selectedEndpoint
              ? "bg-surface text-text"
              : "text-text-subtle hover:bg-surface/50",
          )}
        >
          Custom Request
        </button>

        {endpoints?.map((ep, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(ep)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded text-left transition-colors",
              selectedEndpoint === ep
                ? "bg-surface text-text"
                : "text-text-subtle hover:bg-surface/50",
            )}
          >
            <span
              className={cn(
                "text-[9px] font-bold uppercase w-10 shrink-0",
                ep.method === "GET" && "text-brand",
                ep.method === "POST" && "text-blue-500",
                ep.method === "PUT" && "text-amber-500",
                ep.method === "DELETE" && "text-red-500",
              )}
            >
              {ep.method}
            </span>
            <span className="font-mono text-[10px] truncate flex-1">
              {ep.path}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
