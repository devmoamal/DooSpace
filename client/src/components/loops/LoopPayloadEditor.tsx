import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface LoopPayloadEditorProps {
  payload: string;
  setPayload: (val: string) => void;
  requestType?: string;
}

function parseFields(typeStr?: string) {
  if (!typeStr) return [];
  const fields: { key: string; type: string }[] = [];
  const cleanStr = typeStr.replace(/^{/, '').replace(/}$/, '').trim();
  const regex = /([\w_]+)(?:\s*\?)?\s*:\s*([^;,\n]+)/g;
  let match;
  while ((match = regex.exec(cleanStr)) !== null) {
      fields.push({ key: match[1].trim(), type: match[2].trim() });
  }
  return fields;
}

export function LoopPayloadEditor({ payload, setPayload, requestType }: LoopPayloadEditorProps) {
  const fields = parseFields(requestType);
  const [view, setView] = useState<"form" | "json">(fields.length > 0 ? "form" : "json");
  
  // Try to parse current payload into an object for form mode
  let parsedPayload: Record<string, any> = {};
  try {
    parsedPayload = JSON.parse(payload);
  } catch {}

  const handleFieldChange = (key: string, value: string) => {
    const newPayload = { ...parsedPayload, [key]: value };
    setPayload(JSON.stringify(newPayload, null, 2));
  };

  useEffect(() => {
    if (fields.length > 0 && view === "json" && payload === "{}") {
      setView("form");
    }
  }, [fields.length]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[12px] font-medium text-text-muted flex items-center gap-1.5">
          <Play size={12} />
          Input Data
        </label>
        
        {fields.length > 0 && (
          <div className="flex bg-surface border border-border rounded-none p-0.5">
            <button
              onClick={() => setView("form")}
              className={cn(
                "px-2 py-0.5 rounded-none text-[10px] font-medium transition-all cursor-pointer",
                view === "form" ? "bg-bg text-text shadow-sm" : "text-text-subtle hover:text-text-muted"
              )}
            >
              Form
            </button>
            <button
              onClick={() => setView("json")}
              className={cn(
                "px-2 py-0.5 rounded-none text-[10px] font-medium transition-all cursor-pointer",
                view === "json" ? "bg-bg text-text shadow-sm" : "text-text-subtle hover:text-text-muted"
              )}
            >
              JSON
            </button>
          </div>
        )}
      </div>

      {view === "form" && fields.length > 0 ? (
        <div className="space-y-3 border border-border rounded-none p-3 bg-surface/50">
          {fields.map((f) => (
            <Input
              key={f.key}
              label={`${f.key} (${f.type})`}
              value={parsedPayload[f.key] || ""}
              onChange={(e) => handleFieldChange(f.key, e.target.value)}
              placeholder={`Enter ${f.key}...`}
              className="h-8 text-[12px] font-mono"
            />
          ))}
          <p className="text-[10px] text-text-subtle pt-1 mt-2 border-t border-border/50">
            You can use variables like <code className="text-brand">{"{random_string_10}"}</code> here.
          </p>
        </div>
      ) : (
        <>
          <Textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            spellCheck={false}
            className="h-24 text-[12px] font-mono leading-relaxed"
            placeholder='{&#10;  "data": "{random_string_10}"&#10;}'
          />
          <div className="flex flex-wrap gap-1.5 mt-1 px-0.5">
            {["{random_string_10}", "{random_number_12}", "{random_emoji}", "{random_timestamp}", "{random_bool}"].map((token) => (
              <button 
                key={token}
                onClick={() => setPayload(prev => prev === "{}" || prev.trim() === "" ? `{\n  "key": "${token}"\n}` : prev.replace("}", `  "new_key": "${token}"\n}`))}
                className="text-[10px] bg-surface-lighter border border-border hover:border-brand/30 px-1.5 py-0.5 rounded-none font-mono text-text-subtle hover:text-brand transition-colors cursor-pointer"
              >
                {token}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
