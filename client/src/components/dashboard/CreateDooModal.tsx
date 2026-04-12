import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { Textarea } from "@/components/ui/Textarea";
import { useDooForm } from "@/hooks/useDooForm";

interface CreateDooModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BOILERPLATE = `export default function(ctx) {
  ctx.get("/", async (req) => {
    ctx.log("System initialized");
    ctx.pixel(0, 0, "brand");
    return ctx.json({ status: "online", Doo: "manifest" });
  });
}`;

export function CreateDooModal({ isOpen, onClose }: CreateDooModalProps) {
  const {
    name,
    setName,
    description,
    setDescription,
    error,
    isPending,
    handleSubmit,
  } = useDooForm({
    mode: "create",
    onClose,
    boilerplate: BOILERPLATE,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a new Doo"
      subtitle="Define your automated logic. Each Doo can be configured with specific code and deployment settings later."
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
            {isPending ? "Initializing..." : "Create Doo"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
