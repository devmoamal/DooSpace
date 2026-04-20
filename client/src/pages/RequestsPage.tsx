import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRequestsQuery } from "@/hooks/queries/useRequests";
import { useDoosQuery } from "@/hooks/queries/useDoos";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
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
    <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden rounded-none">
      <header className="h-11 border-b border-border flex items-center justify-between px-5 bg-bg/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-[11px] font-bold text-text-muted">Execution Logs</h1>
          {meta?.total != null && (
            <Badge variant="neutral" size="xs" className="font-mono tabular-nums opacity-60 rounded-none">
              {meta.total}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="xs" className="gap-1.5 px-2 py-0.5 animate-pulse rounded-none">
            <div className="w-1 h-1 rounded-full bg-current" />
            LIVE
          </Badge>
        </div>
      </header>

      <main className="flex-1 overflow-auto custom-scrollbar">
        <RequestsTable
          requests={requests}
          getDooName={getDooName}
          onSelect={setSelectedRequest}
          selectedId={selectedRequest?.id}
        />
      </main>

      {meta && meta.lastPage > 1 && (
        <footer className="h-11 border-t border-border flex items-center justify-between px-5 shrink-0 bg-bg">
          <span className="text-[11px] font-mono text-text-subtle tabular-nums">
            {(page - 1) * limit + 1}–{Math.min(page * limit, meta.total)} / {meta.total}
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={13} />
            </IconButton>
            <span className="text-[11px] font-mono text-text-muted px-2 tabular-nums">
              {page} / {meta.lastPage}
            </span>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
              disabled={page === meta.lastPage}
            >
              <ChevronRight size={13} />
            </IconButton>
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
