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
import { IconButton } from "@/components/ui/IconButton";

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

  return (
    <>
      <div className={cn("flex items-center gap-1", className)}>
        <Link
          to="/doo/$id/playground"
          params={{ id: String(doo.id) }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            variant="ghost"
            size="sm"
            title="Open Playground"
            className="text-text-subtle hover:text-brand"
          >
            <Terminal size={14} />
          </IconButton>
        </Link>

        <IconButton
          onClick={handleToggle}
          disabled={toggleMutation.isPending}
          variant="ghost"
          size="sm"
          title={isActive ? "Pause" : "Activate"}
          className={cn("rounded-none", isActive ? "text-brand" : "text-text-subtle")}
        >
          {toggleMutation.isPending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Power size={13} />
          )}
        </IconButton>

        <Dropdown
          trigger={
            <IconButton
              variant="ghost"
              size="sm"
              title="More Options"
              className="text-text-subtle"
            >
              <MoreHorizontal size={14} />
            </IconButton>
          }
        >
          <DropdownItem onClick={() => setIsEditModalOpen(true)}>
            Edit Details
          </DropdownItem>
          <DropdownItem>Clone Unit</DropdownItem>
          <DropdownItem>Execution Logs</DropdownItem>
          <DropdownItem onClick={handleDelete} danger>
            Delete Permanently
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
