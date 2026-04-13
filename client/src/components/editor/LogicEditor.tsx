import { CodeEditor } from "@/components/editor/CodeEditor";

interface LogicEditorProps {
  id: number;
  code: string;
  onChange: (value: string) => void;
  onFormat?: (code: string) => Promise<string>;
}

export function LogicEditor({ code, onChange, onFormat }: LogicEditorProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <CodeEditor 
        value={code} 
        onChange={onChange} 
        onFormat={onFormat}
        className="flex-1 rounded-lg border border-border/60 shadow-2xl shadow-black/5 overflow-hidden"
        height="100%"
      />
    </div>
  );
}
