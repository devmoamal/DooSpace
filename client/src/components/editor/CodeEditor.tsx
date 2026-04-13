import React, { useRef } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { DOO_TYPES } from "@/utils/dooDriver";
import { cn } from "@/lib/cn";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  height?: string;
  onFormat?: (code: string) => Promise<string>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  className,
  height = "600px",
  onFormat,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure TypeScript defaults
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      allowJs: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      lib: ["esnext", "dom"],
    });

    // Enable diagnostics
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });

    // Configure inlay hints
    monaco.languages.typescript.typescriptDefaults.setInlayHintsOptions({
      includeInlayParameterNameHints: "all",
      includeInlayParameterNameHintsWhenArgumentMatchesName: true,
      includeInlayFunctionParameterTypeHints: true,
      includeInlayVariableTypeHints: true,
      includeInlayPropertyDeclarationTypeHints: true,
      includeInlayFunctionLikeReturnTypeHints: true,
      includeInlayEnumMemberValueHints: true,
    });

    // Inject Doo Space Type Definitions (The Driver)
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      DOO_TYPES,
      "ts:filename/doospace.d.ts",
    );

    // Set custom theme
    monaco.editor.defineTheme("doo-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "3ecf8e" },
        { token: "string", foreground: "f1fa8c" },
        { token: "number", foreground: "bd93f9" },
        { token: "type", foreground: "8be9fd" },
        { token: "delimiter", foreground: "6272a4" },
      ],
      colors: {
        "editor.background": "#0e0e0e",
        "editorCursor.foreground": "#3ecf8e",
        "editor.lineHighlightBackground": "#161616",
        "editorLineNumber.foreground": "#2a2a2a",
        "editorLineNumber.activeForeground": "#3ecf8e80",
        "editorIndentGuide.background": "#1a1a1a",
        "editorIndentGuide.activeBackground": "#3ecf8e20",
        "editor.selectionBackground": "#3ecf8e20",
        "editor.wordHighlightBackground": "#3ecf8e10",
        "editorBracketMatch.background": "#3ecf8e15",
        "editorBracketMatch.border": "#3ecf8e40",
        "editorWidget.background": "#141414",
        "editorWidget.border": "#2a2a2a",
        "editorSuggestWidget.background": "#141414",
        "editorSuggestWidget.border": "#2a2a2a",
        "editorSuggestWidget.selectedBackground": "#3ecf8e15",
        "editorSuggestWidget.highlightForeground": "#3ecf8e",
        "editorHoverWidget.background": "#141414",
        "editorHoverWidget.border": "#2a2a2a",
      },
    });

    const COLOR_SUGGESTIONS = [
      "white",
      "brown",
      "yellow",
      "red",
      "green",
      "blue",
      "purple",
      "brand",
    ];

    monaco.languages.registerCompletionItemProvider("typescript", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: any[] = [];

        // Add color suggestions if in doo.pixel
        if (textUntilPosition.match(/doo\.pixel\([^,]+,[^,]+,\s*["']?$/)) {
          suggestions.push(
            ...COLOR_SUGGESTIONS.map((color) => ({
              label: color,
              kind: monaco.languages.CompletionItemKind.Color,
              insertText: color,
              range,
            })),
          );
        }

        suggestions.push(
          {
            label: "doo.boilerplate",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Generate a full Doo boilerplate",
            insertText:
              'import { type Doo } from "doospace";\n\nexport default function(doo: Doo) {\n  doo.get("/", async (req) => {\n    return { message: "Hello from DooSpace" };\n  });\n}',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.webhook",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Generate a robust Webhook handler",
            insertText:
              'doo.post("/webhook", async (req) => {\n  const { event, data } = req.body;\n  doo.log(`Received event: \\${event}`);\n  \n  await doo.db.set(`event_\\${Date.now()}`, data);\n  \n  return doo.json({ received: true }, 200);\n});',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.db.list",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "List and return all stored items",
            insertText:
              'doo.get("/db", async () => {\n  const keys = await doo.db.list();\n  const items = await Promise.all(\n    keys.map(async (k) => ({ key: k, value: await doo.db.get(k) }))\n  );\n  return items;\n});',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.get",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Generate a GET endpoint handler",
            insertText:
              'doo.get("${1:/path}", async (req) => {\n  ${0}\n  return { ok: true };\n});',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.post",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Generate a POST endpoint with typed body",
            insertText:
              'doo.post("${1:/path}", async (req) => {\n  const body = req.body;\n  ${0}\n  return { ok: true };\n});',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.pixel",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Draw a pixel on the 24x24 canvas",
            insertText: 'doo.pixel(${1:0}, ${2:0}, "${3:brand}");',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.canvas.fill",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Fill the entire canvas",
            insertText: 'doo.fill("${1:brand}");',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.canvas.rect",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Draw a rectangle",
            insertText:
              'doo.rect(${1:x}, ${2:y}, ${3:width}, ${4:height}, "${5:brand}");',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.db.get",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Load a value from storage",
            insertText: 'const ${1:data} = await doo.db.get("${2:key}");',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.db.set",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Persist a value to storage",
            insertText: 'await doo.db.set("${1:key}", ${2:value});',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: "doo.log",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Log to orchestration console",
            insertText: 'doo.log("${1:message}");',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
        );

        return { suggestions };
      },
    });

    monaco.languages.registerHoverProvider("typescript", {
      provideHover: (model: any, position: any) => {
        const word = model.getWordAtPosition(position);
        if (!word) return;

        if (word.word === "pixel" || word.word === "doo") {
          const line = model.getLineContent(position.lineNumber);
          if (line.includes("doo.pixel")) {
            return {
              range: new monaco.Range(
                position.lineNumber,
                line.indexOf("pixel"),
                position.lineNumber,
                line.indexOf("pixel") + 5,
              ),
              contents: [
                { value: "**doo.pixel(x, y, color)**" },
                {
                  value:
                    "Draws a pixel on the 24x24 canvas.\n\n- **x**: 0-23 (horizontal)\n- **y**: 0-23 (vertical)\n- **color**: One of: " +
                    COLOR_SUGGESTIONS.join(", "),
                },
              ],
            };
          }
        }
        return null;
      },
    });

    monaco.languages.registerDocumentSymbolProvider("typescript", {
      provideDocumentSymbols: (model: any) => {
        const symbols: any[] = [];
        const lines = model.getLinesContent();

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const match = line.match(
            /doo\.(get|post|put|delete|all)\(\s*["']([^"']+)["']/,
          );
          if (match) {
            symbols.push({
              name: `[${match[1].toUpperCase()}] ${match[2]}`,
              detail: "Route Definition",
              kind: monaco.languages.SymbolKind.Method,
              range: new monaco.Range(i + 1, 1, i + 1, line.length + 1),
              selectionRange: new monaco.Range(i + 1, 1, i + 1, line.length + 1),
            });
          }
        }
        return symbols;
      },
    });

    monaco.languages.registerDocumentFormattingEditProvider("typescript", {
      provideDocumentFormattingEdits: async (model: any) => {
        if (!onFormat) return [];
        const formatted = await onFormat(model.getValue());
        return [
          {
            range: model.getFullModelRange(),
            text: formatted,
          },
        ];
      },
    });

    monaco.editor.setTheme("doo-theme");
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border/80 shadow-2xl shadow-black/5 bg-[#0e0e0e] transition-all",
        className,
      )}
    >
      <Editor
        height={height}
        defaultLanguage="typescript"
        path="doospace-script.ts"
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
          fontLigatures: true,
          cursorSmoothCaretAnimation: "on",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          padding: { top: 16, bottom: 16 },
          lineNumbers: "on",
          renderLineHighlight: "all",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
          fixedOverflowWidgets: true,
          tabSize: 2,
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showVariables: true,
            snippetsPreventQuickSuggestions: false,
          },
          parameterHints: {
            enabled: true,
            cycle: true,
          },
          inlayHints: {
            enabled: "on",
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
          wordBasedSuggestions: "allDocuments",
          suggestSelection: "first",
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};
