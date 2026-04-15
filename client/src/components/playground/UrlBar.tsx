import { Loader2, Zap } from "lucide-react";
import { API_BASE_URL } from "@/constants";
import { cn } from "@/lib/cn";

interface UrlBarProps {
  id: number;
  method: string;
  onMethodChange: (m: string) => void;
  path: string;
  onPathChange: (p: string) => void;
  onSend: () => void;
  isSending: boolean;
}

const METHOD_COLOR: Record<string, string> = {
  GET: "text-brand",
  POST: "text-blue-400",
  PUT: "text-amber-400",
  PATCH: "text-purple-400",
  DELETE: "text-red-400",
  HEAD: "text-text-subtle",
  OPTIONS: "text-text-subtle",
};

export function UrlBar({
  id,
  method,
  onMethodChange,
  path,
  onPathChange,
  onSend,
  isSending,
}: UrlBarProps) {
  const methodColor = METHOD_COLOR[method] ?? "text-text";

  return (
    <div className="h-[52px] border-b border-border flex items-center gap-2 px-4 shrink-0 bg-surface/30">
      {/* Method selector */}
      <div className="relative">
        <select
          value={method}
          onChange={(e) => onMethodChange(e.target.value)}
          className={cn(
            "h-8 pl-3 pr-7 rounded bg-surface border border-border text-[11px] font-bold uppercase outline-none cursor-pointer appearance-none transition-colors",
            methodColor,
          )}
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* URL input */}
      <div className="flex-1 flex items-center h-8 bg-surface border border-border rounded px-3 overflow-hidden focus-within:border-brand-muted transition-colors gap-1">
        <span className="text-text-muted text-[11px] font-mono shrink-0">
          {API_BASE_URL}/doos/doo_{id}
        </span>
        <input
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono text-text h-full min-w-0"
          placeholder="/endpoint/:id"
        />
      </div>

      {/* Send button */}
      <button
        onClick={onSend}
        disabled={isSending}
        className={cn(
          "h-8 px-4 rounded text-[11px] font-semibold flex items-center gap-2 transition-all",
          "bg-brand text-white hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {isSending ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Zap size={12} />
        )}
        Send
      </button>
    </div>
  );
}
