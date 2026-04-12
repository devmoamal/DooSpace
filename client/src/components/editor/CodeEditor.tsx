import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { cn } from "@/lib/cn";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  className,
  height = "600px",
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border/80 shadow-2xl shadow-black/5 bg-surface-lighter transition-all",
        className,
      )}
    >
      <CodeMirror
        value={value}
        height={height}
        theme={vscodeDark}
        extensions={[javascript({ typescript: true })]}
        onChange={onChange}
        className="text-sm selection:bg-brand/20"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
        }}
        style={{
          fontSize: '13px',
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
        }}
      />
    </div>
  );
};
