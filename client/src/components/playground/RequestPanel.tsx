import { cn } from "@/lib/cn";
import { type ParsedField } from "@/utils/typeParser";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { KeyValueEditor, type KeyValueItem } from "./KeyValueEditor";
import { type BodyMode, type PlaygroundTab } from "@/hooks/usePlayground";

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
}: RequestPanelProps) {
  return (
    <div className="w-1/2 border-r border-border flex flex-col">
      {/* Tabs */}
      <div className="flex px-4 border-b border-border pt-2 shrink-0">
        {(["params", "headers", "body"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "px-4 pb-2 text-[11px] font-medium uppercase tracking-wider relative",
              activeTab === tab
                ? "text-text"
                : "text-text-subtle hover:text-text-muted",
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "params" && (
          <div className="space-y-4">
            {pathParams.length > 0 ? (
              <div className="border border-border rounded overflow-hidden">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      <th className="px-3 py-2 font-medium text-text-muted">
                        Path Variable
                      </th>
                      <th className="px-3 py-2 font-medium text-text-muted border-l border-border">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pathParams.map((p) => (
                      <tr key={p}>
                        <td className="px-3 py-2 font-mono text-text-subtle w-1/3">
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
                            className="w-full bg-transparent border-none outline-none px-3 py-2 font-mono"
                            placeholder="Value"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-text-subtle text-[12px]">
                No path parameters found (use :paramName in URL)
              </div>
            )}
          </div>
        )}

        {activeTab === "headers" && (
          <div className="space-y-4">
            <KeyValueEditor
              items={Object.entries(headers).map(([k, v]) => ({ k, v }))}
              onChange={(items) => {
                const newHeaders: Record<string, string> = {};
                items.forEach((i) => i.k && (newHeaders[i.k] = i.v));
                onHeadersChange(newHeaders);
              }}
            />
          </div>
        )}

        {activeTab === "body" && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              {(["form", "keyvalue", "raw"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onBodyModeChange(mode)}
                  className={cn(
                    "px-3 py-1 rounded text-[11px] font-medium capitalize border transition-colors",
                    bodyMode === mode
                      ? "bg-surface border-border text-text"
                      : "border-transparent text-text-subtle hover:text-text-muted",
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

            {bodyMode === "form" && (
              <div className="space-y-3">
                {parsedFields && parsedFields.length > 0 ? (
                  parsedFields.map((field) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-medium text-text-muted flex items-center gap-2">
                        <span className="font-mono">{field.name}</span>
                        <span className="text-[10px] text-text-subtle">
                          {field.type} {field.required ? "" : "(optional)"}
                        </span>
                      </label>
                      <input
                        className="bg-surface border border-border rounded px-3 py-1.5 text-[12px] text-text outline-none focus:border-brand-muted font-mono"
                        value={formBody[field.name] || ""}
                        onChange={(e) =>
                          onFormBodyChange({
                            ...formBody,
                            [field.name]: e.target.value,
                          })
                        }
                        placeholder={`Enter ${field.type}`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-text-subtle text-[12px]">
                    No parseable TS request_type found. Use Key / Value or Raw
                    body.
                  </div>
                )}
              </div>
            )}

            {bodyMode === "keyvalue" && (
              <KeyValueEditor items={kvBody} onChange={onKvBodyChange} />
            )}

            {bodyMode === "raw" && (
              <div className="flex-1 rounded border border-border overflow-hidden relative">
                <ReactCodeMirror
                  value={rawBody}
                  onChange={onRawBodyChange}
                  theme={vscodeDark}
                  extensions={[javascript()]}
                  height="100%"
                  className="h-full absolute inset-0 custom-scrollbar-cm"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
