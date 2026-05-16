import { useParams, Link } from "@tanstack/react-router";
import { usePages } from "@/hooks/queries/usePages";
import { ChatPanel } from "@/components/studio/ChatPanel";
import { PreviewPanel } from "@/components/studio/PreviewPanel";
import { ArrowLeft, Loader2, Settings, History, Layers } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";

export function PageStudio() {
  const { pageId } = useParams({ from: "/pages/$pageId" });
  const { usePage } = usePages();
  const { data, isLoading, isError } = usePage(pageId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand" size={32} />
          <p className="text-[11px] font-mono text-text-muted animate-pulse">
            LOADING_STUDIO_ENVIRONMENT...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg gap-6">
        <p className="text-[13px] font-bold text-red-500">
          FAILED_TO_LOAD_PAGE
        </p>
        <Link to="/pages">
          <Button variant="secondary" size="sm" className="gap-2">
            <ArrowLeft size={14} />
            Back to Library
          </Button>
        </Link>
      </div>
    );
  }

  const { page, messages } = data;

  return (
    <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden animate-in fade-in duration-500">
      {/* Studio Navbar */}
      <header className="h-12 border-b border-border bg-surface/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/pages" className="hover:opacity-70 transition-opacity">
            <ArrowLeft size={18} className="text-text-muted" />
          </Link>
          <div className="h-4 w-px bg-border mx-1" />
          <div className="flex flex-col">
            <h1 className="text-[14px] font-bold text-text tracking-tight uppercase">
              {page.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[9px] font-mono text-text-subtle tracking-wider">
                PROJECT_LIVE
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton variant="ghost" size="sm" title="History">
            <History size={16} />
          </IconButton>
          <IconButton variant="ghost" size="sm" title="Components">
            <Layers size={16} />
          </IconButton>
          <div className="h-4 w-px bg-border mx-2" />
          <IconButton variant="ghost" size="sm" title="Project Settings">
            <Settings size={16} />
          </IconButton>
          <Button
            variant="primary"
            size="sm"
            className="h-8 uppercase font-bold tracking-widest px-4 rounded-none ml-2 shadow-[0_4px_14px_rgba(var(--brand-rgb),0.3)]"
          >
            Deploy
          </Button>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        <ChatPanel pageId={page.id} messages={messages} />
        <PreviewPanel
          pageId={page.id}
          pageName={page.name}
          updatedAt={page.updated_at}
        />
      </div>
    </div>
  );
}
