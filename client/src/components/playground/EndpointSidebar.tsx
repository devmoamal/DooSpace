import { cn } from "@/lib/cn";
import { type Endpoint } from "@doospace/shared";
import { Braces, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { formatTypeForDisplay } from "@/utils/typeParser";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";

interface EndpointSidebarProps {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  onSelect: (ep: Endpoint | null) => void;
  onMethodChange: (m: string) => void;
  path: string;
  onPathChange: (p: string) => void;
}

const METHOD_VARIANT: Record<string, any> = {
  GET: "success",
  POST: "info",
  PUT: "warning",
  DELETE: "danger",
  PATCH: "brand",
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
        "rounded-none transition-all border",
        isSelected
          ? "bg-surface border-border shadow-sm"
          : "border-transparent hover:bg-surface/50",
      )}
    >
      <div
        onClick={onSelect}
        className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer group"
      >
        <Badge 
          variant={METHOD_VARIANT[ep.method] || "default"} 
          size="xs"
          className="w-10 justify-center shrink-0"
        >
          {ep.method}
        </Badge>
        <span className={cn("font-mono text-[11px] truncate flex-1", isSelected ? "text-text" : "text-text-subtle group-hover:text-text-muted")}>
          {ep.path}
        </span>
        {hasSchema && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            variant="ghost"
            size="xs"
            className="shrink-0"
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </IconButton>
        )}
      </div>

      {expanded && hasSchema && (
        <div className="px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {ep.request_type && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Braces size={10} className="text-blue-400" />
                <span className="text-[9px] font-bold text-blue-400">
                  Request
                </span>
              </div>
              <pre className="text-[10px] font-mono text-text-subtle bg-bg rounded-none px-2.5 py-2 border border-border/50 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed custom-scrollbar">
                {formatTypeForDisplay(ep.request_type)}
              </pre>
            </div>
          )}
          {ep.response_type && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Braces size={10} className="text-brand" />
                <span className="text-[9px] font-bold text-brand">
                  Response
                </span>
              </div>
              <pre className="text-[10px] font-mono text-text-subtle bg-bg rounded-none px-2.5 py-2 border border-border/50 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed custom-scrollbar">
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
    <aside className="w-full h-full flex flex-col bg-surface overflow-y-auto">
      <div className="h-11 border-b border-border flex items-center px-4 shrink-0 bg-surface/50">
        <span className="text-[10px] font-bold text-text-muted">
          Endpoints
        </span>
        <span className="ml-auto text-[10px] font-mono text-text-subtle tabular-nums bg-bg px-1.5 py-0.5 border border-border">
          {endpoints.length}
        </span>
      </div>

      <div className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
        {/* Custom Request */}
        <button
          onClick={() => {
            onSelect(null);
            onMethodChange("GET");
            onPathChange("/");
          }}
          className={cn(
            "w-full text-left px-3 py-2 text-[11px] font-medium rounded-none transition-all border",
            !selectedEndpoint
              ? "bg-surface text-text border-border shadow-sm"
              : "text-text-subtle hover:bg-surface/50 border-transparent hover:text-text-muted",
          )}
        >
          Custom Request
        </button>

        {endpoints.length > 0 ? (
          <>
            <div className="px-3 pt-4 pb-1">
              <span className="text-[9px] font-bold text-text-muted/60">
                Discovery
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
          <div className="px-3 py-10 text-center opacity-50">
            <p className="text-[11px] font-medium text-text-muted">No endpoints found</p>
            <p className="text-[10px] text-text-subtle mt-1 leading-relaxed">
              Define endpoints in your code<br />to see them here.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
