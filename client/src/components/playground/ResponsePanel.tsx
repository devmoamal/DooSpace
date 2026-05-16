import {
  Terminal,
  Clock,
  HardDrive,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { type Endpoint } from "@doospace/shared";
import { Badge } from "@/components/ui/Badge";
import { ResponseBodyTab } from "./tabs/ResponseBodyTab";
import { ResponseHeadersTab } from "./tabs/ResponseHeadersTab";
import { ResponseSchemaTab } from "./tabs/ResponseSchemaTab";

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
      show: !!(
        selectedEndpoint?.request_type || selectedEndpoint?.response_type
      ),
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
            <Badge
              variant={statusVariant()}
              size="md"
              className="font-mono gap-2 px-3 h-6 border-none shadow-sm"
            >
              <span className="font-black tabular-nums">{response.status}</span>
              {response.statusText && (
                <span className="opacity-60 text-[9px] font-black">
                  {response.statusText}
                </span>
              )}
            </Badge>

            <div className="flex items-center gap-3 border-l border-border/50 pl-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-text-subtle/40 leading-none mb-0.5">
                  Latency
                </span>
                <div className="flex items-center gap-1 text-[11px] text-text-subtle font-mono tabular-nums leading-none">
                  <Clock size={10} className="text-brand/40" />
                  {response.time}ms
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-text-subtle/40 leading-none mb-0.5">
                  Payload
                </span>
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
              <ResponseBodyTab
                response={response}
                statusVariant={statusVariant()}
              />
            )}

            {/* HEADERS TAB */}
            {activeTab === "headers" && (
              <ResponseHeadersTab headers={response.headers} />
            )}

            {/* SCHEMA TAB */}
            {activeTab === "schema" && (
              <ResponseSchemaTab selectedEndpoint={selectedEndpoint} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
