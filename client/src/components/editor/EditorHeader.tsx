import { Save, ChevronLeft, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

interface EditorHeaderProps {
  id: number;
  name: string;
  onSave: () => void;
  isSaving: boolean;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function EditorHeader({ name, onSave, isSaving }: EditorHeaderProps) {
  const [justSaved, setJustSaved] = useState(false);
  const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);

  // Flash "saved" indicator briefly after save completes
  useEffect(() => {
    if (!isSaving && justSaved) {
      const t = setTimeout(() => setJustSaved(false), 1500);
      return () => clearTimeout(t);
    }
  }, [isSaving, justSaved]);

  const handleSave = () => {
    onSave();
    setJustSaved(true);
  };

  return (
    <header className="h-11 border-b border-border flex items-center justify-between px-5 bg-bg sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <Link
          to="/doo"
          className="p-1.5 rounded text-text-subtle hover:text-text-muted hover:bg-surface transition-colors"
        >
          <ChevronLeft size={16} />
        </Link>
        <div className="w-px h-4 bg-border" />
        <h1 className="text-[13px] font-medium text-text truncate max-w-xs">
          {name || "Untitled"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Keyboard shortcut hint */}
        <span className="text-[10px] font-mono text-text-subtle hidden sm:block">
          {isMac ? "⌘S" : "Ctrl+S"}
        </span>

        <Button
          size="sm"
          className={cn("gap-1.5 min-w-[72px]", justSaved && !isSaving && "bg-brand/80")}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Save size={13} className="animate-pulse" />
              Saving…
            </>
          ) : justSaved ? (
            <>
              <Check size={13} />
              Saved
            </>
          ) : (
            <>
              <Save size={13} />
              Save
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
