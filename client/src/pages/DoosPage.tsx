import { useState, useEffect } from "react";
import { useDoosQuery } from "@/hooks/queries/useDoos";
import { type Doo } from "@doospace/shared";
import { PAGINATION } from "@/constants";


import {
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Filter,
  X,
  LayoutGrid,
  List,
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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const limit = PAGINATION.DEFAULT_LIMIT;


  const debouncedSearch = useDebounce(searchQuery, 300);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortBy]);

  const { data: doosResponse, isLoading } = useDoosQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    sort: sortBy,
  });

  const doos = doosResponse?.data || [];
  const meta = doosResponse?.meta as any;


  const renderFilterButton = (id: string, label: string) => {
    const active = statusFilter === id;
    return (
      <button
        onClick={() => setStatusFilter(id as any)}
        className={cn(
          "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
          active
            ? "bg-brand/15 text-brand ring-1 ring-brand/30"
            : "text-text-muted hover:text-text hover:bg-surface-lighter",
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-bg sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-text uppercase tracking-tight">
              DOOs
            </h1>
            <div className="h-4 w-px bg-border mx-2" />
            <p className="text-xs text-text-muted font-medium uppercase tracking-widest">
              Orchestration Units
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="gap-2"
          >
            <Plus size={14} />
            <span>New Doo</span>
          </Button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-2 rounded-xl">
            <div className="relative group flex items-center flex-1 max-w-md">
              <Search
                className={cn(
                  "absolute left-3 transition-colors",
                  searchQuery
                    ? "text-brand"
                    : "text-text-muted/40 group-focus-within:text-brand",
                )}
                size={14}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full bg-bg border border-border rounded-lg pl-10 pr-10 text-[11px] font-bold tracking-wider focus:outline-none focus:border-brand/40 transition-all text-text placeholder:text-text-muted/40 shadow-inner"
                placeholder="Search Doo Name or Description..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 bg-bg p-1 rounded-lg border border-border">
                {renderFilterButton("all", "All")}
                {renderFilterButton("active", "Active")}
                {renderFilterButton("inactive", "Inactive")}
              </div>

              <div className="h-4 w-px bg-border" />

              <button
                onClick={() => setSortBy((s) => (s === "asc" ? "desc" : "asc"))}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg border border-border hover:border-brand/30 text-text-muted hover:text-text transition-all group cursor-pointer"
                title={`Sort by Date: ${sortBy === "asc" ? "Oldest First" : "Newest First"}`}
              >
                {sortBy === "desc" ? (
                  <ArrowDownWideNarrow
                    size={14}
                    className="group-hover:text-brand transition-colors"
                  />
                ) : (
                  <ArrowUpWideNarrow
                    size={14}
                    className="group-hover:text-brand transition-colors"
                  />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {sortBy}
                </span>
              </button>

              <div className="h-4 w-px bg-border mx-1" />

              <div className="flex items-center p-1 bg-bg border border-border rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded transition-all cursor-pointer",
                    viewMode === "grid"
                      ? "bg-brand/15 text-brand"
                      : "text-text-muted hover:text-text hover:bg-surface-lighter"
                  )}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded transition-all cursor-pointer",
                    viewMode === "list"
                      ? "bg-brand/15 text-brand"
                      : "text-text-muted hover:text-text hover:bg-surface-lighter"
                  )}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-2">
            {isLoading ? (
              <div className="h-full flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-brand/50" size={32} />
              </div>
            ) : doos.length > 0 ? (
              <div className={cn(
                "",
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4" 
                  : "flex flex-col gap-3 pr-4"
              )}>
                {doos.map((doo: Doo) => (
                  <DooListItem key={doo.id} doo={doo} view={viewMode} />
                ))}

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-surface/30 rounded-lg border border-dashed border-border">
                <div className="p-4 bg-brand/5 rounded-xl text-brand mb-4">
                  {searchQuery || statusFilter !== "all" ? (
                    <Filter size={32} />
                  ) : (
                    <Plus size={32} />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-text uppercase tracking-widest">
                  {searchQuery || statusFilter !== "all"
                    ? "No Matching Doos"
                    : "Initialize Orchestration Unit"}
                </h3>
                <p className="text-xs text-text-muted max-w-xs mx-auto mt-2 font-medium">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters or search terms to find what you're looking for."
                    : "Create your first automated logic to begin system control."}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-6"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Minimal Pagination */}
          {meta && meta.lastPage > 1 && (
            <div className="border-t border-border/40 py-4 flex items-center justify-between mt-auto shrink-0 bg-bg">
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">
                <span className="text-text">{doos.length}</span> / {meta.total}{" "}
                DOOS
              </p>

              <div className="flex items-center gap-3">
                <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest bg-surface-lighter px-2 py-1 rounded border border-border">
                  <span className="text-brand">{page}</span>
                  <span className="mx-1 text-border-hover">/</span>
                  <span>{meta.lastPage}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-7 w-7 flex items-center justify-center rounded bg-bg border border-border hover:border-brand/40 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(meta.lastPage, p + 1))
                    }
                    disabled={page === meta.lastPage}
                    className="h-7 w-7 flex items-center justify-center rounded bg-bg border border-border hover:border-brand/40 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateDooModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
