import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { useDooForm } from "@/hooks/useDooForm";
import { type Doo } from "@doospace/shared";
import { cn } from "@/lib/cn";
import { Loader2, Settings2 } from "lucide-react";

interface EditDooModalProps {
  isOpen: boolean;
  onClose: () => void;
  doo: Doo;
}

export function EditDooModal({ isOpen, onClose, doo }: EditDooModalProps) {
  const {
    name, setName,
    description, setDescription,
    error, isPending, handleSubmit,
  } = useDooForm({
    mode: "edit",
    initialData: doo,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Logic Unit Configuration"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        {error && (
          <div className="px-4 py-3 border border-red-500/20 rounded-none text-red-500 text-[11px] font-mono bg-red-500/5 animate-in fade-in slide-in-from-top-1">
            <span className="font-bold mr-2">ERR_MANIFEST:</span>
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted">Unit Identification</label>
            <Input
              placeholder="e.g. data_aggregator_v1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 font-mono"
              autoFocus
              required
            />
            <p className="text-[10px] font-bold text-text-subtle opacity-50">Unique identifier used for routing and orchestration.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted">Operational Context</label>
            <Textarea
              placeholder="Describe the primary responsibility of this Doo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] py-3 shadow-inner"
            />
            <p className="text-[10px] font-bold text-text-subtle opacity-50">Optional documentation for team collaboration.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30 mt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="rounded-none font-bold text-[10px]">
            Abort
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isPending}
            className="gap-2 rounded-none font-black text-[10px] min-w-[140px]"
          >
            {isPending ? (
               <Loader2 size={12} className="animate-spin" />
            ) : (
               <Settings2 size={13} />
            )}
            {isPending ? "COMMITTING..." : "SAVE CONFIG"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
