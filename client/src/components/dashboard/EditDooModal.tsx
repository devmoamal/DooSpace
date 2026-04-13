import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { useDooForm } from "@/hooks/useDooForm";
import { type Doo } from "@doospace/shared";
import { cn } from "@/lib/cn";

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
      title="Edit Doo"
      subtitle="Update name and description."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <p className="mb-4 px-3 py-2 border border-red-500/20 rounded text-red-500 text-[11px] font-mono bg-red-500/5">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <Input
            label="Name"
            placeholder="Name your Doo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="Identifier for this logic unit"
            horizontal
            autoFocus
            required
          />

          <Textarea
            label="Description"
            placeholder="What does this Doo do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Optional context"
            horizontal
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-4">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className={cn(isPending && "opacity-50 cursor-not-allowed")}
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
