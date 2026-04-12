import { useState } from "react";
import { Loader2, Trash2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { type DooStorageUsage } from "@doospace/shared";
import { useDooStorageQuery, useSetStorageKeyMutation, useDeleteStorageKeyMutation } from "@/hooks/queries/useStorage";
import { toast } from "sonner";

interface StorageExplorerProps {
  doo: DooStorageUsage | null;
  onClose: () => void;
}

export function StorageExplorer({
  doo,
  onClose,
}: StorageExplorerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: keys = [], isLoading } = useDooStorageQuery(doo?.dooId || 0);
  const setKeyMutation = useSetStorageKeyMutation();
  const deleteKeyMutation = useDeleteStorageKeyMutation();

  const handleAdd = () => {
    if (!newKey || !newValue) {
      toast.error("Please provide both key and value");
      return;
    }
    setKeyMutation.mutate({
      dooId: doo!.dooId,
      key: newKey,
      value: newValue
    }, {
      onSuccess: () => {
        setIsAdding(false);
        setNewKey("");
        setNewValue("");
        toast.success("Resource mapped successfully");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to map resource");
      }
    });
  };

  const handleDelete = (key: string) => {
    if (window.confirm(`Delete resource key "${key}"?`)) {
      deleteKeyMutation.mutate({ dooId: doo!.dooId, key }, {
        onSuccess: () => toast.success("Resource deleted"),
        onError: (err: any) => toast.error(err.message || "Failed to delete resource")
      });
    }
  };

  const filteredKeys = keys.filter((k: any) => 
    k.key.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <Modal
      isOpen={!!doo}
      onClose={onClose}
      title={doo?.dooName + " Storage"}
      subtitle="Resources / Persistence Access"
      maxWidth="xl"
    >
      <div className="flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="relative flex-1 mr-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40"
              size={14}
            />
            <input
              className="w-full h-9 pl-9 pr-4 bg-bg border border-border rounded-md text-[11px] font-medium placeholder:text-text-muted/40 outline-none focus:border-brand/40"
              placeholder="Filter by resource key..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus size={14} />
            <span>Add Row</span>
          </Button>
        </div>

        {isAdding && (
          <div className="mb-6 p-4 bg-surface-lighter border border-border rounded-lg space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Resource Key"
                placeholder="e.g. user_metadata"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                horizontal
              />
              <Input
                label="Storage Value"
                placeholder="JSON format..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                horizontal
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleAdd}
                disabled={setKeyMutation.isPending}
              >
                {setKeyMutation.isPending ? "Committing..." : "Commit Row"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0 border border-border rounded-lg custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-brand" size={24} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface z-10 border-b border-border shadow-sm">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-surface">
                    Key
                  </th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-surface">
                    Value
                  </th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] bg-surface text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredKeys.map((item: any) => (
                  <tr key={item.key} className="hover:bg-surface-lighter group">
                    <td className="px-5 py-3 align-top">
                      <code className="text-[11px] font-bold text-brand font-mono">
                        {item.key}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <pre className="text-[11px] font-mono text-text-muted bg-bg border border-border p-2 rounded max-w-[300px] overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(item.value, null, 2)}
                      </pre>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleDelete(item.key)}
                        disabled={deleteKeyMutation.isPending}
                        className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-all active:scale-90"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {(!filteredKeys || filteredKeys.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-16 text-center text-text-muted text-xs font-bold uppercase tracking-widest opacity-20"
                    >
                      {searchTerm ? "No matching resources" : "No resources mapped"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 flex justify-end shrink-0 gap-3">
          <Button
            variant="secondary"
            size="md"
            className="px-8"
            onClick={onClose}
          >
            Finish
          </Button>
        </div>
      </div>
    </Modal>
  );
}
