import { cn } from "@/lib/cn";
import { type ParsedField } from "@/utils/typeParser";
import { CodeEditor } from "../editor/CodeEditor";
import { KeyValueEditor, type KeyValueItem } from "./KeyValueEditor";
import { type BodyMode, type PlaygroundTab } from "@/hooks/usePlayground";
import { Braces, Info, Layers, Globe } from "lucide-react";
import { type Endpoint } from "@doospace/shared";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface RequestPanelProps {
  activeTab: PlaygroundTab;
  onTabChange: (tab: PlaygroundTab) => void;
  pathParams: string[];
  params: Record<string, string>;
  onParamsChange: (p: Record<string, string>) => void;
  headers: Record<string, string>;
  onHeadersChange: (h: Record<string, string>) => void;
  bodyMode: BodyMode;
  onBodyModeChange: (m: BodyMode) => void;
  parsedFields: ParsedField[] | null;
  formBody: Record<string, string>;
  onFormBodyChange: (fb: Record<string, string>) => void;
  kvBody: KeyValueItem[];
  onKvBodyChange: (kv: KeyValueItem[]) => void;
  rawBody: string;
  onRawBodyChange: (rb: string) => void;
  selectedEndpoint: Endpoint | null;
}

export function RequestPanel({
  activeTab,
  onTabChange,
  pathParams,
  params,
  onParamsChange,
  headers,
  onHeadersChange,
  bodyMode,
  onBodyModeChange,
  parsedFields,
  formBody,
  onFormBodyChange,
  kvBody,
  onKvBodyChange,
  rawBody,
  onRawBodyChange,
  selectedEndpoint,
}: RequestPanelProps) {
  const tabs: { id: PlaygroundTab; label: string }[] = [
    { id: "params", label: "Parameters" },
    { id: "body", label: "Payload" },
    { id: "headers", label: "Headers" },
  ];

  const typeVariant = (type: string): any => {
    if (type === "string") return "success";
    if (type === "number") return "warning";
    if (type === "boolean") return "info";
    return "neutral";
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 bg-surface">
      {/* High-Fidelity Tabs */}
      <div className="flex items-center border-b border-border shrink-0 bg-surface/80 backdrop-blur-sm z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-5 py-3 text-[10px] font-black relative transition-all cursor-pointer",
              activeTab === tab.id
                ? "text-text"
                : "text-text-subtle hover:text-text-muted hover:bg-surface/50",
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand animate-in slide-in-from-bottom-1" />
            )}
          </button>
        ))}
        {/* Schema pill if endpoint has request_type */}
        {selectedEndpoint?.request_type && (
          <div className="ml-auto mr-5">
             <Badge variant="brand" size="xs" className="gap-1.5 py-1 px-2.5 font-bold animate-pulse">
                <Braces size={10} />
                STRONG-TYPE
             </Badge>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {/* PARAMS TAB */}
        {activeTab === "params" && (
          <div className="p-6 space-y-6">
            {pathParams.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Globe size={13} className="text-text-muted/40" />
                  <span className="text-[10px] font-black text-text-muted">
                    Path Segment Bindings
                  </span>
                  <Badge variant="neutral" size="xs" className="tabular-nums font-mono opacity-50 px-1.5 h-4.5">
                    {pathParams.length}
                  </Badge>
                </div>
                <div className="border border-border/60 rounded-none overflow-hidden bg-bg/50">
                  <table className="w-full text-left border-collapse table-fixed">
                    <thead className="bg-surface border-b border-border">
                      <tr>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-text-muted w-1/3">
                          Identifier
                        </th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-text-muted border-l border-border/50">
                          Mapping Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {pathParams.map((p) => (
                        <tr key={p} className="group hover:bg-surface/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-[11px] text-text-subtle whitespace-nowrap">
                            <span className="text-brand/60 font-black mr-1">:</span>
                            {p}
                          </td>
                          <td className="p-0 border-l border-border/50">
                            <input
                              value={params[p] || ""}
                              onChange={(e) =>
                                onParamsChange({
                                  ...params,
                                  [p]: e.target.value,
                                })
                              }
                              className="w-full bg-transparent border-none outline-none px-4 py-3 font-mono text-text text-[12px] placeholder:text-text-subtle/30 focus:bg-bg transition-colors font-bold"
                              placeholder={`Bind ${p}...`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 gap-4">
                <div className="w-12 h-12 rounded-none bg-surface border border-border border-dashed flex items-center justify-center">
                  <Globe size={18} className="text-text-muted" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-text-muted">
                    Static Route
                  </p>
                  <p className="text-[10px] font-mono leading-relaxed max-w-[160px]">
                    No dynamic path bindings identified for this execution trace.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HEADERS TAB */}
        {activeTab === "headers" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2.5">
              <Layers size={13} className="text-text-muted/40" />
              <span className="text-[10px] font-black text-text-muted">
                Standard Protocol Headers
              </span>
            </div>
            <KeyValueEditor
              items={Object.entries(headers).map(([k, v]) => ({ k, v }))}
              onChange={(items) => {
                const newHeaders: Record<string, string> = {};
                items.forEach((i) => i.k && (newHeaders[i.k] = i.v));
                onHeadersChange(newHeaders);
              }}
            />
            {/* Infrastructure Note */}
            <div className="flex items-start gap-4 text-[10px] text-text-muted bg-surface/50 border border-border/40 border-dashed rounded-none px-5 py-4 leading-relaxed">
              <Info size={14} className="mt-0.5 shrink-0 text-brand/60" />
              <span className="font-medium">
                <span className="font-bold text-text-subtle">Content-Type: application/json</span> is injected automatically into all write-mode operations (POST, PUT, PATCH).
              </span>
            </div>
          </div>
        )}

        {/* PAYLOAD TAB */}
        {activeTab === "body" && (
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

            {/* Body content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 min-h-0">
              {bodyMode === "form" && (
                <div className="space-y-6">
                  {parsedFields && parsedFields.length > 0 ? (
                    <>
                      {/* Schema header */}
                      <div className="flex items-center gap-3 mb-6">
                        <Braces size={13} className="text-brand/60" />
                        <span className="text-[10px] font-black text-text-muted">
                          Interface Definitions
                        </span>
                        <Badge variant="neutral" size="xs" className="tabular-nums font-mono opacity-50 px-1.5 h-4.5">
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
                                <Badge variant={typeVariant(field.type)} size="xs" className="font-black h-4 px-1.5">{field.type.toUpperCase()}</Badge>
                                {!field.required && (
                                  <span className="text-[9px] font-black text-text-subtle/40">OPT</span>
                                )}
                                {field.required && (
                                  <span className="text-[12px] text-red-500 font-black">*</span>
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
                          Automatic discovery engine found no typed interface. Transition to JSON mode for manual entry.
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
        )}
      </div>
    </div>
  );
}
