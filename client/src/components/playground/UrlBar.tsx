import { Loader2, Zap } from "lucide-react";
import { API_BASE_URL } from "@/constants";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

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
    <div className="h-[52px] flex items-center gap-3 px-5 shrink-0 bg-bg/50 border-b border-border backdrop-blur-md sticky top-0 z-20">
      {/* Search/Command Input Container */}
      <div className="flex-1 flex items-center h-8.5 bg-surface border border-border rounded-none overflow-hidden group focus-within:border-brand/40 focus-within:ring-1 focus-within:ring-brand/10 transition-all">
        {/* Method selector wrapper */}
        <div className="h-full border-r border-border bg-surface/50">
          <Select
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
            className={cn(
              "h-full px-4 font-black text-[10px] border-none bg-transparent hover:bg-surface transition-colors cursor-pointer min-w-[90px]",
              methodColor,
            )}
          >
            {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>

        {/* URL Input Area */}
        <div className="flex-1 flex items-center px-4 gap-2 min-w-0">
          <span className="text-text-subtle/50 text-[10px] font-bold font-mono shrink-0">
            {API_BASE_URL.replace(/^https?:\/\//, "")}/doos/doo_{id}
          </span>
          <input
            value={path}
            onChange={(e) => onPathChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono font-bold text-text h-full min-w-0 placeholder:text-text-subtle/30"
            placeholder="/endpoint/:id"
          />
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        size="md"
        onClick={onSend}
        disabled={isSending}
        className="h-8.5 px-6 gap-2.5 rounded-none font-black text-[10px] shadow-lg shadow-brand/10"
      >
        {isSending ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Zap size={13} className="fill-current" />
        )}
        {isSending ? "Processing" : "Execute"}
      </Button>
    </div>
  );
}
