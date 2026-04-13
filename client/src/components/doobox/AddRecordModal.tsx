import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSetDooBoxKeyMutation } from "@/hooks/queries/useDooBox";
import { toast } from "sonner";

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  dooId: number;
}

export function AddRecordModal({ isOpen, onClose, dooId }: AddRecordModalProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const setKeyMutation = useSetDooBoxKeyMutation();

  const handleSave = async () => {
    if (!key || !value) { toast.error("Key and value are required"); return; }
    try {
      let parsed;
      try { parsed = JSON.parse(value); } catch { parsed = value; }
      await setKeyMutation.mutateAsync({ dooId, key, value: parsed });
      toast.success("Record created");
      setKey(""); setValue(""); onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add record" maxWidth="md">
      <div className="space-y-4">
        <Input
          label="Key"
          placeholder="e.g. settings_v1"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text-muted">Value</label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-36 px-3 py-2 bg-surface border border-border rounded resize-none outline-none text-[12px] font-mono text-text focus:border-border-hover transition-colors placeholder:text-text-subtle no-scrollbar"
            placeholder='{ "key": "value" }'
            spellCheck={false}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!key || !value || setKeyMutation.isPending}
            onClick={handleSave}
            className="gap-1.5"
          >
            <Plus size={12} />
            {setKeyMutation.isPending ? "Creating…" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
