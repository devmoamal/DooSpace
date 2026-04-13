import { Save, ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";

interface EditorHeaderProps {
  id: number;
  name: string;
  onSave: () => void;
  isSaving: boolean;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function EditorHeader({ name, onSave, isSaving }: EditorHeaderProps) {
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
        <h1 className="text-[13px] font-medium text-text truncate">
          {name || "Untitled"}
        </h1>
      </div>

      <Button
        size="sm"
        className="gap-1.5"
        onClick={onSave}
        disabled={isSaving}
      >
        <Save size={13} className={isSaving ? "animate-pulse" : ""} />
        {isSaving ? "Saving…" : "Save"}
      </Button>
    </header>
  );
}
