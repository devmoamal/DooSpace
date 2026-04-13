import React, { useRef } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { DOO_TYPES } from "@/utils/dooDriver";
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
    });

    // Disable the built-in diagnostics — Monaco's in-browser TS worker
    // cannot resolve standard lib types (Promise, Date, Response, etc.)
    // which causes false-positive red squiggles everywhere.
    // Our driver still provides full autocomplete + hover documentation.
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: true,
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

    monaco.languages.registerCompletionItemProvider("typescript", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
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
        ];

        return { suggestions };
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
          },
        }}
      />
    </div>
  );
};
