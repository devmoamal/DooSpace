import { useState, useEffect } from "react";
import { X, Save, FileCode, Database, Code2 } from "lucide-react";
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
  isOpen,
  onClose,
  dooId,
  recordKey,
  initialValue,
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
        key: recordKey,
        value: parsed,
      });
      toast.success("Record updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save record");
    }
  };

  const handleTextChange = (val: string) => {
    setValue(val);
    setIsValid(true); // Always valid as we fallback to text
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-bg/40 backdrop-blur-[2px] z-100 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-[500px] bg-bg border-l border-border shadow-2xl z-101 flex flex-col animate-in slide-in-from-right duration-300">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand/10 text-brand rounded-lg">
              <FileCode size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">Edit Persistent Node</h2>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mt-1">{recordKey}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text hover:bg-surface rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 flex flex-col min-h-0 bg-surface/5">
          {/* Metadata Bar */}
          <div className="px-6 py-3 border-b border-border bg-bg/50 flex items-center gap-4 shrink-0">
             <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <Database size={12} className="opacity-40" />
                <span>Node Identity: {recordKey}</span>
             </div>
             <div className={cn(
               "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ml-auto transition-colors text-brand/60"
             )}>
                <Code2 size={12} />
                <span>Flexible Mode</span>
             </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full relative font-mono text-xs">
              <textarea
                value={value}
                onChange={(e) => handleTextChange(e.target.value)}
                className={cn(
                  "w-full h-full p-4 bg-bg border rounded-xl resize-none outline-none transition-all custom-scrollbar",
                  isValid ? "border-border focus:border-brand/40" : "border-amber-500/50 focus:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                )}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <footer className="p-6 border-t border-border bg-surface/30 flex items-center justify-end gap-3 shrink-0">
          <Button 
            variant="secondary" 
            size="md" 
            className="min-w-[100px]"
            onClick={onClose}
          >
            Discard
          </Button>
          <Button 
            size="md" 
            className="min-w-[120px] shadow-lg shadow-brand/10"
            onClick={handleSave}
            disabled={!isValid || setKeyMutation.isPending}
          >
            <Save size={16} className="mr-2" />
            {setKeyMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </footer>
      </div>
    </>
  );
}
