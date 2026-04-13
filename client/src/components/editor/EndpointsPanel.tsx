import { useState } from "react";
import { Hash, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { type Endpoint } from "@doospace/shared";

interface EndpointsPanelProps {
  endpoints: Endpoint[];
  className?: string;
}

const METHOD_COLOR: Record<string, string> = {
  GET:    "text-brand",
  POST:   "text-blue-500",
  PUT:    "text-amber-500",
  PATCH:  "text-amber-500",
  DELETE: "text-red-500",
};

export function EndpointsPanel({ endpoints, className }: EndpointsPanelProps) {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

  const toggleExpand = (idx: number) => {
    const next = new Set(expandedIndices);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setExpandedIndices(next);
  };

  return (
    <div className={cn("flex flex-col h-full bg-bg border-l border-border", className)}>
      {/* Header */}
      <div className="h-11 px-4 flex items-center gap-2 border-b border-border shrink-0">
        <Hash size={12} className="text-text-subtle" />
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
          Endpoints
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {endpoints.length > 0 ? (
          <div className="divide-y divide-border">
            {endpoints.map((ep, i) => {
              const isExpanded = expandedIndices.has(i);
              const methodColor = METHOD_COLOR[ep.method.toUpperCase()] ?? "text-text-muted";

              return (
                <div key={i} className={cn("flex flex-col", isExpanded && "bg-surface")}>
                  <button
                    onClick={() => toggleExpand(i)}
                    className="flex items-center gap-2.5 px-4 py-3 text-left min-w-0 group w-full cursor-pointer transition-colors hover:bg-surface"
                  >
                    <ChevronRight
                      size={12}
                      className={cn(
                        "transition-transform text-text-subtle shrink-0",
                        isExpanded && "rotate-90"
                      )}
                    />
                    <span className={cn(
                      "text-[9px] font-bold uppercase shrink-0 tracking-wide",
                      methodColor
                    )}>
                      {ep.method}
                    </span>
                    <span className={cn(
                      "flex-1 font-mono text-[11px] truncate",
                      isExpanded ? "text-text" : "text-text-muted"
                    )}>
                      {ep.path}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <TypeBlock label="Payload" typeStr={ep.request_type} />
                      <TypeBlock label="Returns" typeStr={ep.response_type} isResponse />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-text-subtle">
            <Hash size={20} className="mb-2 opacity-30" />
            <span className="text-[10px] font-medium uppercase tracking-widest opacity-40">
              No routes
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TypeBlock({ label, typeStr, isResponse }: { label: string; typeStr?: string; isResponse?: boolean }) {
  const formatted = typeStr ? formatType(typeStr) : null;

  return (
    <div className="space-y-1.5">
      <span className="text-[9px] font-semibold text-text-subtle uppercase tracking-wider">{label}</span>
      <div className={cn(
        "p-3 rounded border font-mono text-[10px] leading-relaxed overflow-x-auto",
        isResponse
          ? "bg-brand-muted border-brand/10 text-brand"
          : "bg-surface border-border text-text-muted"
      )}>
        {formatted ? (
          <pre className="whitespace-pre">{formatted}</pre>
        ) : (
          <span className="text-text-subtle text-[9px]">
            {isResponse ? "Standard Response" : "No payload"}
          </span>
        )}
      </div>
    </div>
  );
}

function formatType(typeStr: string): string {
  if (!typeStr) return "any";
  let str = typeStr.trim();
  if (!str.includes("{") && !str.includes("[")) return str;

  let result = "";
  let indent = 0;
  const step = 2;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];
    const prevChar = str[i - 1];

    if (char === "{" || char === "[") {
      if (nextChar === "}" || nextChar === "]") {
        result += char;
      } else {
        indent++;
        result += char + "\n" + " ".repeat(indent * step);
      }
    } else if (char === "}" || char === "]") {
      if (prevChar === "{" || prevChar === "[") {
        result += char;
      } else {
        indent = Math.max(0, indent - 1);
        result += "\n" + " ".repeat(indent * step) + char;
      }
    } else if (char === ";" || char === ",") {
      result += char + "\n" + " ".repeat(indent * step);
      while (str[i + 1] === " ") i++;
    } else if (char === ":") {
      result += ": ";
      while (str[i + 1] === " ") i++;
    } else {
      if (char !== " " || (result.length > 0 && result[result.length - 1] !== " ")) {
        result += char;
      }
    }
  }
  return result.trim();
}
