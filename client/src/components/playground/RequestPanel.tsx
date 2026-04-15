import { cn } from "@/lib/cn";
import { type ParsedField } from "@/utils/typeParser";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { KeyValueEditor, type KeyValueItem } from "./KeyValueEditor";
import { type BodyMode, type PlaygroundTab } from "@/hooks/usePlayground";
import { Braces, Info } from "lucide-react";
import { type Endpoint } from "@doospace/shared";

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

const TYPE_COLOR: Record<string, string> = {
  string: "text-green-400",
  number: "text-amber-400",
  boolean: "text-blue-400",
  any: "text-text-subtle",
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border",
        TYPE_COLOR[type] ?? "text-purple-400",
      )}
    >
      {type}
    </span>
  );
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
    { id: "params", label: "Params" },
    { id: "body", label: "Body" },
    { id: "headers", label: "Headers" },
  ];

  return (
    <div className="w-1/2 border-r border-border flex flex-col min-h-0">
      {/* Tabs */}
      <div className="flex items-center border-b border-border shrink-0 bg-bg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider relative transition-colors",
              activeTab === tab.id
                ? "text-text"
                : "text-text-muted hover:text-text-subtle",
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-brand" />
            )}
          </button>
        ))}
        {/* Schema pill if endpoint has request_type */}
        {selectedEndpoint?.request_type && (
          <div className="ml-auto mr-3 flex items-center gap-1.5 text-[10px] px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Braces size={10} />
            <span className="font-mono">typed</span>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {/* PARAMS TAB */}
        {activeTab === "params" && (
          <div className="p-4 space-y-4">
            {pathParams.length > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                    Path Variables
                  </span>
                  <span className="text-[10px] font-mono text-text-subtle tabular-nums">
                    {pathParams.length}
                  </span>
                </div>
                <div className="border border-border rounded overflow-hidden">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-surface border-b border-border">
                      <tr>
                        <th className="px-3 py-2 font-medium text-text-muted w-1/3">
                          Variable
                        </th>
                        <th className="px-3 py-2 font-medium text-text-muted border-l border-border">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pathParams.map((p) => (
                        <tr key={p} className="group">
                          <td className="px-3 py-2 font-mono text-text-subtle">
                            <span className="text-amber-400">:</span>
                            {p}
                          </td>
                          <td className="p-0 border-l border-border">
                            <input
                              value={params[p] || ""}
                              onChange={(e) =>
                                onParamsChange({
                                  ...params,
                                  [p]: e.target.value,
                                })
                              }
                              className="w-full bg-transparent border-none outline-none px-3 py-2 font-mono text-text text-[12px] placeholder:text-text-subtle"
                              placeholder={`Enter ${p} value…`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center mb-3">
                  <Info size={14} className="text-text-muted" />
                </div>
                <p className="text-[12px] text-text-subtle">
                  No path parameters
                </p>
                <p className="text-[11px] text-text-muted mt-1">
                  Use <span className="font-mono text-amber-400">:param</span>{" "}
                  in the URL above
                </p>
              </div>
            )}
          </div>
        )}

        {/* HEADERS TAB */}
        {activeTab === "headers" && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                Request Headers
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
            {/* Default headers note */}
            <div className="flex items-start gap-2 text-[11px] text-text-muted bg-surface border border-border rounded px-3 py-2">
              <Info size={11} className="mt-0.5 shrink-0" />
              <span>
                <span className="font-mono text-text-subtle">
                  Content-Type: application/json
                </span>{" "}
                is sent automatically for POST/PUT/PATCH requests.
              </span>
            </div>
          </div>
        )}

        {/* BODY TAB */}
        {activeTab === "body" && (
          <div className="h-full flex flex-col min-h-0">
            {/* Body mode switcher */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-border shrink-0 bg-bg">
              {(["form", "keyvalue", "raw"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onBodyModeChange(mode)}
                  className={cn(
                    "px-3 py-1.5 rounded text-[11px] font-medium transition-colors border",
                    bodyMode === mode
                      ? "bg-surface border-border text-text"
                      : "border-transparent text-text-muted hover:text-text hover:bg-surface/50",
                  )}
                >
                  {mode === "form"
                    ? "Type Form"
                    : mode === "keyvalue"
                      ? "Key / Value"
                      : "Raw JSON"}
                </button>
              ))}
            </div>

            {/* Body content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 min-h-0">
              {bodyMode === "form" && (
                <div className="space-y-3">
                  {parsedFields && parsedFields.length > 0 ? (
                    <>
                      {/* Schema header */}
                      <div className="flex items-center gap-2 mb-3">
                        <Braces size={11} className="text-blue-400" />
                        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                          Request Schema
                        </span>
                        <span className="text-[10px] font-mono text-text-subtle">
                          {parsedFields.length} field
                          {parsedFields.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {parsedFields.map((field) => (
                        <div key={field.name} className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-mono font-semibold text-text">
                              {field.name}
                            </label>
                            <TypeBadge type={field.type} />
                            {!field.required && (
                              <span className="text-[10px] text-text-muted">
                                optional
                              </span>
                            )}
                            {field.required && (
                              <span className="text-[10px] text-red-400">
                                *
                              </span>
                            )}
                          </div>
                          <input
                            className="w-full bg-surface border border-border rounded px-3 py-2 text-[12px] text-text outline-none focus:border-brand-muted transition-colors font-mono placeholder:text-text-muted"
                            value={formBody[field.name] || ""}
                            onChange={(e) =>
                              onFormBodyChange({
                                ...formBody,
                                [field.name]: e.target.value,
                              })
                            }
                            placeholder={
                              field.type === "number"
                                ? "0"
                                : field.type === "boolean"
                                  ? "true / false"
                                  : `Enter ${field.type}…`
                            }
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center mb-3">
                        <Braces size={14} className="text-text-muted" />
                      </div>
                      <p className="text-[12px] text-text-subtle mb-1">
                        No parseable request type
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Use{" "}
                        <span className="font-mono text-text-subtle">
                          Key / Value
                        </span>{" "}
                        or{" "}
                        <span className="font-mono text-text-subtle">
                          Raw JSON
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {bodyMode === "keyvalue" && (
                <KeyValueEditor items={kvBody} onChange={onKvBodyChange} />
              )}

              {bodyMode === "raw" && (
                <div className="rounded border border-border overflow-hidden h-full min-h-[240px]">
                  <ReactCodeMirror
                    value={rawBody}
                    onChange={onRawBodyChange}
                    theme={vscodeDark}
                    extensions={[javascript()]}
                    height="100%"
                    className="h-full custom-scrollbar-cm"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
