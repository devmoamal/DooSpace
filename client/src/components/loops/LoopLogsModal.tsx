import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useLoopLogsQuery } from "@/hooks/queries/useLoops";
import { type Loop, type LoopLog } from "@doospace/shared";
import { Loader2, AlertCircle, ChevronDown, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface LoopLogsModalProps {
  loop: Loop;
  isOpen: boolean;
  onClose: () => void;
}

function LogRow({ log }: { log: LoopLog }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr 
        onClick={() => setExpanded(!expanded)}
        className="border-b border-border hover:bg-surface transition-colors cursor-pointer"
      >
        <td className="px-3 py-3 w-8">
          <button className="text-text-subtle hover:text-text transition-colors">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            {log.status === "success" ? (
              <Check size={12} className="text-green-500" />
            ) : (
              <AlertCircle size={12} className="text-red-500" />
            )}
            <span className={cn(
              "text-[11px] font-medium",
              log.status === "success" ? "text-green-500" : "text-red-500"
            )}>
              {log.status}
            </span>
          </div>
        </td>
        <td className="px-3 py-3">
          <span className="text-[11px] font-mono text-text-subtle">{log.duration_ms}ms</span>
        </td>
        <td className="px-3 py-3 text-right">
          <span className="text-[11px] font-mono text-text-muted">
            {new Date(log.run_at).toLocaleString()}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={4} className="p-0 border-b border-border bg-surface/50">
            <div className="p-4 pt-1 animate-in slide-in-from-top-1">
              <span className="text-[10px] font-medium text-text-muted mb-2 block">
                {log.status === "success" ? "Response Output" : "Error Message"}
              </span>
              <pre className="text-[11px] bg-bg border border-border p-3 rounded-none overflow-x-auto text-text font-mono max-h-64 custom-scrollbar whitespace-pre-wrap shadow-inner">
                {log.error_message || log.response_body || "No output provided"}
              </pre>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function LoopLogsModal({ loop, isOpen, onClose }: LoopLogsModalProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLoopLogsQuery(loop.id, { page, limit: 10 });

  const logs = data?.data || [];
  const meta = data?.meta;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Execution History" maxWidth="2xl">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4 p-2 bg-surface rounded border border-border">
          <span className="bg-brand/10 text-brand px-2 py-0.5 rounded text-[11px] font-medium">Doo #{loop.doo_id}</span>
          <span className="text-[11px] text-text-subtle font-mono">{loop.target_path}</span>
        </div>

        <div className="min-h-[300px] border border-border rounded-none overflow-hidden bg-bg relative shadow-inner">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/50 z-10">
              <Loader2 className="animate-spin text-text-subtle" size={24} />
            </div>
          ) : logs.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AlertCircle size={24} className="text-text-subtle mb-2" />
              <p className="text-[12px] text-text-muted">No logs recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface sticky top-0 z-10 border-b border-border">
                  <tr>
                    <th className="px-3 py-2 w-8"></th>
                    <th className="px-3 py-2 text-[10px] font-medium text-text-muted">Status</th>
                    <th className="px-3 py-2 text-[10px] font-medium text-text-muted">Duration</th>
                    <th className="px-3 py-2 text-[10px] font-medium text-text-muted text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <LogRow key={log.id} log={log} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {meta && meta.lastPage > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-[11px] text-text-subtle font-mono">Total runs: {meta.total}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-2 py-1 bg-surface border border-border rounded text-[11px] text-text-subtle hover:text-text disabled:opacity-50 transition-colors"
               >
                Prev
              </button>
              <span className="text-[11px] font-mono text-text-muted">{page} / {meta.lastPage}</span>
              <button 
                onClick={() => setPage(Math.min(meta.lastPage, page + 1))}
                disabled={page === meta.lastPage}
                className="px-2 py-1 bg-surface border border-border rounded text-[11px] text-text-subtle hover:text-text disabled:opacity-50 transition-colors"
               >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
