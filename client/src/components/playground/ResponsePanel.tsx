import { Terminal, Clock, HardDrive, Copy, Check, Braces, Activity } from "lucide-react";
import { cn } from "@/lib/cn";
import { CodeEditor } from "../editor/CodeEditor";
import { useState } from "react";
import { type Endpoint } from "@doospace/shared";
import { formatTypeForDisplay } from "@/utils/typeParser";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";

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
    <IconButton 
      onClick={handleCopy} 
      variant="subtle" 
      size="sm"
      title="Copy Response"
      className="bg-bg/80 backdrop-blur-sm border border-border/40"
    >
      {copied ? <Check size={13} className="text-brand" /> : <Copy size={13} />}
    </IconButton>
  );
}

export function ResponsePanel({
  response,
  selectedEndpoint,
}: ResponsePanelProps) {
  const [activeTab, setActiveTab] = useState<ResponseTab>("body");

  const tabs: { id: ResponseTab; label: string; show?: boolean }[] = [
    { id: "body" as ResponseTab, label: "Output" },
    { id: "headers" as ResponseTab, label: "Response Headers" },
    {
      id: "schema" as ResponseTab,
      label: "Discovery Schema",
      show: !!(selectedEndpoint?.request_type || selectedEndpoint?.response_type),
    },
  ].filter((t) => t.show !== false);

  const responseBodyStr =
    response?.body != null
      ? typeof response.body === "object"
        ? JSON.stringify(response.body, null, 2)
        : String(response.body)
      : "";

  const isSuccess = response && response.status >= 200 && response.status < 300;
  const isError = response && (response.status >= 400 || response.status === 0);

  const statusVariant = (): any => {
    if (!response) return "default";
    if (isSuccess) return "success";
    if (isError) return "danger";
    return "warning";
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface min-h-0">
      {/* High-Fidelity Tabs */}
      <div className="flex items-center border-b border-border shrink-0 bg-surface/80 backdrop-blur-sm z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

        {/* Technical Status Indicators */}
        {response && (
          <div className="ml-auto flex items-center gap-4 pr-5">
            <Badge variant={statusVariant()} size="md" className="font-mono gap-2 px-3 h-6 border-none shadow-sm">
              <span className="font-black tabular-nums">{response.status}</span>
              {response.statusText && (
                <span className="opacity-60 text-[9px] font-black">
                  {response.statusText}
                </span>
              )}
            </Badge>
            
            <div className="flex items-center gap-3 border-l border-border/50 pl-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-text-subtle/40 leading-none mb-0.5">Latency</span>
                <div className="flex items-center gap-1 text-[11px] text-text-subtle font-mono tabular-nums leading-none">
                  <Clock size={10} className="text-brand/40" />
                  {response.time}ms
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-text-subtle/40 leading-none mb-0.5">Payload</span>
                <div className="flex items-center gap-1 text-[11px] text-text-subtle font-mono tabular-nums leading-none">
                  <HardDrive size={10} className="text-blue-400/40" />
                  {new Blob([responseBodyStr]).size}B
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {!response ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-30 gap-5">
            <div className="w-16 h-16 rounded-none bg-surface border border-border border-dashed flex items-center justify-center animate-pulse">
              <Activity size={24} className="text-text-muted" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[12px] font-black tracking-[0.3em] text-text-muted">
                Awaiting Execution
              </p>
              <p className="text-[10px] font-mono leading-relaxed max-w-[170px]">
                Initiate a request to start the capture process...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* BODY TAB */}
            {activeTab === "body" && (
              <div className="flex-1 flex flex-col relative min-h-0">
                <div className="px-5 py-3 flex items-center justify-between bg-surface/50 border-b border-border/40">
                   <div className="flex items-center gap-2">
                      <Terminal size={12} className="text-brand/60" />
                      <span className="text-[10px] font-black text-text-muted">Response Stream</span>
                   </div>
                   <CopyButton text={responseBodyStr} />
                </div>
                
                <div className="flex-1 relative">
                  {statusVariant() === "danger" && response.body?.error ? (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black shadow-xl backdrop-blur-md">
                        <Terminal size={12} />
                        Fault Logic Trapped
                    </div>
                  ) : null}
                  {typeof response.body === "object" ? (
                    <CodeEditor
                      value={responseBodyStr}
                      onChange={() => {}}
                      language="json"
                      readOnly
                      height="100%"
                      className="h-full"
                    />
                  ) : (
                    <pre className="p-6 text-[12px] font-mono font-bold text-text whitespace-pre-wrap overflow-auto h-full custom-scrollbar leading-relaxed bg-black/5">
                      {response.body}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* HEADERS TAB */}
            {activeTab === "headers" && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 min-h-0 space-y-6">
                <div className="flex items-center gap-2.5">
                  <Terminal size={13} className="text-text-muted/40" />
                  <span className="text-[10px] font-black text-text-muted">
                    Raw Protocol Handshake
                  </span>
                </div>
                {Object.keys(response.headers).length > 0 ? (
                  <div className="border border-border/60 rounded-none overflow-hidden bg-bg/50">
                    <table className="w-full text-left border-collapse table-fixed">
                      <thead className="bg-surface border-b border-border">
                        <tr>
                          <th className="px-4 py-2.5 text-[10px] font-bold text-text-muted w-2/5">
                            Key Identifier
                          </th>
                          <th className="px-4 py-2.5 text-[10px] font-bold text-text-muted border-l border-border/50">
                            Protocol Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {Object.entries(response.headers).map(([k, v]) => (
                          <tr key={k} className="group hover:bg-surface/30 transition-colors">
                            <td className="px-4 py-3 font-mono text-[11px] text-text-subtle whitespace-nowrap truncate select-all">
                              {k}
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-text truncate border-l border-border/50 select-all font-bold">
                              {v}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center opacity-30 gap-4">
                    <Terminal size={20} className="text-text-muted" />
                    <p className="text-[11px] font-black text-text-muted">No header data</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* SCHEMA TAB */}
        {activeTab === "schema" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 min-h-0">
            {selectedEndpoint?.request_type && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Braces size={13} className="text-blue-400/60" />
                  <span className="text-[10px] font-black text-blue-400/60">
                    Ingress Specification
                  </span>
                </div>
                <pre className="text-[11px] font-mono text-text-subtle bg-bg/80 border border-border/60 rounded-none px-5 py-4 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {formatTypeForDisplay(selectedEndpoint.request_type)}
                </pre>
              </div>
            )}
            {selectedEndpoint?.response_type && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Braces size={13} className="text-brand/60" />
                  <span className="text-[10px] font-black text-brand/60">
                    Egress Specification
                  </span>
                </div>
                <pre className="text-[11px] font-mono text-text-subtle bg-bg/80 border border-border/60 rounded-none px-5 py-4 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {formatTypeForDisplay(selectedEndpoint.response_type)}
                </pre>
              </div>
            )}
            {!selectedEndpoint?.request_type &&
              !selectedEndpoint?.response_type && (
                <div className="py-20 flex flex-col items-center justify-center opacity-30 gap-4">
                   <Braces size={20} className="text-text-muted" />
                   <div className="text-[11px] font-black text-text-muted text-center leading-relaxed">
                     Untyped Interface<br />Awaiting Protocol definition
                   </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
