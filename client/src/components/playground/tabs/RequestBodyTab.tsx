import React from "react";
import { cn } from "@/lib/cn";
import { Braces, Layers } from "lucide-react";
import { type ParsedField } from "@/utils/typeParser";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { KeyValueEditor, type KeyValueItem } from "../KeyValueEditor";
import { CodeEditor } from "../../editor/CodeEditor";
import { type BodyMode } from "@/hooks/usePlayground";

interface RequestBodyTabProps {
  bodyMode: BodyMode;
  onBodyModeChange: (m: BodyMode) => void;
  parsedFields: ParsedField[] | null;
  formBody: Record<string, string>;
  onFormBodyChange: (fb: Record<string, string>) => void;
  kvBody: KeyValueItem[];
  onKvBodyChange: (kv: KeyValueItem[]) => void;
  rawBody: string;
  onRawBodyChange: (rb: string) => void;
}

export const RequestBodyTab: React.FC<RequestBodyTabProps> = ({
  bodyMode,
  onBodyModeChange,
  parsedFields,
  formBody,
  onFormBodyChange,
  kvBody,
  onKvBodyChange,
  rawBody,
  onRawBodyChange,
}) => {
  const typeVariant = (type: string): any => {
    if (type === "string") return "success";
    if (type === "number") return "warning";
    if (type === "boolean") return "info";
    return "neutral";
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border shrink-0 bg-surface/80">
        {(["form", "keyvalue", "raw"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onBodyModeChange(mode)}
            className={cn(
              "px-4 py-1.5 rounded-none text-[10px] font-black transition-all border cursor-pointer",
              bodyMode === mode
                ? "bg-bg border-border text-text shadow-sm"
                : "border-transparent text-text-subtle/50 hover:text-text-muted hover:bg-surface/50",
            )}
          >
            {mode === "form"
              ? "Schema"
              : mode === "keyvalue"
                ? "Fields"
                : "JSON"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 min-h-0">
        {bodyMode === "form" && (
          <div className="space-y-6">
            {parsedFields && parsedFields.length > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <Braces size={13} className="text-brand/60" />
                  <span className="text-[10px] font-black text-text-muted">
                    Interface Definitions
                  </span>
                  <Badge
                    variant="neutral"
                    size="xs"
                    className="tabular-nums font-mono opacity-50 px-1.5 h-4.5"
                  >
                    {parsedFields.length} SLOTS
                  </Badge>
                </div>

                <div className="space-y-5">
                  {parsedFields.map((field) => (
                    <Input
                      key={field.name}
                      label={field.name.toUpperCase()}
                      className="font-mono font-bold"
                      value={formBody[field.name] || ""}
                      onChange={(e) =>
                        onFormBodyChange({
                          ...formBody,
                          [field.name]: e.target.value,
                        })
                      }
                      labelRight={
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={typeVariant(field.type)}
                            size="xs"
                            className="font-black h-4 px-1.5"
                          >
                            {field.type.toUpperCase()}
                          </Badge>
                          {!field.required && (
                            <span className="text-[9px] font-black text-text-subtle/40">
                              OPT
                            </span>
                          )}
                          {field.required && (
                            <span className="text-[12px] text-red-500 font-black">
                              *
                            </span>
                          )}
                        </div>
                      }
                      placeholder={
                        field.type === "number"
                          ? "0"
                          : field.type === "boolean"
                            ? "BOOLEAN (TRUE/FALSE)"
                            : `MAPPING DATA...`
                      }
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 gap-4">
                <div className="w-12 h-12 rounded-none bg-surface border border-border border-dashed flex items-center justify-center">
                  <Braces size={18} className="text-text-muted" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-text-muted">
                    Void Schema
                  </p>
                  <p className="text-[10px] font-mono leading-relaxed max-w-[200px]">
                    Automatic discovery engine found no typed interface.
                    Transition to JSON mode for manual entry.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {bodyMode === "keyvalue" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <Layers size={13} className="text-text-muted/40" />
              <span className="text-[10px] font-black text-text-muted">
                Dynamic Key-Value Pairs
              </span>
            </div>
            <KeyValueEditor items={kvBody} onChange={onKvBodyChange} />
          </div>
        )}

        {bodyMode === "raw" && (
          <div className="flex flex-col h-full min-h-[300px]">
            <div className="flex items-center gap-2.5 mb-4">
              <Braces size={13} className="text-text-muted/40" />
              <span className="text-[10px] font-black text-text-muted">
                Raw JSON Fragment
              </span>
            </div>
            <div className="flex-1 rounded-none border border-border/60 overflow-hidden shadow-inner bg-black/5">
              <CodeEditor
                value={rawBody}
                onChange={onRawBodyChange}
                language="json"
                height="100%"
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
