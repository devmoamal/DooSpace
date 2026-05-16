import { useState, useRef } from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { API_BASE_URL } from "@/constants";

interface PreviewPanelProps {
  pageId: string;
  pageName: string;
  updatedAt: string;
}

export function PreviewPanel({ pageId, pageName, updatedAt }: PreviewPanelProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const previewUrl = `${API_BASE_URL}/pages/${pageId}/serve?t=${new Date(updatedAt).getTime()}`;

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden relative">
      {/* Toolbar */}
      <div className="h-11 border-b border-border bg-surface/50 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
           {/* Device Toggle */}
           <div className="flex items-center gap-1 border border-border p-0.5 bg-bg">
            {(["desktop", "tablet", "mobile"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={cn(
                  "p-1.5 transition-all rounded-none",
                  device === d ? "bg-surface text-brand shadow-sm" : "text-text-subtle hover:text-text-muted"
                )}
              >
                {d === "desktop" && <Monitor size={14} />}
                {d === "tablet" && <Tablet size={14} />}
                {d === "mobile" && <Smartphone size={14} />}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-mono text-text-muted opacity-50 uppercase tracking-widest hidden md:inline">
            Live Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          <IconButton onClick={refreshPreview} variant="subtle" size="sm" title="Refresh">
            <RefreshCw size={14} />
          </IconButton>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <IconButton variant="subtle" size="sm" title="Open in new tab">
              <ExternalLink size={14} />
            </IconButton>
          </a>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-hidden p-8 flex items-start justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat">
         <div className={cn(
           "bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-border transition-all duration-300 overflow-hidden",
           device === "desktop" && "w-full h-full",
           device === "tablet" && "w-[768px] h-full",
           device === "mobile" && "w-[375px] h-[667px] my-auto"
         )}>
           <iframe
             ref={iframeRef}
             src={previewUrl}
             className="w-full h-full border-none"
             title={pageName}
             sandbox="allow-scripts allow-modals allow-popups allow-forms"
           />
         </div>
      </div>
    </div>
  );
}
