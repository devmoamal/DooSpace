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
    toast.success("Deployment link copied");
  };

  const handleOpen = () => {
    window.open(deploymentUrl, "_blank");
  };

  return (
    <div className="px-6 py-2 bg-surface-lighter/10 shrink-0 z-10 flex items-center gap-4">
      <div className="flex-1 flex items-center gap-3 px-3 py-1.5 rounded-full bg-surface border border-border/60 shadow-inner group">
        <EarthIcon size={12} className="text-brand/80" />

        <div className="flex-1 min-w-0 font-mono text-[11px] truncate tracking-tight text-brand">
          {deploymentUrl}
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onFormat}
            disabled={isFormatting}
            className="p-1 hover:bg-surface-lighter rounded-md text-text/30 hover:text-brand transition-all"
            title="Format Code"
          >
            <Sparkles
              size={12}
              className={cn(isFormatting && "animate-pulse")}
            />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-surface-lighter rounded-md text-text/30 hover:text-brand transition-all"
            title="Copy link"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={handleOpen}
            className="p-1 hover:bg-surface-lighter rounded-md text-text/30 hover:text-brand transition-all"
            title="Open in new tab"
          >
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
