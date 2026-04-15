import { cn } from "@/lib/cn";
import { type Endpoint } from "@doospace/shared";
import { Braces, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { formatTypeForDisplay } from "@/utils/typeParser";

interface EndpointSidebarProps {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  onSelect: (ep: Endpoint | null) => void;
  onMethodChange: (m: string) => void;
  onPathChange: (p: string) => void;
}

const METHOD_COLOR: Record<string, string> = {
  GET: "text-brand",
  POST: "text-blue-500",
  PUT: "text-amber-500",
  DELETE: "text-red-500",
  PATCH: "text-purple-400",
  HEAD: "text-text-subtle",
  OPTIONS: "text-text-subtle",
};

function EndpointItem({
  ep,
  isSelected,
  onSelect,
}: {
  ep: Endpoint;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSchema = ep.request_type || ep.response_type;

  return (
    <div
      className={cn(
        "rounded transition-colors border",
        isSelected
          ? "bg-surface border-border"
          : "border-transparent hover:bg-surface/50",
      )}
    >
      <div
        onClick={onSelect}
        className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer"
      >
        <span
          className={cn(
            "text-[9px] font-bold uppercase w-10 shrink-0",
            METHOD_COLOR[ep.method] ?? "text-text-subtle",
          )}
        >
          {ep.method}
        </span>
        <span className={cn("font-mono text-[11px] truncate flex-1", isSelected ? "text-text" : "text-text-subtle")}>
          {ep.path}
        </span>
        {hasSchema && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="text-text-muted hover:text-text transition-colors shrink-0 p-0.5"
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        )}
      </div>

      {expanded && hasSchema && (
        <div className="px-3 pb-2 space-y-2">
          {ep.request_type && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Braces size={9} className="text-blue-400" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-blue-400">
                  Request
                </span>
              </div>
              <pre className="text-[10px] font-mono text-text-subtle bg-bg rounded px-2 py-1.5 border border-border overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {formatTypeForDisplay(ep.request_type)}
              </pre>
            </div>
          )}
          {ep.response_type && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Braces size={9} className="text-brand" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-brand">
                  Response
                </span>
              </div>
              <pre className="text-[10px] font-mono text-text-subtle bg-bg rounded px-2 py-1.5 border border-border overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {formatTypeForDisplay(ep.response_type)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function EndpointSidebar({
  endpoints,
  selectedEndpoint,
  onSelect,
  onMethodChange,
  onPathChange,
}: EndpointSidebarProps) {
  return (
    <aside className="w-64 border-r border-border flex flex-col bg-bg overflow-y-auto shrink-0">
      <div className="h-11 border-b border-border flex items-center px-4 shrink-0">
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
          Endpoints
        </span>
        <span className="ml-auto text-[10px] font-mono text-text-subtle tabular-nums">
          {endpoints.length}
        </span>
      </div>

      <div className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {/* Custom Request */}
        <button
          onClick={() => {
            onSelect(null);
            onMethodChange("GET");
            onPathChange("/");
          }}
          className={cn(
            "w-full text-left px-3 py-2 text-[11px] font-medium rounded transition-colors border",
            !selectedEndpoint
              ? "bg-surface text-text border-border"
              : "text-text-subtle hover:bg-surface/50 border-transparent",
          )}
        >
          Custom Request
        </button>

        {endpoints.length > 0 ? (
          <>
            <div className="px-3 pt-3 pb-1">
              <span className="text-[9px] font-semibold text-text-muted uppercase tracking-widest">
                Defined
              </span>
            </div>
            {endpoints.map((ep, idx) => (
              <EndpointItem
                key={idx}
                ep={ep}
                isSelected={selectedEndpoint === ep}
                onSelect={() => onSelect(ep)}
              />
            ))}
          </>
        ) : (
          <div className="px-3 py-6 text-center">
            <p className="text-[11px] text-text-muted">No endpoints defined</p>
            <p className="text-[10px] text-text-subtle mt-1">
              Add endpoints in the editor
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
