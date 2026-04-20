import { type Loop } from "@doospace/shared";
import { Repeat, Clock, Tag, History, Play, Pause, Trash2, Activity } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDeleteLoopMutation, useUpdateLoopStatusMutation } from "@/hooks/queries/useLoops";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";

interface LoopListItemProps {
  loop: Loop;
  view?: "grid" | "list";
  onSelect: () => void;
}

function formatTime(date: string | null) {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LoopListItem({ loop, view = "grid", onSelect }: LoopListItemProps) {
  const deleteMutation = useDeleteLoopMutation();
  const updateStatusMutation = useUpdateLoopStatusMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this loop?")) return;
    try {
      await deleteMutation.mutateAsync(loop.id);
      toast.success("Loop deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = loop.status === "active" ? "paused" : "active";
    try {
      await updateStatusMutation.mutateAsync({ id: loop.id, status: newStatus });
      toast.success(`Loop ${newStatus === "active" ? "resumed" : "paused"}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const statusBadgeVariant = (s: Loop["status"]) => {
    if (s === "active") return "success";
    if (s === "paused") return "warning";
    return "danger";
  };

  return (
    <>
      <div
        onClick={onSelect}
        className={cn(
          "group flex relative border border-border rounded-none bg-bg transition-colors hover:bg-surface cursor-pointer",
          view === "grid" ? "flex-col p-4" : "flex-row items-center p-3 gap-4"
        )}
      >
        {view === "grid" ? (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "w-8 h-8 rounded-none border flex items-center justify-center transition-all",
                loop.status === "active" ? "bg-brand/5 border-brand/20 text-brand" : "bg-bg border-border text-text-subtle"
              )}>
                <Repeat size={14} className={cn(loop.status === "active" && "animate-[spin_10s_linear_infinite]")} />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                <IconButton
                  onClick={handleToggleStatus}
                  variant="ghost"
                  className={cn(loop.status === "active" ? "text-amber-500" : "text-green-500")}
                  title={loop.status === "active" ? "Pause" : "Resume"}
                  size="sm"
                >
                  {loop.status === "active" ? <Pause size={13} /> : <Play size={13} />}
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  variant="danger"
                  title="Delete"
                  size="sm"
                >
                  <Trash2 size={13} />
                </IconButton>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-medium text-text line-clamp-1">Doo #{loop.doo_id}</h3>
                <Badge variant={statusBadgeVariant(loop.status)}>{loop.status}</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-subtle font-mono truncate">
                <Tag size={10} />
                <Badge variant="neutral" size="xs">{loop.type}</Badge>
                {loop.target_path}
              </div>
              <div className="flex flex-col gap-1 mt-2 border-t border-border/50 pt-2 text-[10px] text-text-muted font-mono">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Clock size={10} /> Interval</span>
                  <span className="text-text">{loop.type === "interval" ? `${loop.interval_ms}ms` : "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><History size={10} /> Last Run</span>
                  <span>{formatTime(loop.last_run_at)}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative z-0 shrink-0">
              <div className={cn(
                "w-7 h-7 rounded-none border flex items-center justify-center transition-all",
                loop.status === "active" ? "bg-brand/5 border-brand/20 text-brand" : "bg-bg border-border text-text-subtle"
              )}>
                <Activity size={12} className={cn(loop.status === "active" && "animate-[spin_10s_linear_infinite]")} />
              </div>
            </div>
            <div className="flex-1 min-w-0 grid grid-cols-4 items-center gap-3">
              <div>
                <h3 className="text-[12px] font-medium text-text truncate">Doo #{loop.doo_id}</h3>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-text-subtle font-mono truncate">
                  <Tag size={9} />
                  {loop.target_path}
                </div>
              </div>
              <div>
                <Badge variant={statusBadgeVariant(loop.status)}>{loop.status}</Badge>
              </div>
              <div className="text-[11px] font-mono text-text-subtle">
                {loop.type === "interval" ? `${loop.interval_ms}ms` : loop.type}
              </div>
              <div className="text-[10px] font-mono text-text-muted">
                 Last: {formatTime(loop.last_run_at)}
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1 relative z-10">
              <IconButton
                onClick={handleToggleStatus}
                variant="ghost"
                className={cn(loop.status === "active" ? "text-amber-500" : "text-green-500")}
                title={loop.status === "active" ? "Pause" : "Resume"}
                size="sm"
              >
                {loop.status === "active" ? <Pause size={13} /> : <Play size={13} />}
              </IconButton>
              <IconButton 
                onClick={handleDelete} 
                variant="danger"
                title="Delete"
                size="sm"
              >
                <Trash2 size={13} />
              </IconButton>
            </div>
          </>
        )}
      </div>
    </>
  );
}
