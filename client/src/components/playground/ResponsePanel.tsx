import { Terminal, Clock, HardDrive, Copy, Check, Braces } from "lucide-react";
import { cn } from "@/lib/cn";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";
import { type Endpoint } from "@doospace/shared";
import { formatTypeForDisplay } from "@/utils/typeParser";

type ResponseTab = "body" | "headers" | "schema";

interface ResponsePanelProps {
  response: {
    status: number;
    statusText: string;
    time: number;
    body: any;
    headers: Record<string, string>;
  } | null;
  selectedEndpoint: Endpoint | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded text-text-muted hover:text-text hover:bg-surface transition-colors"
      title="Copy"
    >
      {copied ? (
        <Check size={12} className="text-brand" />
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
}

export function ResponsePanel({ response, selectedEndpoint }: ResponsePanelProps) {
  const [activeTab, setActiveTab] = useState<ResponseTab>("body");

  const tabs: { id: ResponseTab; label: string; show?: boolean }[] = [
    { id: "body", label: "Body" },
    { id: "headers", label: "Headers" },
    {
      id: "schema",
      label: "Schema",
      show: !!(selectedEndpoint?.request_type || selectedEndpoint?.response_type),
    },
  ].filter((t) => t.show !== false);

  const responseBodyStr =
    response?.body != null
      ? typeof response.body === "object"
        ? JSON.stringify(response.body, null, 2)
        : String(response.body)
      : "";

  const isSuccess =
    response && response.status >= 200 && response.status < 300;
  const isError =
    response && (response.status >= 400 || response.status === 0);

  return (
    <div className="w-1/2 flex flex-col bg-bg min-h-0">
      {/* Panel header */}
      <div className="flex items-center border-b border-border shrink-0 bg-bg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

        {/* Status pills */}
        {response && (
          <div className="ml-auto flex items-center gap-3 pr-3">
            <span
              className={cn(
                "text-[11px] font-mono font-semibold px-2 py-0.5 rounded",
                isSuccess
                  ? "text-brand bg-brand/10"
                  : isError
                    ? "text-red-400 bg-red-500/10"
                    : "text-text-subtle bg-surface",
              )}
            >
              {response.status}
              {response.statusText ? ` ${response.statusText}` : ""}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-text-muted">
              <Clock size={10} />
              <span className="font-mono tabular-nums">{response.time}ms</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-text-muted">
              <HardDrive size={10} />
              <span className="font-mono tabular-nums">
                {new Blob([responseBodyStr]).size}B
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {!response ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
              <Terminal size={18} className="text-text-muted" />
            </div>
            <p className="text-[13px] font-medium text-text-subtle mb-1">
              No Response Yet
            </p>
            <p className="text-[11px] text-text-muted">
              Configure your request and press{" "}
              <span className="font-mono text-text-subtle">Send</span>
            </p>
          </div>
        ) : (
          <>
            {/* BODY TAB */}
            {activeTab === "body" && (
              <div className="flex-1 relative min-h-0">
                <div className="absolute top-2 right-2 z-10">
                  <CopyButton text={responseBodyStr} />
                </div>
                {typeof response.body === "object" ? (
                  <ReactCodeMirror
                    value={responseBodyStr}
                    theme={vscodeDark}
                    extensions={[javascript()]}
                    readOnly
                    height="100%"
                    className="h-full custom-scrollbar-cm text-[12px]"
                  />
                ) : (
                  <pre className="p-4 text-[12px] font-mono text-text whitespace-pre-wrap overflow-auto h-full">
                    {response.body}
                  </pre>
                )}
              </div>
            )}

            {/* HEADERS TAB */}
            {activeTab === "headers" && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 min-h-0">
                {Object.keys(response.headers).length > 0 ? (
                  <div className="border border-border rounded overflow-hidden">
                    <table className="w-full text-left text-[12px]">
                      <thead className="bg-surface border-b border-border">
                        <tr>
                          <th className="px-3 py-2 font-medium text-text-muted w-2/5">
                            Header
                          </th>
                          <th className="px-3 py-2 font-medium text-text-muted border-l border-border">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {Object.entries(response.headers).map(([k, v]) => (
                          <tr key={k} className="group">
                            <td className="px-3 py-2 font-mono text-text-subtle truncate">
                              {k}
                            </td>
                            <td className="px-3 py-2 font-mono text-text truncate border-l border-border">
                              {v}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[12px] text-text-muted text-center py-10">
                    No response headers
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* SCHEMA TAB — always accessible when endpoint has types */}
        {activeTab === "schema" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 min-h-0">
            {selectedEndpoint?.request_type && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Braces size={12} className="text-blue-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                    Request Type
                  </span>
                </div>
                <pre className="text-[12px] font-mono text-text-subtle bg-surface border border-border rounded px-4 py-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {formatTypeForDisplay(selectedEndpoint.request_type)}
                </pre>
              </div>
            )}
            {selectedEndpoint?.response_type && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Braces size={12} className="text-brand" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-brand">
                    Response Type
                  </span>
                </div>
                <pre className="text-[12px] font-mono text-text-subtle bg-surface border border-border rounded px-4 py-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {formatTypeForDisplay(selectedEndpoint.response_type)}
                </pre>
              </div>
            )}
            {!selectedEndpoint?.request_type &&
              !selectedEndpoint?.response_type && (
                <div className="text-center py-10 text-[12px] text-text-muted">
                  No schema defined for this endpoint
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
