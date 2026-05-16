import { useState } from "react";
import { usePages } from "@/hooks/queries/usePages";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileText, Loader2 } from "lucide-react";

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePageModal({ isOpen, onClose }: CreatePageModalProps) {
  const [name, setName] = useState("");
  const { useCreatePage } = usePages();
  const createPage = useCreatePage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createPage.mutateAsync(name);
      setName("");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New App"
      icon={<FileText size={18} className="text-brand" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <Input
          label="App Name"
          placeholder="e.g. Flight Dashboard, Calculator, etc."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" type="button" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={createPage.isPending || !name.trim()}
            size="sm"
          >
            {createPage.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create App"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
