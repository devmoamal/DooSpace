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

export function EditorHeader({ 
  name, 
  onSave, 
  isSaving
}: EditorHeaderProps) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-4">
        <Link
          to="/doo"
          className="p-2 bg-bg hover:bg-surface-lighter rounded-md border border-border text-text-muted hover:text-text transition-all shadow-sm group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </Link>

        <div className="h-8 w-px bg-border mx-2" />

        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-text tracking-tight uppercase">
            {name || "Untitled Doo"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          className="gap-2 bg-brand text-bg hover:bg-brand/90 rounded-md shadow-lg shadow-brand/10 border-t border-brand/20"
          onClick={onSave}
          disabled={isSaving}
        >
          <Save size={14} className={isSaving ? "animate-pulse" : ""} />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </Button>
      </div>
    </header>
  );
}
