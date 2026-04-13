import { useState } from "react";
import { StudioSidebar } from "./StudioSidebar";
import { DooBoxUnifiedWorkspace } from "./DooBoxUnifiedWorkspace";
import { JSONEditorDrawer } from "./JSONEditorDrawer";
import { AddRecordModal } from "./AddRecordModal";
import { useDooBoxUsageQuery } from "@/hooks/queries/useDooBox";
import { type DooBoxUsage } from "@doospace/shared";
import { Loader2 } from "lucide-react";

export function DooBoxStudio() {
  const [selectedDoo, setSelectedDoo] = useState<DooBoxUsage | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [editingRecord, setEditingRecord] = useState<{ key: string; value: any } | null>(null);
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  const { data: usage = [], isLoading } = useDooBoxUsageQuery();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-text-subtle" size={18} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-bg">
      <StudioSidebar
        usage={usage}
        selectedDooId={selectedDoo?.dooId || null}
        onSelect={setSelectedDoo}
        searchTerm={sidebarSearch}
        onSearchChange={setSidebarSearch}
      />

      <DooBoxUnifiedWorkspace
        doo={selectedDoo}
        onEdit={(key, value) => setEditingRecord({ key, value })}
        onAdd={() => setIsAddingRecord(true)}
      />

      {selectedDoo && editingRecord && (
        <JSONEditorDrawer
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          dooId={selectedDoo.dooId}
          recordKey={editingRecord.key}
          initialValue={editingRecord.value}
        />
      )}

      {selectedDoo && (
        <AddRecordModal
          isOpen={isAddingRecord}
          onClose={() => setIsAddingRecord(false)}
          dooId={selectedDoo.dooId}
        />
      )}
    </div>
  );
}
