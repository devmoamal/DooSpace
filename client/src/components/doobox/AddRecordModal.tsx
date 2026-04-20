import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
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
    <Modal isOpen={isOpen} onClose={onClose} title="Entity Provisioning" maxWidth="md">
      <div className="space-y-6">
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted">Entry Identifier</label>
            <Input
              placeholder="e.g. USER_PREFERENCES_V1"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="font-mono h-10"
            />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-muted">Data Payload (JSON/String)</label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-40 px-4 py-3 bg-surface border border-border rounded-none resize-none outline-none text-[12px] font-mono text-text focus:border-brand/30 focus:bg-bg transition-all placeholder:text-text-subtle/50 no-scrollbar shadow-inner"
            placeholder='{ "status": "active", "tier": "premium" }'
            spellCheck={false}
          />
          <p className="text-[10px] font-bold text-text-subtle opacity-60">
            DooBox stores this as a structured JSON object or raw string.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-border/30 mt-6">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-none font-bold text-[10px]">Abort</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!key || !value || setKeyMutation.isPending}
            onClick={handleSave}
            className="gap-2 rounded-none font-black text-[10px] min-w-[120px]"
          >
            {setKeyMutation.isPending ? (
               <Loader2 size={12} className="animate-spin" />
            ) : (
               <Plus size={14} />
            )}
            {setKeyMutation.isPending ? "PROVISIONING..." : "PROVISION"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
