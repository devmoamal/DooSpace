import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Database,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Play,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Select } from "@/components/ui/Select";
import {
  useDooDooBoxQuery,
  useDeleteDooBoxKeyMutation,
} from "@/hooks/queries/useDooBox";
import { dooboxService } from "@/services/doobox.service";
import { type DooBoxUsage } from "@doospace/shared";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

interface UnifiedWorkspaceProps {
  doo: DooBoxUsage | null;
  onEdit: (key: string, value: any) => void;
  onAdd: () => void;
}

function formatTime(
  date: Date | string | null,
  type: "expiry" | "history" = "history",
) {
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

function ExpiryTag({ date }: { date: Date | string | null }) {
  const [text, setText] = useState("");
  const update = useCallback(() => setText(formatTime(date, "expiry")), [date]);

  useEffect(() => {
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [update]);

  if (!date) {
    return (
      <Badge variant="neutral" size="xs" className="opacity-30 border-none">
        —
      </Badge>
    );
  }

  const d = new Date(date);
  const isExpired = d < new Date();
  const isSoon = d.getTime() - Date.now() < 3600000;

  return (
    <Badge
      variant={isExpired ? "danger" : isSoon ? "warning" : "neutral"}
      size="xs"
      className="gap-1 font-bold font-mono"
    >
      {(isExpired || isSoon) && <Clock size={9} />}
      {text}
    </Badge>
  );
}

function TimeTag({ date }: { date: Date | string | null }) {
  const [text, setText] = useState("—");
  const update = useCallback(
    () => setText(formatTime(date, "history")),
    [date],
  );
  useEffect(() => {
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [update]);
  return (
    <span className="text-[11px] font-mono text-text-subtle/70">{text}</span>
  );
}

const DEFAULT_COLUMNS = ["key", "expire_at", "updated_at"];

export function DooBoxUnifiedWorkspace({
  doo,
  onEdit,
  onAdd,
}: UnifiedWorkspaceProps) {
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [customData, setCustomData] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { data: defaultKeys = [], isLoading: isDefaultLoading } =
    useDooDooBoxQuery(doo?.dooId || 0);
  const deleteMutation = useDeleteDooBoxKeyMutation();

  const activeData = customData || defaultKeys;
  const isLoading = isExecuting || (customData === null && isDefaultLoading);
  const totalItems = activeData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeData.slice(start, start + pageSize);
  }, [activeData, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeData.length, pageSize]);

  const columns = useMemo(() => {
    if (customData) {
      if (customData.length === 0) return [];
      return Object.keys(customData[0]).filter(
        (k) => k !== "doo_id" && k !== "value",
      );
    }
    return DEFAULT_COLUMNS;
  }, [customData]);

  const executeSql = async () => {
    if (!sqlQuery.trim()) {
      setCustomData(null);
      setSqlError(null);
      return;
    }
    setIsExecuting(true);
    setSqlError(null);
    try {
      const res = await dooboxService.executeSql(doo!.dooId, sqlQuery);
      if (res.ok) {
        setCustomData(Array.isArray(res.data) ? res.data : [res.data]);
        toast.success("Query executed");
      } else {
        setSqlError(res.message || "Query failed");
      }
    } catch (err: any) {
      setSqlError(err.message || "Error");
    } finally {
      setIsExecuting(false);
    }
  };

  const reset = () => {
    setCustomData(null);
    setSqlQuery("");
    setSqlError(null);
    setCurrentPage(1);
  };

  const handleDelete = async (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${key}"?`)) return;
    try {
      await deleteMutation.mutateAsync({ dooId: doo!.dooId, key });
      toast.success("Deleted");
      if (customData) executeSql();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!doo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg gap-5 opacity-40">
        <div className="w-16 h-16 border border-dashed border-border flex items-center justify-center rounded-none">
          <Database size={24} className="text-text-subtle" />
        </div>
        <p className="text-[13px] font-bold text-text-subtle">
          Select Workspace
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden rounded-none border-l border-border/50">
      {/* Header */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0 bg-bg/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Badge
            variant="neutral"
            size="sm"
            className="font-bold text-text-muted rounded-none border-border px-2"
          >
            {doo.dooName.toUpperCase()}
          </Badge>
          <Badge
            variant="neutral"
            size="sm"
            className="font-mono tabular-nums opacity-60 rounded-none border-transparent"
          >
            {totalItems} RECORDS
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQueryOpen(!isQueryOpen)}
            className={cn(
              "flex items-center gap-2 h-7.5 px-3 rounded-none text-[10px] font-bold transition-all cursor-pointer border border-transparent",
              isQueryOpen
                ? "bg-surface text-brand border-brand/20 shadow-sm"
                : "text-text-muted hover:bg-surface hover:text-text",
            )}
          >
            <Terminal size={14} />
            SQL CONSOLE
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={onAdd}
            className="h-7.5 px-4 rounded-none gap-2 font-bold text-[10px]"
          >
            <Plus size={14} />
            Add Entity
          </Button>
        </div>
      </header>

      {/* SQL Console */}
      {isQueryOpen && (
        <div className="shrink-0 bg-surface/30 border-b border-border animate-in slide-in-from-top-1 duration-200">
          <div className="relative p-2">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className={cn(
                "w-full h-32 px-4 py-3 bg-bg border-none resize-none outline-none text-[12px] font-mono text-text transition-all no-scrollbar shadow-inner rounded-none",
                "placeholder:text-text-subtle opacity-90 focus:opacity-100",
                sqlError && "bg-red-500/5",
              )}
              placeholder="-- Execute custom SQL on DooBox storage...&#10;SELECT * FROM doobox WHERE key LIKE 'user%'; "
              spellCheck={false}
            />
            <div className="absolute bottom-5 right-5 flex items-center gap-4">
              {customData && (
                <button
                  onClick={reset}
                  className="text-[10px] font-bold text-text-subtle hover:text-brand transition-all cursor-pointer"
                >
                  Clear Results
                </button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={executeSql}
                disabled={isExecuting}
                className="h-8 px-5 rounded-none font-black text-[10px] shadow-lg shadow-brand/10"
              >
                {isExecuting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Play size={12} className="fill-current" />
                )}
                EXECUTE
              </Button>
            </div>
            {sqlError && (
              <div className="mt-2 flex items-start gap-3 px-4 py-3 border border-red-500/10 rounded-none text-red-400 text-[11px] font-mono bg-red-500/5 backdrop-blur-sm animate-in fade-in">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span className="leading-relaxed">{sqlError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/80">
            <Loader2 className="animate-spin text-brand" size={24} />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-24 opacity-30">
            <Database size={32} className="mb-4" />
            <p className="text-[11px] font-bold tracking-[0.3em]">
              No Records Found
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-bg/95 backdrop-blur-sm border-b border-border z-20">
              <tr>
                <th className="w-6 px-5 py-3" />
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-[10px] font-bold text-text-muted"
                  >
                    {col === "expire_at"
                      ? "TTL Status"
                      : col === "updated_at"
                        ? "Last Change"
                        : col.replace("_", " ")}
                  </th>
                ))}
                <th className="px-5 py-3 text-right text-[10px] font-bold text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedData.map((row, i) => (
                <tr
                  key={row.key || `row-${i}`}
                  onClick={() => onEdit(row.key, row.value)}
                  className="border-b border-border/50 cursor-pointer hover:bg-surface/50 group transition-all duration-150"
                >
                  <td className="px-5 py-4">
                    <div className="w-[2px] h-4 bg-border/50 group-hover:bg-brand transition-all duration-300" />
                  </td>
                  {columns.map((col) => {
                    const val = row[col];
                    return (
                      <td
                        key={col}
                        className="px-4 py-4 truncate max-w-[240px]"
                      >
                        {col === "expire_at" ? (
                          <ExpiryTag date={val} />
                        ) : col.includes("at") ? (
                          <TimeTag date={val} />
                        ) : col === "key" ? (
                          <span className="text-[12px] font-mono text-text font-bold bg-surface/50 px-2 py-1 transition-all rounded-none">
                            {val}
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-text-subtle font-medium">
                            {String(val ?? "—")}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-4 text-right">
                    <IconButton
                      onClick={(e) => handleDelete(e, row.key)}
                      variant="ghost"
                      size="xs"
                      className="text-text-subtle hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={13} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <footer className="h-10 border-t border-border px-5 flex items-center justify-between shrink-0 bg-bg/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="w-20 h-7 rounded-none"
            size="sm"
          >
            {[15, 25, 50, 100].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
          <Badge
            variant="neutral"
            size="sm"
            className="font-mono tabular-nums opacity-60 border-none"
          >
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}–
            {Math.min(currentPage * pageSize, totalItems)} OF {totalItems}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="ghost"
            size="sm"
          >
            <ChevronLeft size={14} />
          </IconButton>
          <div className="min-w-12 text-center">
            <span className="text-[11px] font-bold text-text-muted tabular-nums">
              {currentPage} <span className="opacity-30">/</span>{" "}
              {totalPages || 1}
            </span>
          </div>
          <IconButton
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            variant="ghost"
            size="sm"
          >
            <ChevronRight size={14} />
          </IconButton>
        </div>
      </footer>
    </div>
  );
}
