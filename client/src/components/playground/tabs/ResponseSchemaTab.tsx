import React from "react";
import { Braces } from "lucide-react";
import { type Endpoint } from "@doospace/shared";
import { formatTypeForDisplay } from "@/utils/typeParser";

interface ResponseSchemaTabProps {
  selectedEndpoint: Endpoint | null;
}

export const ResponseSchemaTab: React.FC<ResponseSchemaTabProps> = ({
  selectedEndpoint,
}) => {
  return (
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
      {!selectedEndpoint?.request_type && !selectedEndpoint?.response_type && (
        <div className="py-20 flex flex-col items-center justify-center opacity-30 gap-4">
          <Braces size={20} className="text-text-muted" />
          <div className="text-[11px] font-black text-text-muted text-center leading-relaxed">
            Untyped Interface
            <br />
            Awaiting Protocol definition
          </div>
        </div>
      )}
    </div>
  );
};
