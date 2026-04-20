import { useState, useEffect } from "react";
import { useDoosQuery } from "@/hooks/queries/useDoos";
import { type Doo } from "@doospace/shared";
import { PAGINATION } from "@/constants";
import {
  Plus, Loader2, ChevronLeft, ChevronRight,
  Search, LayoutGrid, List,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DooListItem } from "@/components/dashboard/DooListItem";
import { CreateDooModal } from "@/components/dashboard/CreateDooModal";
import { cn } from "@/lib/cn";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { IconButton } from "@/components/ui/IconButton";
import { Terminal } from "lucide-react";

export function DoosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const limit = PAGINATION.DEFAULT_LIMIT;

  const debouncedSearch = useDebounce(searchQuery, 300);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, sortBy]);

  const { data: doosResponse, isLoading } = useDoosQuery({
    page, limit,
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    sort: sortBy,
  });

  const doos = doosResponse?.data || [];
  const meta = doosResponse?.meta as any;

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
        {/* Header */}
        <header className="h-11 border-b border-border flex items-center justify-between px-5 bg-bg/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[13px] font-bold text-text">Logic Units</h1>
            {meta?.total != null && (
              <Badge variant="neutral" size="xs" className="font-mono tabular-nums opacity-60">{meta.total}</Badge>
            )}
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            variant="primary" 
            size="sm" 
            className="gap-2 h-7.5 rounded-none"
          >
            <Plus size={14} />
            New Doo
          </Button>
        </header>

        <main className="flex-1 px-5 py-5 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {/* Search */}
            <Input
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search Doos..."
              className="max-w-xs h-8"
              leftIcon={<Search size={13} />}
              onClear={searchQuery ? () => setSearchQuery("") : undefined}
            />

            {/* Status filter */}
            <div className="flex items-center bg-surface border border-border rounded-none p-0.5">
              {(["all", "active", "inactive"] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setStatusFilter(id)}
                  className={cn(
                    "px-3 py-1 rounded-none text-[10px] font-bold transition-all cursor-pointer",
                    statusFilter === id
                      ? "bg-bg text-text shadow-sm"
                      : "text-text-muted hover:text-text-subtle"
                  )}
                >
                  {id}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-4">
              {/* Sort */}
              <button
                onClick={() => setSortBy((s) => (s === "asc" ? "desc" : "asc"))}
                className="text-[10px] font-bold text-text-muted hover:text-text-subtle transition-all cursor-pointer flex items-center gap-1.5"
              >
                {sortBy === "desc" ? "Newest First" : "Oldest First"}
              </button>

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
            ) : doos.length > 0 ? (
              <div className={cn(
                "animate-in fade-in slide-in-from-bottom-2 duration-300",
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-2"
              )}>
                {doos.map((doo: Doo) => (
                  <DooListItem key={doo.id} doo={doo} view={viewMode} />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-60">
                <div className="w-12 h-12 rounded-none bg-surface border border-border flex items-center justify-center mb-5">
                   <Terminal size={20} className="text-text-muted" />
                </div>
                <p className="text-[13px] font-medium text-text-muted mb-1">
                  {searchQuery || statusFilter !== "all" ? "No matches found" : "No logic units yet"}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <button
                    onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                    className="text-[11px] font-bold text-brand hover:underline cursor-pointer mt-2"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta && meta.lastPage > 1 && (
            <div className="border-t border-border pt-4 mt-6 flex items-center justify-between shrink-0">
               <Badge variant="neutral" size="sm" className="font-mono opacity-60 tabular-nums">
                {doos.length} of {meta.total} units
              </Badge>
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="subtle"
                  size="sm"
                >
                  <ChevronLeft size={14} />
                </IconButton>
                
                <div className="px-3 py-1 bg-surface border border-border text-[11px] font-bold font-mono text-text-muted">
                   {page} / {meta.lastPage}
                </div>

                <IconButton
                  onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                  disabled={page === meta.lastPage}
                  variant="subtle"
                  size="sm"
                >
                  <ChevronRight size={14} />
                </IconButton>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateDooModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
