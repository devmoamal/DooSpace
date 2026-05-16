import React from "react";
import { cn } from "@/lib/cn";
import { type ParsedField } from "@/utils/typeParser";
import { type BodyMode, type PlaygroundTab } from "@/hooks/usePlayground";
import { Braces } from "lucide-react";
import { type Endpoint } from "@doospace/shared";
import { Badge } from "@/components/ui/Badge";
import { type KeyValueItem } from "./KeyValueEditor";
import { RequestParamsTab } from "./tabs/RequestParamsTab";
import { RequestHeadersTab } from "./tabs/RequestHeadersTab";
import { RequestBodyTab } from "./tabs/RequestBodyTab";

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
            <Badge
              variant="brand"
              size="xs"
              className="gap-1.5 py-1 px-2.5 font-bold animate-pulse"
            >
              <Braces size={10} />
              STRONG-TYPE
            </Badge>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {activeTab === "params" && (
          <RequestParamsTab
            pathParams={pathParams}
            params={params}
            onParamsChange={onParamsChange}
          />
        )}

        {activeTab === "headers" && (
          <RequestHeadersTab
            headers={headers}
            onHeadersChange={onHeadersChange}
          />
        )}

        {activeTab === "body" && (
          <RequestBodyTab
            bodyMode={bodyMode}
            onBodyModeChange={onBodyModeChange}
            parsedFields={parsedFields}
            formBody={formBody}
            onFormBodyChange={onFormBodyChange}
            kvBody={kvBody}
            onKvBodyChange={onKvBodyChange}
            rawBody={rawBody}
            onRawBodyChange={onRawBodyChange}
          />
        )}
      </div>
    </div>
  );
}
