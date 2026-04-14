import { Power, MoreHorizontal, Loader2, Terminal } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  useToggleDooMutation,
  useDeleteDooMutation,
} from "@/hooks/queries/useDoos";
import { toast } from "sonner";
import { useState } from "react";
import { EditDooModal } from "./EditDooModal";
import { Link } from "@tanstack/react-router";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

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
        if (res.ok)
          toast.success(`Doo ${res.data?.is_active ? "activated" : "paused"}`);
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

  const iconBtn =
    "p-1.5 rounded transition-colors cursor-pointer relative z-30";

  return (
    <>
      <div className={cn("flex items-center gap-0.5", className)}>
        <Link
          to="/doo/$id/playground"
          params={{ id: String(doo.id) }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            iconBtn,
            "text-text-subtle hover:text-brand hover:bg-surface border border-transparent",
            "hover:border-border",
          )}
          title="Playground"
        >
          <Terminal size={14} />
        </Link>

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
          {toggleMutation.isPending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Power size={13} />
          )}
        </button>

        <Dropdown
          trigger={
            <button
              className={cn(
                iconBtn,
                "text-text-subtle hover:bg-surface hover:text-text-muted",
              )}
            >
              <MoreHorizontal size={13} />
            </button>
          }
        >
          <DropdownItem onClick={() => setIsEditModalOpen(true)}>
            Edit
          </DropdownItem>
          <DropdownItem>Duplicate</DropdownItem>
          <DropdownItem>View Logs</DropdownItem>
          <DropdownItem onClick={handleDelete} danger>
            Delete
          </DropdownItem>
        </Dropdown>
      </div>

      <EditDooModal
        doo={doo}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
