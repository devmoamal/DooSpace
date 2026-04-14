import { Loader2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/constants";

interface UrlBarProps {
  id: number;
  method: string;
  onMethodChange: (m: string) => void;
  path: string;
  onPathChange: (p: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export function UrlBar({
  id,
  method,
  onMethodChange,
  path,
  onPathChange,
  onSend,
  isSending,
}: UrlBarProps) {
  return (
    <div className="p-4 border-b border-border flex gap-3 shrink-0 bg-surface/30">
      <select
        value={method}
        onChange={(e) => onMethodChange(e.target.value)}
        className="h-9 px-3 rounded bg-surface border border-border text-[12px] font-medium text-text outline-none cursor-pointer"
      >
        {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <div className="flex-1 flex items-center bg-surface border border-border rounded px-3 overflow-hidden focus-within:border-brand-muted transition-colors">
        <span className="text-text-muted text-[12px] font-mono mr-1">
          {API_BASE_URL}/doos/doo_{id}
        </span>
        <input
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono text-text h-full py-2"
          placeholder="/my-endpoint/:id"
        />
      </div>
      <Button onClick={onSend} disabled={isSending}>
        {isSending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Terminal size={14} className="fill-current" />
        )}
        Send
      </Button>
    </div>
  );
}
