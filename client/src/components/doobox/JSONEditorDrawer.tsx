import { useState, useEffect } from "react";
import { X, Save, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/ui/Badge";
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
      <div className="fixed inset-0 z-100 bg-black/10 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[500px] bg-bg border-l border-border z-101 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 ease-out rounded-none">
        {/* Header */}
        <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0 bg-bg/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
             <div className="w-6 h-6 rounded-none bg-brand/10 flex items-center justify-center shrink-0">
                <Database size={12} className="text-brand" />
             </div>
             <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-text-muted">Entry Inspector</span>
                <span className="text-[11px] font-mono text-text-subtle truncate max-w-[240px] opacity-60 italic">{recordKey}</span>
             </div>
          </div>
          <IconButton
            onClick={onClose}
            variant="ghost"
            size="sm"
            title="Close editor"
          >
            <X size={16} />
          </IconButton>
        </header>

        {/* Editor */}
        <div className="flex-1 p-4 bg-bg-alt/10 flex flex-col">
           <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-text-subtle">JSON Manifest</span>
              <Badge variant="neutral" size="xs" className="font-mono text-[9px] opacity-60">UTF-8</Badge>
           </div>
          <textarea
            value={value}
            onChange={(e) => { setValue(e.target.value); setIsValid(true); }}
            className={cn(
              "flex-1 w-full p-4 bg-bg border border-border rounded-none resize-none outline-none text-[12px] font-mono text-text transition-all no-scrollbar shadow-inner",
              "placeholder:text-text-subtle/30 focus:border-brand/30",
              !isValid && "border-red-500/40 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.05)]"
            )}
            spellCheck={false}
          />
          <div className="mt-3">
             <p className="text-[10px] font-bold text-text-subtle opacity-50">
               MODIFICATION: All changes will be persisted to the primary store immediately upon saving.
             </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="h-14 px-5 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-bg/80 backdrop-blur-md">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-none font-bold text-[10px]">Abort</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!isValid || setKeyMutation.isPending}
            className="gap-2 rounded-none font-black text-[10px] min-w-[120px]"
          >
            {setKeyMutation.isPending ? (
               <Loader2 size={12} className="animate-spin" />
            ) : (
               <Save size={14} />
            )}
            {setKeyMutation.isPending ? "COMMITTING..." : "COMMIT CHANGES"}
          </Button>
        </footer>
      </div>
    </>
  );
}
