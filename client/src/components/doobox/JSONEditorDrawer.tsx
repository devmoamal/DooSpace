import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSetDooBoxKeyMutation } from "@/hooks/queries/useDooBox";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

interface JSONEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dooId: number;
  recordKey: string;
  initialValue: any;
}

export function JSONEditorDrawer({
  isOpen, onClose, dooId, recordKey, initialValue,
}: JSONEditorDrawerProps) {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const setKeyMutation = useSetDooBoxKeyMutation();

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(JSON.stringify(initialValue, null, 2));
    }
  }, [initialValue]);

  const handleSave = async () => {
    try {
      let parsed;
      try { parsed = JSON.parse(value); } catch { parsed = value; }
      await setKeyMutation.mutateAsync({ dooId, key: recordKey, value: parsed });
      toast.success("Saved");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-100 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[460px] bg-bg border-l border-border z-101 flex flex-col">
        {/* Header */}
        <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12px] font-medium text-text shrink-0">Edit record</span>
            <span className="text-[11px] font-mono text-text-muted truncate">{recordKey}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-subtle hover:text-text-muted transition-colors rounded hover:bg-surface shrink-0 ml-3 cursor-pointer"
          >
            <X size={15} />
          </button>
        </header>

        {/* Editor */}
        <div className="flex-1 p-4 overflow-hidden">
          <textarea
            value={value}
            onChange={(e) => { setValue(e.target.value); setIsValid(true); }}
            className={cn(
              "w-full h-full p-4 bg-surface border rounded resize-none outline-none text-[12px] font-mono text-text transition-colors no-scrollbar",
              "placeholder:text-text-subtle",
              isValid
                ? "border-border focus:border-border-hover"
                : "border-red-500/40"
            )}
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <footer className="h-12 px-5 border-t border-border flex items-center justify-end gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isValid || setKeyMutation.isPending}
            className="gap-1.5"
          >
            <Save size={12} />
            {setKeyMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </footer>
      </div>
    </>
  );
}
