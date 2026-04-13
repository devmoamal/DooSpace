import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Loader2, Plus, Trash2, Database, Terminal,
  ChevronLeft, ChevronRight, Play, AlertCircle, EyeOff, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDooDooBoxQuery, useDeleteDooBoxKeyMutation } from "@/hooks/queries/useDooBox";
import { dooboxService } from "@/services/doobox.service";
import { type DooBoxUsage } from "@doospace/shared";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

interface UnifiedWorkspaceProps {
  doo: DooBoxUsage | null;
  onEdit: (key: string, value: any) => void;
  onAdd: () => void;
}

function formatTime(date: Date | string | null, type: "expiry" | "history" = "history") {
  if (!date) return type === "expiry" ? "Never" : "—";
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const absDiff = Math.abs(diff);
  const minutes = Math.floor(absDiff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (type === "expiry") {
    if (diff < 0) return "Expired";
    if (minutes < 1) return "Soon";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  }
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function TimeTag({ date, type }: { date: Date | string | null; type: "expiry" | "created" | "updated" }) {
  const [text, setText] = useState("");
  const update = useCallback(() => {
    setText(formatTime(date, type === "expiry" ? "expiry" : "history"));
  }, [date, type]);

  useEffect(() => {
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [update]);

  const isExpired = type === "expiry" && date && new Date(date) < new Date();
  const isSoon = type === "expiry" && date && (new Date(date).getTime() - Date.now()) < 3600000;

  return (
    <span className={cn(
      "text-[11px] font-mono",
      type === "expiry"
        ? isExpired ? "text-red-500" : isSoon ? "text-amber-500" : "text-brand"
        : "text-text-subtle"
    )}>
      {type === "expiry" && <Clock size={9} className="inline mr-1" />}
      {text}
    </span>
  );
}

const ORDERED_COLUMNS = ["id", "key", "value", "expire_at", "updated_at", "created_at"];

export function DooBoxUnifiedWorkspace({ doo, onEdit, onAdd }: UnifiedWorkspaceProps) {
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [customData, setCustomData] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: defaultKeys = [], isLoading: isDefaultLoading } = useDooDooBoxQuery(doo?.dooId || 0);
  const deleteMutation = useDeleteDooBoxKeyMutation();

  const activeData = customData || defaultKeys;
  const isLoading = isExecuting || (customData === null && isDefaultLoading);
  const totalItems = activeData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeData.slice(start, start + pageSize);
  }, [activeData, currentPage, pageSize]);

  useEffect(() => { setCurrentPage(1); }, [activeData.length, pageSize]);

  const columns = useMemo(() => {
    if (customData) {
      if (customData.length === 0) return [];
      return Object.keys(customData[0]).filter((k) => k !== "doo_id");
    }
    return ORDERED_COLUMNS;
  }, [customData]);

  const executeSql = async () => {
    if (!sqlQuery.trim()) { setCustomData(null); setSqlError(null); return; }
    setIsExecuting(true); setSqlError(null);
    try {
      const res = await dooboxService.executeSql(doo!.dooId, sqlQuery);
      if (res.ok) {
        setCustomData(Array.isArray(res.data) ? res.data : [res.data]);
        toast.success("Query executed");
      } else { setSqlError(res.message || "Query failed"); }
    } catch (err: any) { setSqlError(err.message || "Error"); }
    finally { setIsExecuting(false); }
  };

  const reset = () => { setCustomData(null); setSqlQuery(""); setSqlError(null); setCurrentPage(1); };

  const handleDelete = async (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${key}"?`)) return;
    try {
      await deleteMutation.mutateAsync({ dooId: doo!.dooId, key });
      toast.success("Deleted");
      if (customData) executeSql();
    } catch { toast.error("Delete failed"); }
  };

  if (!doo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg gap-3">
        <Database size={24} className="text-text-subtle" />
        <p className="text-[12px] text-text-subtle">Select a Doo to inspect its data</p>
      </div>
    );
  }

  const renderValue = (val: any) => {
    const type = typeof val;
    let label = "null"; let color = "text-text-subtle";
    if (val === null) { label = "null"; }
    else if (Array.isArray(val)) { label = `array[${val.length}]`; color = "text-blue-500"; }
    else if (type === "object") { label = `object{${Object.keys(val).length}}`; color = "text-amber-500"; }
    else if (type === "string") { label = `"${val.length > 28 ? val.slice(0, 28) + "…" : val}"`; color = "text-brand"; }
    else if (type === "number") { label = String(val); color = "text-purple-400"; }

    return (
      <span className={cn("text-[11px] font-mono", color)}>
        {label}
        {(val === null || type === "object" || Array.isArray(val)) && (
          <EyeOff size={9} className="inline ml-1 opacity-30" />
        )}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden">
      {/* Header */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-text">{doo.dooName}</span>
          <span className="text-[11px] font-mono text-text-subtle tabular-nums">{totalItems} records</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQueryOpen(!isQueryOpen)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer",
              isQueryOpen
                ? "bg-surface text-text"
                : "text-text-muted hover:bg-surface hover:text-text"
            )}
          >
            <Terminal size={13} />
            SQL
          </button>
          <Button size="sm" onClick={onAdd} className="gap-1.5">
            <Plus size={13} />
            Add
          </Button>
        </div>
      </header>

      {/* SQL Console */}
      {isQueryOpen && (
        <div className="border-b border-border p-4 shrink-0 bg-surface">
          <div className="max-w-3xl space-y-3">
            <div className="relative">
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className={cn(
                  "w-full h-28 p-3 bg-bg border rounded resize-none outline-none text-[12px] font-mono text-text transition-colors no-scrollbar",
                  "placeholder:text-text-subtle",
                  sqlError
                    ? "border-red-500/40 focus:border-red-500/60"
                    : "border-border focus:border-border-hover"
                )}
                placeholder="SELECT * FROM storage;"
                spellCheck={false}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {customData && (
                  <button
                    onClick={reset}
                    className="text-[10px] text-text-subtle hover:text-text-muted transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
                <Button size="sm" onClick={executeSql} disabled={isExecuting} className="gap-1.5">
                  {isExecuting ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} />}
                  Run
                </Button>
              </div>
            </div>
            {sqlError && (
              <div className="flex items-center gap-2 px-3 py-2 border border-red-500/20 rounded text-red-500 text-[11px] font-mono bg-red-500/5">
                <AlertCircle size={13} className="shrink-0" />
                {sqlError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/80">
            <Loader2 className="animate-spin text-text-subtle" size={18} />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="h-full flex items-center justify-center py-20">
            <p className="text-[12px] font-mono text-text-subtle">empty</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse table-fixed min-w-[860px]">
            <thead className="sticky top-0 bg-bg border-b border-border z-20">
              <tr>
                <th className="w-8 px-4 py-2.5" />
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest">
                    {col.replace("_", " ")}
                  </th>
                ))}
                <th className="w-10 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr
                  key={row.key || `row-${i}`}
                  onClick={() => onEdit(row.key, row.value)}
                  className="border-b border-border cursor-pointer hover:bg-surface group transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-[2px] h-3 bg-border group-hover:bg-brand rounded-full transition-colors" />
                  </td>
                  {columns.map((col) => {
                    const val = row[col];
                    return (
                      <td key={col} className="px-4 py-3 truncate">
                        {col === "value" ? (
                          renderValue(val)
                        ) : col.includes("at") ? (
                          <TimeTag date={val} type={col === "expire_at" ? "expiry" : col === "updated_at" ? "updated" : "created"} />
                        ) : col === "id" ? (
                          <span className="text-[11px] font-mono text-text-subtle">#{val}</span>
                        ) : col === "key" ? (
                          <span className="text-[12px] font-mono text-text">{val}</span>
                        ) : (
                          <span className="text-[11px] font-mono text-text-muted">{String(val)}</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => handleDelete(e, row.key)}
                      className="p-1 text-text-subtle hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer rounded hover:bg-red-500/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <footer className="h-10 border-t border-border px-5 flex items-center justify-between shrink-0 bg-bg">
        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-surface border border-border rounded px-2 py-1 text-[11px] font-mono text-text-muted outline-none focus:border-border-hover cursor-pointer transition-colors"
          >
            {[10, 20, 50, 100].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <span className="text-[11px] font-mono text-text-subtle tabular-nums">
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}–{Math.min(currentPage * pageSize, totalItems)} of {totalItems}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-6 w-6 flex items-center justify-center rounded text-text-subtle hover:text-text-muted hover:bg-surface disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-[11px] font-mono text-text-muted px-1 tabular-nums">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-6 w-6 flex items-center justify-center rounded text-text-subtle hover:text-text-muted hover:bg-surface disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </footer>
    </div>
  );
}
