import React from "react";
import { useDooQuery } from "@/hooks/queries/useDoos";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { LogicEditor } from "@/components/editor/LogicEditor";
import { EndpointsPanel } from "@/components/editor/EndpointsPanel";
import { BrowserURLBar } from "@/components/editor/BrowserURLBar";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDooEditor } from "@/hooks/useDooEditor";
import { useResizableSidebar } from "@/hooks/useResizableSidebar";
import { useSaveShortcut } from "@/hooks/useKeyboardShortcut";

interface DooEditorProps {
  id: number;
}

export const DooEditorPage: React.FC<DooEditorProps> = ({ id }) => {
  const { data: doo, isLoading: isDooLoading } = useDooQuery(id);

  const {
    code,
    setCode,
    isFormatting,
    isSaving,
    handleFormat,
    formatCode,
    handleSave,
    handleSync,
  } = useDooEditor({
    id,
    initialCode: doo?.code || "",
  });

  const { width: sidebarWidth, isResizing, startResizing } = useResizableSidebar({
    initialWidth: 320,
    minWidth: 200,
    maxWidth: 600,
  });

  // Handle Cmd+S or Ctrl+S
  useSaveShortcut(handleSave);

  if (isDooLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex-1 flex flex-col h-full bg-surface overflow-hidden relative",
        isResizing && "cursor-col-resize select-none",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(62,207,142,0.03),transparent_50%)] pointer-events-none" />

      <EditorHeader
        id={id}
        name={doo?.name || ""}
        onSync={handleSync}
        isSyncing={isSaving}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <BrowserURLBar
        id={id}
        onFormat={handleFormat}
        isFormatting={isFormatting}
      />

      <main className="flex-1 flex gap-0 overflow-hidden min-h-0 relative z-10">
        <div className="flex-1 flex flex-col overflow-hidden pl-6">
          <LogicEditor
            id={id}
            code={code}
            onChange={setCode}
            onFormat={formatCode}
          />
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={startResizing}
          className={cn(
            "w-1 relative z-20 cursor-col-resize hover:bg-brand/30 transition-colors",
            isResizing && "bg-brand/50",
          )}
        />

        <div
          className="hidden lg:flex bg-surface flex-col shrink-0 overflow-hidden"
          style={{ width: sidebarWidth }}
        >
          <EndpointsPanel
            endpoints={doo?.endpoints || []}
            className="flex-1"
          />
        </div>
      </main>
    </div>
  );
};
