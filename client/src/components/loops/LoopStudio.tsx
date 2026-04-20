import { useState, useEffect } from "react";
import { 
  Repeat, Clock, Play, Pause, Trash2, X, Activity, 
  Settings, History, ChevronRight, ChevronDown, Check,
  AlertCircle, Loader2, Terminal, Code
} from "lucide-react";
import { cn } from "@/lib/cn";
import { 
  useLoopQuery, 
  useLoopLogsQuery, 
  useUpdateLoopMutation,
  useUpdateLoopStatusMutation,
  useDeleteLoopMutation
} from "@/hooks/queries/useLoops";
import { useDooQuery } from "@/hooks/queries/useDoos";
import { type Loop, type LoopLog, type LoopType } from "@doospace/shared";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { LoopPayloadEditor } from "./LoopPayloadEditor";
import { toast } from "sonner";

interface LoopStudioProps {
  selectedLoopId: string | null;
  onClose: () => void;
}

type StudioTab = "config" | "activity";

export function LoopStudio({ selectedLoopId, onClose }: LoopStudioProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>("activity");
  const isOpen = !!selectedLoopId;

  const { data: loop, isLoading: isLoopLoading } = useLoopQuery(selectedLoopId || "");
  const { data: logsData, isLoading: isLogsLoading } = useLoopLogsQuery(selectedLoopId || "", { page: 1, limit: 20 });
  const { data: dooRes } = useDooQuery(loop?.doo_id || 0);

  const updateMutation = useUpdateLoopMutation();
  const updateStatusMutation = useUpdateLoopStatusMutation();
  const deleteMutation = useDeleteLoopMutation();

  // Config State
  const [type, setType] = useState<LoopType>("once");
  const [intervalMs, setIntervalMs] = useState("5000");
  const [payload, setPayload] = useState("{}");
  const [endExpression, setEndExpression] = useState("");

  useEffect(() => {
    if (loop) {
      setType(loop.type);
      setIntervalMs(loop.interval_ms?.toString() || "5000");
      setPayload(loop.payload ? JSON.stringify(loop.payload, null, 2) : "{}");
      setEndExpression(loop.end_expression || "");
    }
  }, [loop]);

  const handleSave = async () => {
    if (!loop) return;
    try {
      const parsedPayload = JSON.parse(payload);
      await updateMutation.mutateAsync({
        id: loop.id,
        data: {
          type,
          interval_ms: type === "interval" ? parseInt(intervalMs) : undefined,
          payload: parsedPayload,
          end_expression: endExpression || undefined,
        }
      });
      toast.success("Loop configurations updated");
    } catch (err: any) {
      if (err instanceof SyntaxError) toast.error("Invalid JSON payload");
      else toast.error(err.message || "Update failed");
    }
  };

  const handleToggleStatus = async () => {
    if (!loop) return;
    const newStatus = loop.status === "active" ? "paused" : "active";
    try {
      await updateStatusMutation.mutateAsync({ id: loop.id, status: newStatus });
      toast.success(`Loop ${newStatus === "active" ? "resumed" : "paused"}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!loop) return;
    if (!window.confirm("Are you sure you want to delete this loop?")) return;
    try {
      await deleteMutation.mutateAsync(loop.id);
      toast.success("Loop deleted");
      onClose();
    } catch {
      toast.error("Delete failed");
    }
  };

  const statusBadgeVariant = (s: Loop["status"]) => {
    if (s === "active") return "success";
    if (s === "paused") return "warning";
    return "danger";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Studio Panel */}
      <div 
        className={cn(
          "fixed right-0 top-0 bottom-0 w-full max-w-xl bg-bg border-l border-border z-51 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {isLoopLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-brand" size={24} />
            <p className="text-[12px] font-mono text-text-subtle">Initializing Studio...</p>
          </div>
        ) : loop ? (
          <>
            {/* Header */}
            <header className="px-6 py-5 border-b border-border bg-surface/30 backdrop-blur-md sticky top-0 z-20 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-none flex items-center justify-center transition-all shadow-lg",
                    loop.status === "active" ? "bg-brand/10 text-brand ring-1 ring-brand/20" : "bg-surface border border-border text-text-subtle"
                  )}>
                    <Repeat size={18} className={cn(loop.status === "active" && "animate-[spin_10s_linear_infinite]")} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-[15px] font-semibold text-text">Doo #{loop.doo_id}</h2>
                      <Badge variant={statusBadgeVariant(loop.status)}>{loop.status}</Badge>
                    </div>
                    <p className="text-[12px] font-mono text-text-subtle truncate flex items-center gap-1.5">
                      <Activity size={10} />
                      {loop.target_path}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <IconButton
                    onClick={handleToggleStatus}
                    variant="ghost"
                    className={cn(loop.status === "active" ? "text-amber-500" : "text-green-500")}
                    title={loop.status === "active" ? "Pause" : "Resume"}
                  >
                    {loop.status === "active" ? <Pause size={16} /> : <Play size={16} />}
                  </IconButton>
                  <IconButton onClick={onClose} variant="ghost" title="Close">
                    <X size={18} />
                  </IconButton>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-surface p-1 rounded-none border border-border/50">
                <button 
                  onClick={() => setActiveTab("activity")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-none text-[12px] font-medium transition-all cursor-pointer",
                    activeTab === "activity" ? "bg-bg text-text shadow-sm" : "text-text-subtle hover:text-text-muted"
                  )}
                >
                  <History size={14} />
                  Activity
                </button>
                <button 
                  onClick={() => setActiveTab("config")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-none text-[12px] font-medium transition-all cursor-pointer",
                    activeTab === "config" ? "bg-bg text-text shadow-sm" : "text-text-subtle hover:text-text-muted"
                  )}
                >
                  <Settings size={14} />
                  Configuration
                </button>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar bg-bg/50">
              {activeTab === "activity" ? (
                <div className="p-6">
                  {isLogsLoading ? (
                    <div className="py-20 flex flex-col items-center gap-2 opacity-50">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-[11px] font-mono">Fetching history...</span>
                    </div>
                  ) : logsData?.data.length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-center gap-4 opacity-70">
                      <div className="w-16 h-16 rounded-none bg-surface border border-border flex items-center justify-center">
                        <Terminal size={32} className="text-text-subtle" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[13px] font-medium text-text-muted">No runs recorded</p>
                        <p className="text-[11px] text-text-subtle">Activity will appear here once the loop executes.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {logsData?.data.map((log) => (
                        <LogRow key={log.id} log={log} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                  {/* Info Card */}
                  <div className="p-4 rounded-none border border-brand/20 bg-brand/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/20">
                      <Code size={18} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-semibold text-brand">Source Endpoint</h4>
                      <p className="text-[11px] font-mono text-brand/80">{loop.target_path}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Trigger */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-text-muted px-1">Trigger Strategy</label>
                      <div className="flex bg-surface border border-border rounded-none p-1">
                        {(["once", "interval", "event"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setType(t)}
                            className={cn(
                              "flex-1 py-1.5 rounded-none text-[11px] font-medium transition-all capitalize cursor-pointer",
                              type === t ? "bg-bg text-text shadow-sm" : "text-text-subtle hover:text-text-muted"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {type === "interval" && (
                      <Input
                        label="Interval Milliseconds"
                        type="number"
                        value={intervalMs}
                        onChange={(e) => setIntervalMs(e.target.value)}
                        className="font-mono font-semibold h-11"
                      />
                    )}

                    <LoopPayloadEditor
                      payload={payload}
                      setPayload={setPayload}
                      requestType={dooRes?.endpoints?.find((ep) => ep.path === loop.target_path)?.request_type}
                    />

                    <Input
                      label="End Condition"
                      helperText="JavaScript expression using parsed response as 'res'."
                      value={endExpression}
                      onChange={(e) => setEndExpression(e.target.value)}
                      placeholder="e.g. res.status === 'ok'"
                      className="font-mono h-11"
                    />
                  </div>
                </div>
              )}
            </main>

            {/* Footer */}
            <footer className="p-6 border-t border-border bg-surface/30 backdrop-blur-md flex items-center justify-between">
              <Button 
                variant="danger"
                size="md"
                onClick={handleDelete}
                className="h-10 px-4"
              >
                <Trash2 size={14} className="mr-2" />
                Delete Loop
              </Button>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-10 px-6" onClick={onClose}>Close Studio</Button>
                {activeTab === "config" && (
                  <Button 
                    variant="primary"
                    className="h-10 px-8 gap-2" 
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Save Changes
                  </Button>
                )}
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-50 p-10 text-center">
            <AlertCircle size={32} />
            <p className="text-[13px]">Select a valid loop to open Studio.</p>
          </div>
        )}
      </div>
    </>
  );
}

function LogRow({ log }: { log: LoopLog }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-none bg-surface/30 overflow-hidden transition-all hover:border-border-hover shadow-sm">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="text-text-subtle group-hover:text-text transition-colors">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={log.status === "success" ? "success" : "danger"}>
              {log.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-text-muted">Duration</span>
            <span className="text-[11px] font-mono text-text-subtle">{log.duration_ms}ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-text-muted">Timestamp</span>
            <span className="text-[11px] font-mono text-text-subtle">
              {new Date(log.run_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-12 pb-4 pt-1 animate-in slide-in-from-top-1 border-t border-border/20">
          <div className="space-y-3">
             <div>
                <span className="text-[10px] font-bold text-text-muted mb-1.5 block">
                  {log.status === "success" ? "Response Output" : "Error Message"}
                </span>
                <pre className="text-[11px] bg-bg/50 border border-border p-4 rounded-none overflow-x-auto text-text font-mono max-h-80 custom-scrollbar pr-2 whitespace-pre-wrap leading-relaxed">
                  {log.error_message || (typeof log.response_body === "object" ? JSON.stringify(log.response_body, null, 2) : log.response_body) || "No output provided"}
                </pre>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
