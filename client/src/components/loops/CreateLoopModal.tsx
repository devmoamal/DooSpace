import { useState, useEffect } from "react";
import { Repeat, Play, Code, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { useDoosQuery } from "@/hooks/queries/useDoos";
import { useCreateLoopMutation } from "@/hooks/queries/useLoops";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { type Doo, type LoopType } from "@doospace/shared";
import { LoopPayloadEditor } from "./LoopPayloadEditor";

interface CreateLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLoopModal({ isOpen, onClose }: CreateLoopModalProps) {
  const [selectedDoo, setSelectedDoo] = useState<Doo | null>(null);
  const [selectedPath, setSelectedPath] = useState("");
  const [type, setType] = useState<LoopType>("once");
  const [intervalMs, setIntervalMs] = useState("5000");
  const [payload, setPayload] = useState("{}");
  const [endExpression, setEndExpression] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { data: doosRes } = useDoosQuery({ limit: 5, search: debouncedSearch });
  const doos = doosRes?.data || [];
  const createMutation = useCreateLoopMutation();

  // Reset when selected Doo changes
  useEffect(() => {
    if (selectedDoo?.endpoints?.length) {
      setSelectedPath(selectedDoo.endpoints[0].path);
    } else {
      setSelectedPath("");
    }
  }, [selectedDoo]);

  const handleSave = async () => {
    if (!selectedDoo || !selectedPath) {
      toast.error("Please select a Doo and an endpoint");
      return;
    }

    try {
      // Validate JSON
      const parsedPayload = JSON.parse(payload);
      
      await createMutation.mutateAsync({
        doo_id: selectedDoo.id as number,
        type,
        interval_ms: type === "interval" ? parseInt(intervalMs) : undefined,
        payload: parsedPayload,
        target_path: selectedPath,
        end_expression: endExpression || undefined,
      });

      toast.success("Loop created successfully");
      onClose();
      // Reset form
      setSelectedDoo(null);
      setPayload("{}");
      setEndExpression("");
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error("Invalid JSON payload");
      } else {
        toast.error(err.message || "Failed to create loop");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Loop" maxWidth="lg">
      <div className="space-y-5 pb-2">
        {/* Doo Selection */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text-muted px-0.5">Target Doo</label>
          {selectedDoo ? (
             <div className="flex items-center justify-between p-2.5 rounded-none border border-brand bg-brand/5 ring-1 ring-brand/10">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-none bg-brand text-bg flex items-center justify-center shrink-0">
                   <Code size={14} />
                 </div>
                 <div className="min-w-0">
                   <p className="text-[12px] font-medium text-text truncate">{selectedDoo.name}</p>
                   <p className="text-[10px] text-text-subtle truncate">ID: {selectedDoo.id}</p>
                 </div>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setSelectedDoo(null)} className="h-7 text-brand hover:text-brand px-2">
                 Change
               </Button>
             </div>
          ) : (
            <div className="space-y-2 border border-border rounded-none p-2 bg-surface">
              <Input 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doos..." 
                className="h-8 text-[12px] bg-bg"
                autoFocus
              />
              <div className="space-y-1 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                {doos.map(doo => (
                   <button key={doo.id} onClick={() => setSelectedDoo(doo)} className="w-full flex items-center gap-2.5 p-2 hover:bg-bg rounded-none text-left transition-colors group cursor-pointer">
                     <Code size={13} className="text-text-subtle group-hover:text-text-muted" />
                     <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-medium text-text block truncate">{doo.name}</span>
                        <span className="text-[10px] text-text-subtle block truncate">{doo.endpoints?.length || 0} endpoints</span>
                     </div>
                   </button>
                ))}
                {doos.length === 0 && (
                  <p className="text-[11px] text-text-subtle text-center py-4">No Doos found</p>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedDoo && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Endpoint Selection */}
            <Select
              label="Endpoint"
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
              className="h-9"
            >
              {selectedDoo.endpoints.map((ep) => (
                <option key={ep.path} value={ep.path}>
                  {ep.method} {ep.path}
                </option>
              ))}
            </Select>

            {/* Loop Type */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-text-muted px-0.5">Trigger Type</label>
              <div className="flex bg-surface border border-border rounded-none p-0.5 h-9">
                {(["once", "interval", "event"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "flex-1 h-full rounded-none text-[11px] font-medium transition-all capitalize cursor-pointer",
                      type === t ? "bg-bg text-text shadow-sm" : "text-text-subtle hover:text-text-muted"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Configuration */}
        {type === "interval" && (
          <Input
            label="Interval (ms)"
            type="number"
            value={intervalMs}
            onChange={(e) => setIntervalMs(e.target.value)}
            placeholder="5000"
            helperText="Example: 1000 = 1 second, 60000 = 1 minute"
            className="h-9 font-mono"
          />
        )}

        {/* Payload Editor */}
        <LoopPayloadEditor
          payload={payload}
          setPayload={setPayload}
          requestType={selectedDoo?.endpoints.find((ep) => ep.path === selectedPath)?.request_type}
        />

        {/* End Expression */}
        <div className="space-y-1.5 border-t border-border/50 pt-4">
          <Input
            label="End Condition (Optional)"
            value={endExpression}
            onChange={(e) => setEndExpression(e.target.value)}
            placeholder="e.g. res.status === 'ok'"
            className="h-9 font-mono"
            helperText="JavaScript expression using parsed response as 'res'."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border/50 mt-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="px-4">Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!selectedDoo || createMutation.isPending}
            className="gap-2 px-6"
          >
            {createMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            {createMutation.isPending ? "Creating..." : "Create Loop"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
