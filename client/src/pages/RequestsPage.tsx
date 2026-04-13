import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { useRequestsQuery } from "@/hooks/queries/useRequests";
import { useDoosQuery } from "@/hooks/queries/useDoos";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { RequestDetailsDrawer } from "@/components/requests/RequestDetailsDrawer";
import { PAGINATION } from "@/constants";

export function RequestsPage() {
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const limit = 12; // Standard for this view

  const { data: requestsRes, isLoading } = useRequestsQuery({ page, limit });
  const { data: doosRes } = useDoosQuery();

  const requests = requestsRes?.data || [];
  const meta = requestsRes?.meta;
  const doos = doosRes?.data || [];

  const getDooName = (id: number) => {
    return doos.find((d: any) => d.id === id)?.name || "Unknown Doo";
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
      <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-bg sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-text">Requests</h1>
          <div className="h-4 w-px bg-border mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-brand uppercase tracking-widest">
              Live Feed
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {doos.slice(0, 3).map((d: any) => (
              <div
                key={d.id}
                className="w-7 h-7 rounded-md border-2 border-bg overflow-hidden"
              >
                <DooAvatar id={d.id} size={28} />
              </div>
            ))}
          </div>
          <div className="h-4 w-px bg-border mx-2" />
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
            {doosRes?.meta?.total || 0} DooS
          </span>
        </div>
      </header>


      <main className="flex-1 p-8 flex flex-col min-h-0 overflow-hidden">
        <RequestsTable 
          requests={requests} 
          getDooName={getDooName} 
          onSelect={setSelectedRequest}
          selectedId={selectedRequest?.id}
        />
      </main>

      <RequestDetailsDrawer 
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        getDooName={getDooName}
      />

      {/* Pagination Controls */}
      {meta && meta.lastPage > 1 && (
        <div className="h-14 border-t border-border flex items-center justify-between px-8 bg-bg shrink-0">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
            <span className="text-text">{requests.length}</span> / {meta.total}{" "}
            ENTRIES
          </p>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              PAGE <span className="text-brand">{page}</span> OF {meta.lastPage}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 min-w-[32px] p-0 rounded-md"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 min-w-[32px] p-0 rounded-md"
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={page === meta.lastPage}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

