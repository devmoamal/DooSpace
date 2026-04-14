import { Terminal } from "lucide-react";
import { cn } from "@/lib/cn";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";

interface ResponsePanelProps {
  response: {
    status: number;
    statusText: string;
    time: number;
    body: any;
    headers: Record<string, string>;
  } | null;
}

export function ResponsePanel({ response }: ResponsePanelProps) {
  return (
    <div className="w-1/2 flex flex-col bg-surface/10">
      <div className="px-4 border-b border-border pt-2 shrink-0 flex items-center justify-between">
        <span className="px-4 pb-2 text-[11px] font-medium uppercase tracking-wider text-text border-b-2 border-transparent">
          Response
        </span>
        {response && (
          <div className="flex items-center gap-3 text-[11px] pb-2">
            <span
              className={cn(
                "font-mono font-medium",
                response.status >= 200 && response.status < 300
                  ? "text-brand"
                  : "text-red-500",
              )}
            >
              {response.status} {response.statusText}
            </span>
            <span className="font-mono text-text-subtle">
              {response.time}ms
            </span>
            <span className="font-mono text-text-subtle">
              {new Blob([JSON.stringify(response.body)]).size} B
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {!response ? (
          <div className="h-full flex flex-col items-center justify-center text-text-subtle">
            <Terminal size={24} className="opacity-20 mb-3" />
            <span className="text-[12px] font-medium">Send Request</span>
          </div>
        ) : (
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 rounded border border-border bg-bg overflow-hidden relative">
              {typeof response.body === "object" ? (
                <ReactCodeMirror
                  value={JSON.stringify(response.body, null, 2)}
                  theme={vscodeDark}
                  extensions={[javascript()]}
                  readOnly
                  className="h-full custom-scrollbar-cm text-[12px]"
                />
              ) : (
                <pre className="p-4 text-[12px] font-mono text-text whitespace-pre-wrap">
                  {response.body}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
