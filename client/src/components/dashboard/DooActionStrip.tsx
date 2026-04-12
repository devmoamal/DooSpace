import { Power, MoreHorizontal, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useToggleDooMutation, useDeleteDooMutation } from "@/hooks/queries/useDoos";
import { toast } from "sonner";
import { useState } from "react";
import { EditDooModal } from "./EditDooModal";

interface DooActionStripProps {
  doo: any;
  className?: string;
}

export function DooActionStrip({ doo, className }: DooActionStripProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toggleMutation = useToggleDooMutation();
  const deleteMutation = useDeleteDooMutation();

  const isActive = doo.is_active;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMutation.mutate(doo.id, {
      onSuccess: (res) => {
        if (res.ok) {
          const newState = res.data?.is_active;
          toast.success(`Doo ${newState ? "Activated" : "Paused"} successfully`);
        }
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update status");
      },
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Terminate this Doo? All associated logic will be purged.")) {
      deleteMutation.mutate(doo.id, {
        onSuccess: (res) => {
          if (res.ok) {
            toast.success("Doo terminated successfully");
          } else {
            toast.error(res.message || "Failed to delete Doo");
          }
        },
        onError: (err: any) => {
          toast.error(err?.message || "An unexpected error occurred during deletion");
        },
      });
    }
  };

  return (
    <>
      <div className={cn("flex items-center gap-1.5 animate-in fade-in duration-300 relative z-30", className)}>
        <button
          onClick={handleToggle}
          disabled={toggleMutation.isPending}
          className={cn(
            "flex items-center gap-2 h-7 px-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer",
            isActive
              ? "bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
          )}
          title={isActive ? "Pause Doo" : "Activate Doo"}
        >
          {toggleMutation.isPending ? (
            <Loader2 size={10} className="animate-spin" />
          ) : (
            <>
              <Power
                size={10}
                className={cn(isActive && "animate-pulse")}
              />
              <span>{isActive ? "On" : "Off"}</span>
            </>
          )}
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditModalOpen(true);
          }}
          className="p-1.5 rounded-full bg-surface-lighter border border-border hover:border-text/20 text-text-muted hover:text-text transition-all cursor-pointer"
          title="Edit Configuration"
        >
          <MoreHorizontal size={14} />
        </button>

        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="p-1.5 rounded-full bg-surface-lighter border border-border hover:border-red-500/20 text-text-muted hover:text-red-500 transition-all cursor-pointer"
          title="Terminate Doo"
        >
          {deleteMutation.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>

      <EditDooModal
        doo={doo}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
