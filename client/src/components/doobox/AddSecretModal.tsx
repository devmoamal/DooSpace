import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateSecretMutation } from "@/hooks/queries/useSecrets";
import { toast } from "sonner";

interface AddSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAME_RE = /^[A-Z][A-Z0-9_]*$/;

export function AddSecretModal({ isOpen, onClose }: AddSecretModalProps) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [nameError, setNameError] = useState("");
  const createMutation = useCreateSecretMutation();

  const handleNameChange = (raw: string) => {
    const upper = raw.toUpperCase().replace(/[^A-Z0-9_]/g, "");
    setName(upper);
    if (upper && !NAME_RE.test(upper)) {
      setNameError("Must be SCREAMING_SNAKE_CASE (e.g. MY_SECRET)");
    } else {
      setNameError("");
    }
  };

  const handleSave = async () => {
    if (!name || !value) { toast.error("Name and value are required"); return; }
    if (!NAME_RE.test(name)) { toast.error("Invalid secret name"); return; }
    try {
      const res = await createMutation.mutateAsync({ name, value });
      if (!res.ok) throw new Error(res.message);
      toast.success(`Secret ${name} saved`);
      setName(""); setValue(""); setNameError(""); onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save secret");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add secret" maxWidth="md">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text-muted">Name</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="MY_API_KEY"
            spellCheck={false}
            className="w-full h-9 px-3 bg-surface border border-border rounded outline-none text-[12px] font-mono text-text focus:border-border-hover transition-colors placeholder:text-text-subtle tracking-wider"
          />
          {nameError && (
            <p className="text-[11px] text-red-500 font-mono">{nameError}</p>
          )}
          <p className="text-[11px] text-text-subtle">
            Access via <code className="font-mono text-brand">secrets.{name || "MY_SECRET"}</code> in your Doo
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text-muted">Value</label>
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="••••••••••••••••"
            className="w-full h-9 px-3 bg-surface border border-border rounded outline-none text-[13px] text-text focus:border-border-hover transition-colors placeholder:text-text-subtle"
          />
          <p className="text-[11px] text-text-subtle">
            Values are never returned by the API — write-only.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!name || !value || !!nameError || createMutation.isPending}
            onClick={handleSave}
            className="gap-1.5"
          >
            <KeyRound size={12} />
            {createMutation.isPending ? "Saving…" : "Save secret"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
