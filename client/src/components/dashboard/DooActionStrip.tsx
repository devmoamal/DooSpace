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
        if (res.ok) toast.success(`Doo ${res.data?.is_active ? "activated" : "paused"}`);
      },
      onError: (err: any) => toast.error(err?.message || "Failed"),
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this Doo?")) {
      deleteMutation.mutate(doo.id, {
        onSuccess: (res) => {
          if (res.ok) toast.success("Deleted");
          else toast.error(res.message || "Failed");
        },
        onError: (err: any) => toast.error(err?.message || "Error"),
      });
    }
  };

  const iconBtn = "p-1.5 rounded transition-colors cursor-pointer relative z-30";

  return (
    <>
      <div className={cn("flex items-center gap-0.5", className)}>
        <button
          onClick={handleToggle}
          disabled={toggleMutation.isPending}
          className={cn(
            iconBtn,
            isActive
              ? "text-brand hover:bg-brand-muted"
              : "text-text-subtle hover:bg-surface hover:text-text-muted",
          )}
          title={isActive ? "Pause" : "Activate"}
        >
          {toggleMutation.isPending
            ? <Loader2 size={13} className="animate-spin" />
            : <Power size={13} />
          }
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditModalOpen(true);
          }}
          className={cn(iconBtn, "text-text-subtle hover:bg-surface hover:text-text-muted")}
          title="Edit"
        >
          <MoreHorizontal size={13} />
        </button>

        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={cn(iconBtn, "text-text-subtle hover:bg-red-500/10 hover:text-red-500")}
          title="Delete"
        >
          {deleteMutation.isPending
            ? <Loader2 size={13} className="animate-spin" />
            : <Trash2 size={13} />
          }
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
