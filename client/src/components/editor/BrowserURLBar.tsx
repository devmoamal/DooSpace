import React from "react";
import { EarthIcon, Sparkles, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

interface BrowserURLBarProps {
  id: number;
  onFormat: () => void;
  isFormatting: boolean;
}

export const BrowserURLBar: React.FC<BrowserURLBarProps> = ({
  id,
  onFormat,
  isFormatting,
}) => {
  const deploymentUrl = `http://localhost:3000/doos/doo_${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(deploymentUrl);
    toast.success("Link copied");
  };

  const handleOpen = () => {
    window.open(deploymentUrl, "_blank");
  };

  return (
    <div className="px-5 py-2 border-b border-border bg-bg shrink-0 z-10 flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 rounded bg-surface border border-border group">
        <EarthIcon size={12} className="text-text-subtle shrink-0" />
        <div className="flex-1 min-w-0 font-mono text-[11px] truncate text-text-muted">
          {deploymentUrl}
        </div>

        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onFormat}
            disabled={isFormatting}
            className="p-1 rounded text-text-subtle hover:text-text-muted hover:bg-surface-lighter transition-colors cursor-pointer"
            title="Format"
          >
            <Sparkles size={12} className={cn(isFormatting && "animate-pulse")} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 rounded text-text-subtle hover:text-text-muted hover:bg-surface-lighter transition-colors cursor-pointer"
            title="Copy"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={handleOpen}
            className="p-1 rounded text-text-subtle hover:text-text-muted hover:bg-surface-lighter transition-colors cursor-pointer"
            title="Open"
          >
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
