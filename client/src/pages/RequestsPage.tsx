import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRequestsQuery } from "@/hooks/queries/useRequests";
import { useDoosQuery } from "@/hooks/queries/useDoos";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { RequestDetailsDrawer } from "@/components/requests/RequestDetailsDrawer";

export function RequestsPage() {
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const limit = 20;

  const { data: requestsRes, isLoading } = useRequestsQuery({ page, limit });
  const { data: doosRes } = useDoosQuery();

  const requests = requestsRes?.data || [];
  const meta = requestsRes?.meta;
  const doos = doosRes?.data || [];

  const getDooName = (id: number) =>
    doos.find((d: any) => d.id === id)?.name ?? `doo_${id}`;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-text-subtle" size={18} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
      {/* Header */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0 bg-bg">
        <div className="flex items-center gap-3">
          <h1 className="text-[13px] font-semibold text-text">Requests</h1>
          {meta?.total != null && (
            <span className="text-[11px] font-mono text-text-subtle tabular-nums">
              {meta.total}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-[10px] font-mono text-text-subtle uppercase tracking-widest">live</span>
        </div>
      </header>

      {/* Table */}
      <main className="flex-1 overflow-auto custom-scrollbar">
        <RequestsTable
          requests={requests}
          getDooName={getDooName}
          onSelect={setSelectedRequest}
          selectedId={selectedRequest?.id}
        />
      </main>

      {/* Pagination */}
      {meta && meta.lastPage > 1 && (
        <footer className="h-11 border-t border-border flex items-center justify-between px-5 shrink-0 bg-bg">
          <span className="text-[11px] font-mono text-text-subtle tabular-nums">
            {(page - 1) * limit + 1}–{Math.min(page * limit, meta.total)} / {meta.total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={13} />
            </Button>
            <span className="text-[11px] font-mono text-text-muted px-2 tabular-nums">
              {page} / {meta.lastPage}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
              disabled={page === meta.lastPage}
            >
              <ChevronRight size={13} />
            </Button>
          </div>
        </footer>
      )}

      <RequestDetailsDrawer
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        getDooName={getDooName}
      />
    </div>
  );
}
