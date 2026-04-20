import { useState } from "react";
import { Repeat, Clock, Play, Code, Check, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUpdateLoopMutation } from "@/hooks/queries/useLoops";
import { useDooQuery } from "@/hooks/queries/useDoos";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { type Loop, type LoopType } from "@doospace/shared";
import { LoopPayloadEditor } from "./LoopPayloadEditor";

interface EditLoopModalProps {
  loop: Loop;
  isOpen: boolean;
  onClose: () => void;
}

export function EditLoopModal({ loop, isOpen, onClose }: EditLoopModalProps) {
  const [type, setType] = useState<LoopType>(loop.type);
  const [intervalMs, setIntervalMs] = useState(loop.interval_ms?.toString() || "5000");
  const [payload, setPayload] = useState(
    loop.payload ? JSON.stringify(loop.payload, null, 2) : "{}"
  );
  const [endExpression, setEndExpression] = useState(loop.end_expression || "");

  const updateMutation = useUpdateLoopMutation();
  const { data: dooRes } = useDooQuery(loop.doo_id);

  const handleSave = async () => {
    try {
      // Validate JSON
      const parsedPayload = JSON.parse(payload);
      
      await updateMutation.mutateAsync({
        id: loop.id,
        data: {
          type,
          interval_ms: type === "interval" ? parseInt(intervalMs) : undefined,
          payload: parsedPayload,
          end_expression: endExpression || undefined,
        }
      });

      toast.success("Loop updated successfully");
      onClose();
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error("Invalid JSON payload");
      } else {
        toast.error(err.message || "Failed to update loop");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Loop" maxWidth="lg">
      <div className="space-y-5 pb-2">
        <div className="flex items-center justify-between p-2.5 rounded-none border bg-brand/5 border-brand/30 ring-1 ring-brand/10">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-none bg-brand text-white flex items-center justify-center shrink-0">
               <Code size={14} />
             </div>
             <div className="min-w-0">
               <p className="text-[12px] font-medium text-text truncate">Doo #{loop.doo_id}</p>
               <p className="text-[10px] text-text-subtle truncate">Endpoint: {loop.target_path}</p>
             </div>
           </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text-muted px-0.5">Trigger Type</label>
          <div className="flex bg-surface border border-border rounded p-0.5">
            {(["once", "interval", "event"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "flex-1 h-7 rounded text-[11px] font-medium transition-all capitalize",
                  type === t ? "bg-bg text-text shadow-sm" : "text-text-subtle hover:text-text-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        {type === "interval" && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
            <label className="text-[12px] font-medium text-text-muted px-0.5 flex items-center gap-1.5">
              <Clock size={12} />
              Interval (ms)
            </label>
            <input
              type="number"
              value={intervalMs}
              onChange={(e) => setIntervalMs(e.target.value)}
              placeholder="5000"
              className="w-full h-9 px-3 bg-surface border border-border rounded outline-none text-[12px] text-text font-mono focus:border-brand/50 transition-colors"
            />
          </div>
        )}

        {/* Payload Editor */}
        <LoopPayloadEditor
          payload={payload}
          setPayload={setPayload}
          requestType={dooRes?.endpoints?.find((ep) => ep.path === loop.target_path)?.request_type}
        />

        {/* End Expression */}
        <div className="space-y-1.5 border-t border-border/50 pt-4">
          <label className="text-[12px] font-medium text-text-muted px-0.5 flex items-center gap-1.5">
            <Repeat size={12} />
            End Condition (Optional)
          </label>
          <input
            value={endExpression}
            onChange={(e) => setEndExpression(e.target.value)}
            placeholder="e.g. res.status === 'ok'"
            className="w-full h-9 px-3 bg-surface border border-border rounded outline-none text-[12px] text-text font-mono focus:border-brand/50 transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border/50 mt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="gap-1.5"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
