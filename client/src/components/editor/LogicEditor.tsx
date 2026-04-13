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
        className="flex-1 rounded border border-border overflow-hidden"
        height="100%"
      />
    </div>
  );
}
