import React from "react";
import { Layers, Info } from "lucide-react";
import { KeyValueEditor } from "../KeyValueEditor";

interface RequestHeadersTabProps {
  headers: Record<string, string>;
  onHeadersChange: (h: Record<string, string>) => void;
}

export const RequestHeadersTab: React.FC<RequestHeadersTabProps> = ({
  headers,
  onHeadersChange,
}) => {
  return (
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
          <span className="font-bold text-text-subtle">
            Content-Type: application/json
          </span>{" "}
          is injected automatically into all write-mode operations (POST, PUT,
          PATCH).
        </span>
      </div>
    </div>
  );
};
