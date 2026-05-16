import { useState } from "react";
import { usePages } from "@/hooks/queries/usePages";
import { type Page } from "@doospace/shared";
import {
  Plus, Loader2, Search, LayoutGrid, List, FileText
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageListItem } from "@/components/studio/PageListItem";
import { CreatePageModal } from "@/components/studio/CreatePageModal";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export function PagesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { useListPages, useDeletePage } = usePages();
  const { data: pages = [], isLoading } = useListPages();
  const deletePage = useDeletePage();

  const filteredPages = pages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
        {/* Header */}
        <header className="h-11 border-b border-border flex items-center justify-between px-5 bg-bg/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[13px] font-bold text-text">UX Apps</h1>
            <Badge variant="neutral" size="xs" className="font-mono tabular-nums opacity-60">
              {pages.length}
            </Badge>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            variant="primary" 
            size="sm" 
            className="gap-2 h-7.5 rounded-none"
          >
            <Plus size={14} />
            New App
          </Button>
        </header>

        <main className="flex-1 px-5 py-5 overflow-y-auto no-scrollbar flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="max-w-xs h-8"
              leftIcon={<Search size={13} />}
              onClear={searchQuery ? () => setSearchQuery("") : undefined}
            />

            <div className="ml-auto flex items-center gap-4">
               {/* View mode */}
               <div className="flex items-center border border-border rounded-none overflow-hidden bg-surface p-0.5">
                {(["grid", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "p-1.5 transition-all cursor-pointer rounded-none",
                      viewMode === mode
                        ? "bg-bg text-brand shadow-sm"
                        : "text-text-subtle hover:text-text-muted"
                    )}
                  >
                    {mode === "grid" ? <LayoutGrid size={14} /> : <List size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {isLoading ? (
              <div className="h-full flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-brand" size={20} />
              </div>
            ) : filteredPages.length > 0 ? (
              <div className={cn(
                "animate-in fade-in slide-in-from-bottom-2 duration-300",
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-2"
              )}>
                {filteredPages.map((page: Page) => (
                  <PageListItem 
                    key={page.id} 
                    page={page} 
                    view={viewMode} 
                    onDelete={(id) => {
                      if (confirm("Are you sure you want to delete this app?")) {
                        deletePage.mutate(id);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-60">
                <div className="w-12 h-12 rounded-none bg-surface border border-border flex items-center justify-center mb-5">
                   <FileText size={20} className="text-text-muted" />
                </div>
                <p className="text-[13px] font-medium text-text-muted mb-1">
                  {searchQuery ? "No matches found" : "No apps built yet"}
                </p>
                {!searchQuery && (
                   <p className="text-[11px] text-text-muted text-center max-w-[200px]">
                   Use the agent to build beautiful UIs and link them with your Doos.
                 </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <CreatePageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
