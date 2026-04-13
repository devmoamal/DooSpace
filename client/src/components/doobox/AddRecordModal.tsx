import { useState } from "react";
import { Plus, Database } from "lucide-react";
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

export function AddRecordModal({
  isOpen,
  onClose,
  dooId,
}: AddRecordModalProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const setKeyMutation = useSetDooBoxKeyMutation();

  const handleTextChange = (val: string) => {
    setValue(val);
    setIsValid(true); // Always valid now, as we fallback to text
  };

  const handleSave = async () => {
    if (!key || !value) {
      toast.error("Please provide both key and value");
      return;
    }

    try {
      // Try to parse as JSON (handles numbers, booleans, objects, arrays)
      // If it's a raw string without quotes, JSON.parse will fail, and we'll use the raw string
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        parsed = value;
      }

      await setKeyMutation.mutateAsync({
        dooId,
        key,
        value: parsed,
      });
      toast.success("Record created successfully");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create record");
    }
  };

  const reset = () => {
    setKey("");
    setValue("");
    setIsValid(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post New Record"
      subtitle="Deploy a persistent node to this unit"
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Record Key"
            placeholder="e.g. settings_v1"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
              <label className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest leading-none">
                Data Content
              </label>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-brand opacity-60">
                <Database size={10} />
                <span>Flexible Persistence</span>
              </div>
            </div>
            <textarea
              value={value}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full h-40 p-4 bg-bg border border-border rounded-xl resize-none outline-none text-xs font-mono transition-all focus:border-brand/40 shadow-inner"
              placeholder='{ "status": "active" } OR "Hello World"'
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="md"
            className="px-8 shadow-lg shadow-brand/10"
            disabled={!key || !value || !isValid || setKeyMutation.isPending}
            onClick={handleSave}
          >
            <Plus size={16} className="mr-2" />
            {setKeyMutation.isPending ? "Creating..." : "Create Record"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
