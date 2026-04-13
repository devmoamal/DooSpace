import { useState, useEffect } from "react";
import { useDoosQuery } from "@/hooks/queries/useDoos";
import { type Doo } from "@doospace/shared";
import { PAGINATION } from "@/constants";
import {
  Plus, Loader2, ChevronLeft, ChevronRight,
  Search, X, LayoutGrid, List,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DooListItem } from "@/components/dashboard/DooListItem";
import { CreateDooModal } from "@/components/dashboard/CreateDooModal";
import { cn } from "@/lib/cn";
import { useDebounce } from "@/hooks/useDebounce";

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
        <header className="h-11 border-b border-border flex items-center justify-between px-5 bg-bg sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[13px] font-semibold text-text">Doos</h1>
            {meta?.total != null && (
              <span className="text-[11px] font-mono text-text-subtle tabular-nums">{meta.total}</span>
            )}
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5">
            <Plus size={13} />
            New Doo
          </Button>
        </header>

        <main className="flex-1 px-5 py-4 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {/* Search */}
            <div className="relative flex items-center max-w-xs flex-1">
              <Search className="absolute left-2.5 text-text-subtle" size={13} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full bg-surface border border-border rounded pl-8 pr-7 text-[12px] text-text outline-none focus:border-border-hover transition-colors placeholder:text-text-subtle"
                placeholder="Search…"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-text-subtle hover:text-text-muted transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-0.5 bg-surface border border-border rounded p-0.5">
              {(["all", "active", "inactive"] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setStatusFilter(id)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer capitalize",
                    statusFilter === id
                      ? "bg-bg text-text"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  {id}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Sort */}
              <button
                onClick={() => setSortBy((s) => (s === "asc" ? "desc" : "asc"))}
                className="text-[11px] font-mono text-text-subtle hover:text-text-muted transition-colors cursor-pointer px-2 py-1 rounded hover:bg-surface"
                title="Toggle sort"
              >
                {sortBy === "desc" ? "↓ newest" : "↑ oldest"}
              </button>

              {/* View mode */}
              <div className="flex items-center border border-border rounded overflow-hidden bg-surface">
                {(["grid", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "p-1.5 transition-colors cursor-pointer",
                      viewMode === mode
                        ? "bg-bg text-text"
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
                <Loader2 className="animate-spin text-text-subtle" size={18} />
              </div>
            ) : doos.length > 0 ? (
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                  : "flex flex-col gap-2"
              )}>
                {doos.map((doo: Doo) => (
                  <DooListItem key={doo.id} doo={doo} view={viewMode} />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <p className="text-[12px] text-text-subtle mb-3">
                  {searchQuery || statusFilter !== "all" ? "No matching Doos" : "No Doos yet"}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <button
                    onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                    className="text-[11px] font-mono text-text-subtle hover:text-text-muted underline cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta && meta.lastPage > 1 && (
            <div className="border-t border-border pt-3 mt-3 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-text-subtle tabular-nums">
                {doos.length} / {meta.total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 w-7 flex items-center justify-center rounded border border-border text-text-subtle hover:text-text-muted hover:bg-surface disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={12} />
                </button>
                <span className="text-[11px] font-mono text-text-muted px-2 tabular-nums">
                  {page} / {meta.lastPage}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                  disabled={page === meta.lastPage}
                  className="h-7 w-7 flex items-center justify-center rounded border border-border text-text-subtle hover:text-text-muted hover:bg-surface disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateDooModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
