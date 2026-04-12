import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { Textarea } from "@/components/ui/Textarea";
import { useDooForm } from "@/hooks/useDooForm";
import { type Doo } from "@doospace/shared";

interface EditDooModalProps {
  isOpen: boolean;
  onClose: () => void;
  doo: Doo;
}

export function EditDooModal({ isOpen, onClose, doo }: EditDooModalProps) {
  const {
    name,
    setName,
    description,
    setDescription,
    error,
    isPending,
    handleSubmit,
  } = useDooForm({
    mode: "edit",
    initialData: doo,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Doo Settings"
      subtitle="Update the name and description of this automated logic Doo."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col">
          <Input
            label="Name"
            placeholder="Name your Doo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="What should we call this automated logic?"
            horizontal
            autoFocus
            required
          />

          <Textarea
            label="Description"
            placeholder="What does this Doo do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Optional context for your team members."
            horizontal
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/40 mt-4">
          <Button
            type="button"
            variant="secondary"
            className="px-6 h-10"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={cn(
              "px-8 h-10 transition-all",
              isPending && "opacity-50 cursor-not-allowed",
            )}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
