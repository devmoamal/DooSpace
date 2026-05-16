import React from "react";
import { cn } from "@/lib/cn";
import {
  Zap,
  Database,
  ArrowRightLeft,
  AlertCircle,
  Info,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

// ── Semantic log classifier ───────────────────────────────────────────────────
type LogKind = "error" | "callDoo" | "db" | "fetch" | "log" | "info";

function classifyLog(line: string): LogKind {
  const l = line.toLowerCase();
  if (l.includes("error") || l.includes("exception") || l.includes("fail"))
    return "error";
  if (l.includes("calldoo") || l.includes("doo #") || l.includes("→ doo"))
    return "callDoo";
  if (
    l.includes("doobox") ||
    l.includes("db ") ||
    l.includes("insert") ||
    l.includes("select") ||
    l.includes("set(") ||
    l.includes("get(")
  )
    return "db";
  if (
    l.includes("fetch") ||
    l.includes("http") ||
    l.includes("request") ||
    l.includes("response")
  )
    return "fetch";
  return "log";
}

const LOG_STYLES: Record<
  LogKind,
  { dot: string; text: string; icon: any; variant: any }
> = {
  error: {
    dot: "bg-red-500",
    text: "text-red-400",
    icon: AlertCircle,
    variant: "danger",
  },
  callDoo: {
    dot: "bg-brand",
    text: "text-brand",
    icon: ArrowRightLeft,
    variant: "brand",
  },
  db: {
    dot: "bg-amber-600",
    text: "text-amber-500",
    icon: Database,
    variant: "warning",
  },
  fetch: {
    dot: "bg-blue-500",
    text: "text-blue-400",
    icon: Zap,
    variant: "info",
  },
  log: {
    dot: "bg-text-subtle",
    text: "text-text-muted",
    icon: Info,
    variant: "neutral",
  },
  info: {
    dot: "bg-purple-500",
    text: "text-purple-400",
    icon: Info,
    variant: "neutral",
  },
};

interface TraceEventsTabProps {
  logs: string[];
}

export const TraceEventsTab: React.FC<TraceEventsTabProps> = ({ logs }) => {
  return (
    <section className="px-6 py-6 border-b border-border/50">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold text-text-subtle">Trace Events</p>
        <Badge variant="neutral" size="xs" className="font-bold opacity-60">
          {logs.length}
        </Badge>
      </div>
      <div className="space-y-1 font-mono text-[11px]">
        {logs.length > 0 ? (
          logs.map((log: string, idx: number) => {
            const kind = classifyLog(log);
            const style = LOG_STYLES[kind];
            const IconComp = style.icon;
            const text = log
              .replace(/^\[\d{4}-.*?Z\]\s*/, "")
              .replace(/^ERROR:\s*/i, "");
            const isError = kind === "error";

            return (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 px-3 py-2 border border-transparent transition-all group",
                  isError
                    ? "bg-red-500/5 border-red-500/10"
                    : "hover:bg-surface hover:border-border/50",
                )}
              >
                <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                  <IconComp
                    size={12}
                    className={cn(
                      style.text,
                      "opacity-70 group-hover:opacity-100 transition-opacity",
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold text-text-subtle/40 tabular-nums">
                      STEP {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Badge
                      variant={style.variant}
                      size="xs"
                      className="text-[8px] px-1 py-0 h-3 font-black"
                    >
                      {(kind === "callDoo" ? "DOO" : kind).toUpperCase()}
                    </Badge>
                  </div>
                  <span
                    className={cn(
                      "inline-block break-all leading-relaxed",
                      isError ? "text-red-400 font-bold" : "text-text-muted",
                    )}
                  >
                    {text}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 flex flex-col items-center justify-center opacity-30 border border-dashed border-border">
            <Terminal size={20} className="mb-2" />
            <p className="text-[10px] font-bold text-center">
              No trace data recorded
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
