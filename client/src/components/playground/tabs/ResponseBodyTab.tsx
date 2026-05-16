import React, { useState } from "react";
import { Terminal, Check, Copy } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { CodeEditor } from "../../editor/CodeEditor";

interface ResponseBodyTabProps {
  response: {
    body: any;
  };
  statusVariant: "success" | "danger" | "warning" | "default";
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

export const ResponseBodyTab: React.FC<ResponseBodyTabProps> = ({
  response,
  statusVariant,
}) => {
  const responseBodyStr =
    response.body != null
      ? typeof response.body === "object"
        ? JSON.stringify(response.body, null, 2)
        : String(response.body)
      : "";

  return (
    <div className="flex-1 flex flex-col relative min-h-0">
      <div className="px-5 py-3 flex items-center justify-between bg-surface/50 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-brand/60" />
          <span className="text-[10px] font-black text-text-muted">
            Response Stream
          </span>
        </div>
        <CopyButton text={responseBodyStr} />
      </div>

      <div className="flex-1 relative h-full overflow-hidden">
        {statusVariant === "danger" && response.body?.error ? (
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
  );
};
