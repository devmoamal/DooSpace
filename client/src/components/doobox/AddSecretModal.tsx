import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateSecretMutation } from "@/hooks/queries/useSecrets";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { type SecretMeta } from "@/services/secrets.service";
import { Modal } from "../ui/Modal";

interface AddSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SecretMeta | null;
}

const NAME_RE = /^[A-Z][A-Z0-9_]*$/;

export function AddSecretModal({
  isOpen,
  onClose,
  initialData,
}: AddSecretModalProps) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [nameError, setNameError] = useState("");
  const createMutation = useCreateSecretMutation();

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setValue(""); // Values are write-only, we don't know them
    } else if (isOpen) {
      setName("");
      setValue("");
    }
    setNameError("");
  }, [initialData, isOpen]);

  const handleNameChange = (raw: string) => {
    if (isEditing) return;
    const upper = raw.toUpperCase().replace(/[^A-Z0-9_]/g, "");
    setName(upper);
    if (upper && !NAME_RE.test(upper)) {
      setNameError("Must be SCREAMING_SNAKE_CASE (e.g. MY_SECRET)");
    } else {
      setNameError("");
    }
  };

  const handleSave = async () => {
    if (!name || (!value && !isEditing)) {
      toast.error("Name and value are required");
      return;
    }
    if (!NAME_RE.test(name)) {
      toast.error("Invalid secret name");
      return;
    }
    try {
      const res = await createMutation.mutateAsync({ name, value });
      if (!res.ok) throw new Error(res.message);
      toast.success(`Secret ${name} ${isEditing ? "updated" : "saved"}`);
      setName("");
      setValue("");
      setNameError("");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save secret");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modify Secret Identifier" : "Provision New Secret"}
      maxWidth="md"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-muted">
            Secret Identifier
          </label>
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={isEditing}
            placeholder="VAULT_API_KEY"
            className="font-mono h-10"
            error={nameError || undefined}
          />
          {nameError && (
            <p className="text-[10px] font-bold text-danger font-mono mt-1">
              {nameError}
            </p>
          )}
          {!isEditing && !nameError && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-surface/30 border border-border/50 border-dashed">
              <span className="text-[10px] font-bold text-text-subtle">
                Access Pattern:
              </span>
              <code className="text-[11px] font-bold text-brand font-mono">
                secrets.{name || "VAULT_API_KEY"}
              </code>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-muted">
            {isEditing ? "Update Value (Immutable Entry)" : "Provision Value"}
          </label>
          <Input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              isEditing ? "••••••••••••••••" : "Paste sensitive payload here..."
            }
            className="h-10"
          />
          <p className="text-[10px] font-bold text-text-subtle opacity-60">
            Write-only security: values are never exposed after provisioning.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-border/30 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-none font-bold text-[10px]"
          >
            Abort
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={
              !name ||
              (!value && !isEditing) ||
              !!nameError ||
              createMutation.isPending
            }
            onClick={handleSave}
            className="gap-2 rounded-none font-black text-[10px] min-w-[120px]"
          >
            {createMutation.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <KeyRound size={12} />
            )}
            {createMutation.isPending
              ? "SAVING..."
              : isEditing
                ? "UPDATE SECRET"
                : "PROVISION"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
