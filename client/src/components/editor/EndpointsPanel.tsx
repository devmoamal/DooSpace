import { useState } from "react";
import { Hash, ChevronRight } from "lucide-react";
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
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

  const toggleExpand = (idx: number) => {
    const next = new Set(expandedIndices);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setExpandedIndices(next);
  };

  return (
    <div className={cn("flex flex-col h-full bg-surface border-l border-border", className)}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border bg-bg/20">
        <div className="flex items-center gap-2">
          <Hash size={12} className="text-brand" />
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            Endpoints
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {endpoints.length > 0 ? (
          <div className="divide-y divide-border/30">
            {endpoints.map((ep, i) => {
              const isExpanded = expandedIndices.has(i);
              const { method, path } = ep;

              return (
                <div key={i} className={cn("flex flex-col transition-all duration-200", isExpanded ? "bg-bg/40" : "hover:bg-bg/20")}>
                  <button
                    onClick={() => toggleExpand(i)}
                    className="flex items-center gap-3 px-4 py-3.5 text-left min-w-0 group w-full"
                  >
                    <ChevronRight 
                      size={12} 
                      className={cn("transition-transform duration-300 text-text-muted/30", isExpanded && "rotate-90 text-brand")} 
                    />
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded-[4px] border uppercase shrink-0 transition-colors",
                      method === "GET" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" :
                      method === "POST" ? "text-blue-500 border-blue-500/20 bg-blue-500/5" :
                      method === "DELETE" ? "text-red-500 border-red-500/20 bg-red-500/5" :
                      "text-amber-500 border-amber-500/20 bg-amber-500/5"
                    )}>
                      {method}
                    </span>
                    <span className={cn(
                      "flex-1 font-mono text-[11px] truncate tracking-tight transition-colors",
                      isExpanded ? "text-text font-bold" : "text-text/60 group-hover:text-text/90 font-medium"
                    )}>
                      {path}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="space-y-5 pt-2">
                        <TypeSquare 
                          label="Payload" 
                          typeStr={ep.request_type} 
                        />
                        <TypeSquare 
                          label="Returns" 
                          typeStr={ep.response_type} 
                          isResponse
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 opacity-20">
            <Hash size={24} />
            <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">No Routes Detected</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TypeSquare({ label, typeStr, isResponse }: { label: string, typeStr?: string, isResponse?: boolean }) {
  const formatted = typeStr ? formatType(typeStr) : null;
  
  return (
    <div className="flex flex-col gap-1.5">
      <div className="px-0.5">
        <span className="text-[8px] font-black text-text-muted/40 uppercase tracking-[0.15em]">{label}</span>
      </div>
      <div className={cn(
        "p-3 rounded-lg border font-mono text-[10px] leading-relaxed overflow-x-auto transition-all shadow-inner",
        isResponse ? "bg-brand/[0.01] border-brand/10 text-brand/80" : "bg-bg/40 border-border/60 text-text/50"
      )}>
        {formatted ? (
          <pre className="whitespace-pre scrollbar-hide">{formatted}</pre>
        ) : (
          <span className="italic text-text-muted/20 text-[9px] font-medium">
            {isResponse ? "Returns standard Response" : "No payload required"}
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
      while (str[i+1] === " ") i++;
    } else if (char === ":") {
      result += ": ";
      while (str[i+1] === " ") i++;
    } else {
      if (char !== " " || (result.length > 0 && result[result.length - 1] !== " ")) {
        result += char;
      }
    }
  }
  return result.trim();
}
