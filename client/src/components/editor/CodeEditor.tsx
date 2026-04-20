import React, { useRef, useEffect } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { DOO_TYPES } from "@/utils/dooDriver";
import { cn } from "@/lib/cn";
import { useThemeStore } from "@/stores/theme.store";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  height?: string;
  onFormat?: (code: string) => Promise<string>;
  language?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  className,
  height = "600px",
  onFormat,
  language = "typescript",
  readOnly = false,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(theme === "dark" ? "doo-dark" : "doo-light");
    }
  }, [theme]);

  const handleEditorWillMount = (monaco: any) => {
    // ── Dark theme ────────────────────────────────────────────────────────────
    monaco.editor.defineTheme("doo-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment",   foreground: "4e4e4e", fontStyle: "italic" },
        { token: "keyword",   foreground: "3ecf8e" },
        { token: "string",    foreground: "e9c46a" },
        { token: "number",    foreground: "b388ff" },
        { token: "type",      foreground: "80cbc4" },
        { token: "delimiter", foreground: "4e4e4e" },
        // JSON specific
        { token: "string.key.json",   foreground: "ededed" }, // white for keys
        { token: "string.value.json", foreground: "3ecf8e" }, // primary color for strings
        { token: "number.json",       foreground: "b388ff" }, // purple for numbers
        { token: "keyword.json",      foreground: "e9c46a" }, // yellow for booleans
        { token: "constant.language.json", foreground: "e9c46a" },
      ],
      colors: {
        "editor.background":                   "#0f0f0f",
        "editorCursor.foreground":             "#3ecf8e",
        "editor.lineHighlightBackground":      "#161616",
        "editorLineNumber.foreground":         "#242424",
        "editorLineNumber.activeForeground":   "#4e4e4e",
        "editorIndentGuide.background":        "#1a1a1a",
        "editorIndentGuide.activeBackground":  "#242424",
        "editor.selectionBackground":          "#3ecf8e18",
        "editor.wordHighlightBackground":      "#3ecf8e10",
        "editorBracketMatch.background":       "#3ecf8e12",
        "editorBracketMatch.border":           "#3ecf8e30",
        "editorWidget.background":             "#161616",
        "editorWidget.border":                 "#242424",
        "editorSuggestWidget.background":      "#161616",
        "editorSuggestWidget.border":          "#242424",
        "editorSuggestWidget.selectedBackground": "#1f1f1f",
        "editorSuggestWidget.highlightForeground": "#3ecf8e",
        "editorHoverWidget.background":        "#161616",
        "editorHoverWidget.border":            "#242424",
        "scrollbarSlider.background":          "#ffffff08",
        "scrollbarSlider.hoverBackground":     "#ffffff12",
        "scrollbarSlider.activeBackground":    "#ffffff18",
      },
    });

    // ── Light theme ───────────────────────────────────────────────────────────
    monaco.editor.defineTheme("doo-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment",   foreground: "adadad", fontStyle: "italic" },
        { token: "keyword",   foreground: "2ea86f" },
        { token: "string",    foreground: "c17d10" },
        { token: "number",    foreground: "7c4dff" },
        { token: "type",      foreground: "00897b" },
        { token: "delimiter", foreground: "adadad" },
        // JSON specific
        { token: "string.key.json",   foreground: "111111" },
        { token: "string.value.json", foreground: "2ea86f" }, // primary color for strings
        { token: "number.json",       foreground: "7c4dff" },
        { token: "keyword.json",      foreground: "c17d10" }, // orange for booleans
        { token: "constant.language.json", foreground: "c17d10" },
      ],
      colors: {
        "editor.background":                   "#ffffff",
        "editorCursor.foreground":             "#2ea86f",
        "editor.lineHighlightBackground":      "#f7f7f7",
        "editorLineNumber.foreground":         "#d4d4d4",
        "editorLineNumber.activeForeground":   "#adadad",
        "editorIndentGuide.background":        "#f0f0f0",
        "editorIndentGuide.activeBackground":  "#ebebeb",
        "editor.selectionBackground":          "#3ecf8e18",
        "editor.wordHighlightBackground":      "#3ecf8e10",
        "editorBracketMatch.background":       "#3ecf8e12",
        "editorBracketMatch.border":           "#3ecf8e40",
        "editorWidget.background":             "#ffffff",
        "editorWidget.border":                 "#ebebeb",
        "editorSuggestWidget.background":      "#ffffff",
        "editorSuggestWidget.border":          "#ebebeb",
        "editorSuggestWidget.selectedBackground": "#f7f7f7",
        "editorSuggestWidget.highlightForeground": "#2ea86f",
        "editorHoverWidget.background":        "#ffffff",
        "editorHoverWidget.border":            "#ebebeb",
        "scrollbarSlider.background":          "#00000008",
        "scrollbarSlider.hoverBackground":     "#00000012",
        "scrollbarSlider.activeBackground":    "#00000018",
      },
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // ── TypeScript config ─────────────────────────────────────────────────────
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      allowJs: true,
      lib: ["esnext", "dom"],
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });

    monaco.languages.typescript.typescriptDefaults.setInlayHintsOptions({
      includeInlayParameterNameHints: "all",
      includeInlayParameterNameHintsWhenArgumentMatchesName: true,
      includeInlayFunctionParameterTypeHints: true,
      includeInlayVariableTypeHints: true,
      includeInlayPropertyDeclarationTypeHints: true,
      includeInlayFunctionLikeReturnTypeHints: true,
      includeInlayEnumMemberValueHints: true,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      DOO_TYPES,
      "ts:filename/doospace.d.ts",
    );

    // ── Helpers ───────────────────────────────────────────────────────────────
    const COLORS = ["white", "brown", "yellow", "red", "green", "blue", "purple", "brand"];
    const S = monaco.languages.CompletionItemKind.Snippet;
    const M = monaco.languages.CompletionItemKind.Module;
    const R = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;

    // ── Completions ───────────────────────────────────────────────────────────
    monaco.languages.registerCompletionItemProvider("typescript", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const lineText = model.getValueInRange({
          startLineNumber: position.lineNumber, startColumn: 1,
          endLineNumber: position.lineNumber,   endColumn: position.column,
        });
        const range = {
          startLineNumber: position.lineNumber, endLineNumber: position.lineNumber,
          startColumn: word.startColumn,        endColumn: word.endColumn,
        };

        const suggestions: any[] = [];

        // Color hints inside .pixel()
        if (lineText.match(/\.pixel\([^,]+,[^,]+,\s*["']?$/)) {
          suggestions.push(...COLORS.map((c) => ({
            label: c, kind: monaco.languages.CompletionItemKind.Color, insertText: c, range,
          })));
          return { suggestions };
        }

        suggestions.push(
          // ── Boilerplate ────────────────────────────────────────────────
          {
            label: "boilerplate",
            kind: S, insertTextRules: R, range,
            documentation: "Minimal Doo boilerplate",
            insertText: [
              'import { type Doo } from "doospace";',
              "",
              "export default function(doo: Doo) {",
              '  doo.get("/", async (req) => {',
              '    return { message: "Hello from DooSpace" };',
              "  });",
              "}",
            ].join("\n"),
          },
          {
            label: "boilerplate:full",
            kind: S, insertTextRules: R, range,
            documentation: "Boilerplate with doobox, secrets and callDoo",
            insertText: [
              'import { type Doo, doobox, secrets, callDoo } from "doospace";',
              "",
              "export default function(doo: Doo) {",
              '  doo.get("/", async (req) => {',
              '    const token   = secrets.${1:MY_API_KEY};',
              '    const visits  = (await doobox.get<number>("visits") ?? 0) + 1;',
              '    await doobox.set("visits", visits);',
              "    return { visits, hasToken: !!token };",
              "  });",
              "}",
            ].join("\n"),
          },

          // ── Route handlers ─────────────────────────────────────────────
          {
            label: "get",
            kind: S, insertTextRules: R, range,
            documentation: 'doo.get("/path", handler)',
            insertText: 'doo.get("${1:/path}", async (req) => {\n  $0\n  return { ok: true };\n});',
          },
          {
            label: "post",
            kind: S, insertTextRules: R, range,
            documentation: 'doo.post("/path", handler)',
            insertText: 'doo.post("${1:/path}", async (req) => {\n  const body = req.body;\n  $0\n  return { ok: true };\n});',
          },
          {
            label: "put",
            kind: S, insertTextRules: R, range,
            documentation: 'doo.put("/path/:id", handler)',
            insertText: 'doo.put("${1:/path/:id}", async (req) => {\n  const { id } = req.params;\n  const body = req.body;\n  $0\n  return { ok: true };\n});',
          },
          {
            label: "delete",
            kind: S, insertTextRules: R, range,
            documentation: 'doo.delete("/path/:id", handler)',
            insertText: 'doo.delete("${1:/path/:id}", async (req) => {\n  const { id } = req.params;\n  $0\n  return { ok: true };\n});',
          },

          // ── doobox ─────────────────────────────────────────────────────
          {
            label: "doobox.get",
            kind: S, insertTextRules: R, range,
            documentation: "Get a value from DooBox storage",
            insertText: 'const ${1:value} = await doobox.get<${2:any}>("${3:key}");',
          },
          {
            label: "doobox.set",
            kind: S, insertTextRules: R, range,
            documentation: "Set a value in DooBox",
            insertText: 'await doobox.set("${1:key}", ${2:value});',
          },
          {
            label: "doobox.set:ttl",
            kind: S, insertTextRules: R, range,
            documentation: "Set with TTL expiry (seconds)",
            insertText: 'await doobox.set("${1:key}", ${2:value}, ${3:3600});',
          },
          {
            label: "doobox.delete",
            kind: S, insertTextRules: R, range,
            documentation: "Delete a DooBox key",
            insertText: 'await doobox.delete("${1:key}");',
          },
          {
            label: "doobox.list",
            kind: S, insertTextRules: R, range,
            documentation: "List all DooBox keys",
            insertText: "const keys = await doobox.list();",
          },

          // ── secrets ────────────────────────────────────────────────────
          {
            label: "secrets.get",
            kind: S, insertTextRules: R, range,
            documentation: "Read a secret (SCREAMING_SNAKE_CASE)",
            insertText: "const ${1:value} = secrets.${2:MY_SECRET};",
          },

          // ── callDoo ────────────────────────────────────────────────────
          {
            label: "callDoo.get",
            kind: S, insertTextRules: R, range,
            documentation: "Call another Doo GET endpoint",
            insertText: 'const ${1:data} = await callDoo.get(${2:dooId}, "${3:/path}");',
          },
          {
            label: "callDoo.post",
            kind: S, insertTextRules: R, range,
            documentation: "Call another Doo POST endpoint",
            insertText: 'const ${1:data} = await callDoo.post(${2:dooId}, "${3:/path}", { $4 });',
          },
          {
            label: "callDoo.put",
            kind: S, insertTextRules: R, range,
            documentation: "Call another Doo PUT endpoint",
            insertText: 'const ${1:data} = await callDoo.put(${2:dooId}, "${3:/path}", { $4 });',
          },
          {
            label: "callDoo.delete",
            kind: S, insertTextRules: R, range,
            documentation: "Call another Doo DELETE endpoint",
            insertText: 'const ${1:data} = await callDoo.delete(${2:dooId}, "${3:/path}");',
          },
          {
            label: "callDoo.patch",
            kind: S, insertTextRules: R, range,
            documentation: "Call another Doo PATCH endpoint",
            insertText: 'const ${1:data} = await callDoo.patch(${2:dooId}, "${3:/path}", { $4 });',
          },

          // ── Imports ────────────────────────────────────────────────────
          {
            label: "import:all",
            kind: M, insertTextRules: R, range,
            documentation: "Import everything from doospace",
            insertText: 'import { type Doo, doobox, secrets, callDoo } from "doospace";',
          },
          {
            label: "import:doobox",
            kind: M, insertTextRules: R, range,
            documentation: "Import doobox",
            insertText: 'import { doobox } from "doospace";',
          },
          {
            label: "import:secrets",
            kind: M, insertTextRules: R, range,
            documentation: "Import secrets",
            insertText: 'import { secrets } from "doospace";',
          },
          {
            label: "import:callDoo",
            kind: M, insertTextRules: R, range,
            documentation: "Import callDoo",
            insertText: 'import { callDoo } from "doospace";',
          },

          // ── Misc ───────────────────────────────────────────────────────
          {
            label: "json",
            kind: S, insertTextRules: R, range,
            documentation: "Return a JSON response",
            insertText: "return doo.json($1, ${2:200});",
          },
          {
            label: "log",
            kind: S, insertTextRules: R, range,
            documentation: "Log to execution console",
            insertText: 'doo.log($1);',
          },
          {
            label: "fetch:json",
            kind: S, insertTextRules: R, range,
            documentation: "fetch + parse JSON",
            insertText: 'const ${1:res}  = await fetch("${2:https://api.example.com}");\nconst ${3:data} = await ${1:res}.json();',
          },
          {
            label: "pixel",
            kind: S, insertTextRules: R, range,
            documentation: "Draw a pixel on 24×24 canvas",
            insertText: 'doo.pixel(${1:x}, ${2:y}, "${3:brand}");',
          },
        );

        return { suggestions };
      },
    });

    // ── Hover docs ────────────────────────────────────────────────────────────
    monaco.languages.registerHoverProvider("typescript", {
      provideHover: (model: any, position: any) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;
        const line = model.getLineContent(position.lineNumber);
        const w = word.word;
        const range = new monaco.Range(
          position.lineNumber, word.startColumn,
          position.lineNumber, word.endColumn,
        );

        if (w === "callDoo") return {
          range,
          contents: [
            { value: "**callDoo** — Doo-to-Doo client" },
            { value: "Call other Doos directly — no HTTP hop.\n\n```ts\nconst users = await callDoo.get(13, \"/users\");\nconst user  = await callDoo.post(13, \"/users\", { name: \"moamal\" });\nawait callDoo.put(13, \"/users/1\", { name: \"updated\" });\nawait callDoo.delete(13, \"/users/1\");\n```" },
          ],
        };

        if (w === "doobox") return {
          range,
          contents: [
            { value: "**doobox** — Key-value storage" },
            { value: "Persistent private storage. Survives between executions.\n\n```ts\nawait doobox.set(\"key\", value);\nconst val = await doobox.get<MyType>(\"key\");\n```" },
          ],
        };

        if (w === "secrets") return {
          range,
          contents: [
            { value: "**secrets** — User secrets" },
            { value: "Set in the **Secrets** page. Access by SCREAMING_SNAKE_CASE name.\n\n```ts\nconst token = secrets.MY_API_TOKEN; // string | undefined\n```" },
          ],
        };

        if (w === "pixel" && line.includes("pixel")) return {
          range: new monaco.Range(
            position.lineNumber, line.indexOf("pixel") + 1,
            position.lineNumber, line.indexOf("pixel") + 6,
          ),
          contents: [
            { value: "**pixel(x, y, color)** — Draw on the 24×24 canvas" },
            { value: `- **x**: 0–23\n- **y**: 0–23\n- **color**: ${COLORS.join(", ")}` },
          ],
        };

        return null;
      },
    });

    // ── Document symbols (outline) ────────────────────────────────────────────
    monaco.languages.registerDocumentSymbolProvider("typescript", {
      provideDocumentSymbols: (model: any) => {
        const symbols: any[] = [];
        const lines = model.getLinesContent();
        for (let i = 0; i < lines.length; i++) {
          const match = lines[i].match(/doo\.(get|post|put|delete|patch|all)\(\s*["']([^"']+)["']/);
          if (match) {
            symbols.push({
              name: `[${match[1].toUpperCase()}] ${match[2]}`,
              detail: "Route",
              kind: monaco.languages.SymbolKind.Method,
              range: new monaco.Range(i + 1, 1, i + 1, lines[i].length + 1),
              selectionRange: new monaco.Range(i + 1, 1, i + 1, lines[i].length + 1),
            });
          }
        }
        return symbols;
      },
    });

    // ── Formatter ─────────────────────────────────────────────────────────────
    monaco.languages.registerDocumentFormattingEditProvider("typescript", {
      provideDocumentFormattingEdits: async (model: any) => {
        if (!onFormat) return [];
        const formatted = await onFormat(model.getValue());
        return [{ range: model.getFullModelRange(), text: formatted }];
      },
    });
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      <Editor
        theme={theme === "dark" ? "doo-dark" : "doo-light"}
        beforeMount={handleEditorWillMount}
        height={height}
        defaultLanguage={language}
        path={language === "typescript" ? "doospace-script.ts" : undefined}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
          fontLigatures: true,
          cursorSmoothCaretAnimation: "on",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          lineNumbers: "on",
          renderLineHighlight: "all",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 5,
            horizontalScrollbarSize: 5,
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
          parameterHints: { enabled: true, cycle: true },
          inlayHints: { enabled: "on" },
          quickSuggestions: { other: true, comments: false, strings: true },
          wordBasedSuggestions: "allDocuments",
          suggestSelection: "first",
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

