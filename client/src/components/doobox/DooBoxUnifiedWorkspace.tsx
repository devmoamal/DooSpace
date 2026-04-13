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
  Table as TableIcon,
  AlertCircle,
  Clock,
  ExternalLink,
  EyeOff
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

// Relative time helper
function formatTime(date: Date | string | null, type: 'expiry' | 'history' = 'history') {
  if (!date) return type === 'expiry' ? 'Never' : '-';
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const absDiff = Math.abs(diff);
  
  const minutes = Math.floor(absDiff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (type === 'expiry') {
    if (diff < 0) return 'Expired';
    if (minutes < 1) return 'Seconds left';
    if (minutes < 60) return `${minutes}m left`;
    if (hours < 24) return `${hours}h left`;
    return `${days}d left`;
  } else {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}

function TimeTag({ date, type }: { date: Date | string | null, type: 'expiry' | 'created' | 'updated' }) {
  const [displayText, setDisplayText] = useState("");
  
  const update = useCallback(() => {
    setDisplayText(formatTime(date, type === 'expiry' ? 'expiry' : 'history'));
  }, [date, type]);

  useEffect(() => {
    update();
    const interval = setInterval(update, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [update]);

  const isExpired = type === 'expiry' && date && new Date(date) < new Date();
  const isExpiringSoon = type === 'expiry' && date && (new Date(date).getTime() - new Date().getTime()) < 3600000;

  return (
    <div className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-mono tracking-tight transition-all",
        type === 'expiry' ? (
            isExpired ? "text-red-500 font-bold" :
            isExpiringSoon ? "text-amber-500 font-bold" :
            "text-emerald-500"
        ) : "text-text-muted/60"
    )}>
        {type === 'expiry' && <Clock size={10} className="shrink-0" />}
        <span>{displayText}</span>
    </div>
  );
}

const ORDERED_COLUMNS = ["id", "key", "value", "expire_at", "updated_at", "created_at"];

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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeData.length, pageSize]);

  const columns = useMemo(() => {
    if (customData) {
        if (customData.length === 0) return [];
        return Object.keys(customData[0]).filter(k => k !== 'doo_id');
    }
    return ORDERED_COLUMNS;
  }, [customData]);

  const handleExecuteSql = async () => {
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
      setSqlError(err.message || "Execution error");
    } finally {
      setIsExecuting(false);
    }
  };

  const resetToDefault = () => {
    setCustomData(null);
    setSqlQuery("");
    setSqlError(null);
    setCurrentPage(1);
  };

  const handleDelete = async (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (window.confirm(`Delete record "${key}"?`)) {
      try {
        await deleteMutation.mutateAsync({ dooId: doo!.dooId, key });
        toast.success("Record deleted");
        if (customData) handleExecuteSql();
      } catch (err: any) {
        toast.error("Delete failed");
      }
    }
  };

  if (!doo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg animate-in fade-in duration-700">
        <div className="w-20 h-20 rounded-4xl bg-surface border border-border flex items-center justify-center mb-8 text-text-muted/30 shadow-xl">
          <Database size={40} />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">Workspace Standby</h2>
        <p className="text-[12px] text-text-muted font-bold uppercase tracking-[0.2em] max-w-[300px] text-center opacity-50">
          Mount a persistence unit to launch the studio engine.
        </p>
      </div>
    );
  }

  const renderValueCell = (val: any) => {
    const type = typeof val;
    let label = "Unknown";
    let typeClass = "bg-surface border-border";

    if (val === null) {
        label = "Null";
    } else if (Array.isArray(val)) {
        label = `ARRAY[${val.length}]`;
        typeClass = "bg-blue-500/10 text-blue-500 border-blue-500/20";
    } else if (type === 'object') {
        label = `OBJECT{${Object.keys(val).length}}`;
        typeClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
    } else if (type === 'string') {
        label = `STRING("${val.length}")`;
        typeClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    } else if (type === 'number') {
        label = `NUMBER(${val})`;
        typeClass = "bg-brand/10 text-brand border-brand/20";
    }

    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-2 py-1 rounded text-[10px] font-mono font-bold border tracking-tight group-hover:shadow-sm transition-all",
            typeClass
        )}>
            <span className="truncate">{label}</span>
            <EyeOff size={10} className="opacity-30 shrink-0" />
        </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden animate-in fade-in duration-500">
      {/* Solid Workspace Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-surface/30 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-brand text-white rounded-xl shadow-lg shadow-brand/10">
                <Database size={18} />
             </div>
             <div>
                <h2 className="text-sm font-extrabold text-text tracking-widest leading-tight uppercase">{doo.dooName}</h2>
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-widest">UNIT_{doo.dooId}</p>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <p className="text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-widest">{totalItems} NODES</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className={cn(
                "h-9 px-4 gap-2 transition-all font-bold",
                isQueryOpen ? "bg-surface border-brand/40 text-brand" : "bg-bg"
            )}
            onClick={() => setIsQueryOpen(!isQueryOpen)}
          >
            <Terminal size={14} className={isQueryOpen ? "text-brand" : "text-text-muted"} />
            <span className="text-[10px] uppercase tracking-widest">SQL Studio</span>
          </Button>
          <div className="w-px h-3 bg-border mx-1" />
          <Button 
            size="sm" 
            className="h-9 px-6 gap-2 bg-brand text-white border-none shadow-lg shadow-brand/10 hover:shadow-brand/20 transition-all font-bold"
            onClick={onAdd}
          >
            <Plus size={16} />
            <span className="text-[10px] uppercase tracking-widest">Post Record</span>
          </Button>
        </div>
      </header>

      {/* Solid SQL Console */}
      {isQueryOpen && (
        <div className="border-b border-border bg-surface/20 p-8 animate-in slide-in-from-top duration-500 shrink-0">
            <div className="max-w-5xl mx-auto space-y-4">
                <div className="flex items-center justify-between px-1">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(62,207,142,0.5)]" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Structured Query Engine</p>
                   </div>
                   <button 
                    onClick={resetToDefault}
                    className="text-[10px] font-bold text-text-muted/40 hover:text-red-500 uppercase tracking-widest transition-colors"
                   >
                     Reset Engine
                   </button>
                </div>
                <div className="relative font-mono shadow-sm">
                    <textarea
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        className={cn(
                            "w-full h-36 p-6 bg-bg border rounded-2xl resize-none outline-none transition-all text-[13px] leading-relaxed shadow-inner",
                            sqlError ? "border-red-500/30 focus:border-red-500/50" : "border-border focus:border-brand/40"
                        )}
                        placeholder="SELECT * FROM node_cluster WHERE shard = 'primary';"
                        spellCheck={false}
                    />
                    <div className="absolute bottom-4 right-4">
                        <Button 
                            size="md" 
                            className="h-9 px-8 bg-brand text-white border-none shadow-lg hover:shadow-brand/20 transition-all font-bold text-[11px]"
                            onClick={handleExecuteSql}
                            disabled={isExecuting}
                        >
                            {isExecuting ? <Loader2 size={14} className="animate-spin mr-2" /> : <Play size={14} className="mr-2" />}
                            {isExecuting ? 'EXECUTING...' : 'RUN QUERY'}
                        </Button>
                    </div>
                </div>
                {sqlError && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500 text-[12px] font-mono leading-relaxed">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{sqlError}</span>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Solid Data Grid */}
      <div className="flex-1 overflow-auto custom-scrollbar relative bg-bg">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/50 z-10 backdrop-blur-[2px]">
            <Loader2 className="animate-spin text-brand" size={32} />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted/10 py-20 grayscale opacity-40">
            <TableIcon size={120} strokeWidth={0.2} />
            <p className="text-xl font-bold tracking-tight mt-4 text-text-muted uppercase tracking-[0.2em]">Logical Void</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
            <thead className="sticky top-0 bg-surface border-b border-border z-20 shadow-sm">
              <tr>
                <th className="w-14 px-8 py-4"></th>
                {columns.map(col => (
                  <th key={col} className="px-6 py-4 text-[11px] font-extrabold text-text-muted uppercase tracking-[0.2em] truncate">
                    {col.replace('_', ' ')}
                  </th>
                ))}
                <th className="w-20 px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedData.map((row, i) => {
                const rowKey = row.key || `row-${i}`;
                return (
                  <tr 
                    key={rowKey} 
                    onClick={() => onEdit(row.key, row.value)}
                    className="group hover:bg-surface/50 cursor-pointer transition-all duration-150"
                  >
                    <td className="px-8 py-5">
                       <div className="w-[3px] h-4 bg-border/40 group-hover:bg-brand/60 rounded-full transition-all duration-300" />
                    </td>
                    {columns.map(col => {
                      const val = row[col];
                      return (
                        <td key={col} className="px-6 py-5 truncate">
                           {col === 'value' ? (
                             renderValueCell(val)
                           ) : col.includes('at') ? (
                             <TimeTag date={val} type={col === 'expire_at' ? 'expiry' : col === 'updated_at' ? 'updated' : 'created'} />
                           ) : col === 'id' ? (
                             <span className="text-[11px] font-mono font-bold text-text-muted/40 group-hover:text-text-muted/80 transition-colors">#{val}</span>
                           ) : col === 'key' ? (
                             <div className="flex items-center gap-2 max-w-full">
                                <span className="text-[13px] font-bold text-text truncate group-hover:text-brand transition-colors duration-200">{val}</span>
                                <ExternalLink size={12} className="text-text-muted/20 group-hover:text-brand/40 transition-colors shrink-0" />
                             </div>
                           ) : (
                             <span className="text-[12px] font-mono font-bold text-text-muted group-hover:text-text-muted transition-colors">
                               {String(val)}
                             </span>
                           )}
                        </td>
                      );
                    })}
                    <td className="px-8 py-5 text-right">
                       <button 
                        onClick={(e) => handleDelete(e, row.key)}
                        className="p-2 text-text-muted/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Solid Footer */}
      <footer className="h-14 border-t border-border bg-surface/30 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60">Density Control</span>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-bg border border-border rounded-lg px-2 py-1 text-[11px] font-bold text-text outline-none focus:border-brand/40 shadow-sm"
              >
                 {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
           </div>
           <div className="w-px h-4 bg-border" />
           <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60">
              Showing <span className="text-text">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}-{Math.min(currentPage * pageSize, totalItems)}</span> of {totalItems} nodes
           </p>
        </div>

        <div className="flex items-center gap-2">
           <Button 
            variant="secondary" 
            size="sm" 
            className="w-8 h-8 p-0 border-border bg-bg hover:bg-surface text-text-muted/60"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
           >
              <ChevronLeft size={18} />
           </Button>
           
           <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-bold text-text-muted uppercase opacity-40">Page</span>
              <div className="flex items-center bg-bg border border-border px-3 py-1 rounded-lg shadow-sm">
                <span className="text-[11px] font-mono font-bold text-brand">{currentPage}</span>
                <span className="mx-2 text-text-muted opacity-20">/</span>
                <span className="text-[11px] font-mono font-bold text-text-muted">{totalPages || 1}</span>
              </div>
           </div>

           <Button 
            variant="secondary" 
            size="sm" 
            className="w-8 h-8 p-0 border-border bg-bg hover:bg-surface text-text-muted/60"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
           >
              <ChevronRight size={18} />
           </Button>
        </div>
      </footer>
    </div>
  );
}
