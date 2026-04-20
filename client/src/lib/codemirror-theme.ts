import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// CSS-variable based custom theme
export const appThemeExtension = EditorView.theme(
  {
    "&": {
      color: "var(--color-text) !important",
      backgroundColor: "transparent !important",
    },
    ".cm-content": {
      caretColor: "var(--color-brand)",
      fontFamily: '"JetBrains Mono", monospace',
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--color-brand)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: "var(--color-brand-muted) !important",
      },
    ".cm-panels": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
    },
    ".cm-panels.cm-panels-top": {
      borderBottom: "1px solid var(--color-border)",
    },
    ".cm-panels.cm-panels-bottom": {
      borderTop: "1px solid var(--color-border)",
    },
    ".cm-searchMatch": {
      backgroundColor: "var(--color-brand-muted)",
      outline: "1px solid var(--color-brand)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "var(--color-brand-muted)",
    },
    ".cm-activeLine": {
      backgroundColor: "var(--color-brand-muted)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "var(--color-brand-muted)",
    },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: "var(--color-surface)",
      outline: "1px solid var(--color-border-hover)",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "var(--color-text-subtle)",
      borderRight: "1px solid transparent",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
      color: "var(--color-brand)",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 12px 0 8px",
    },
  },
  { dark: true }, // conceptually adapted to both via css vars
);

export const appHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "var(--color-syntax-keyword)" },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: "var(--color-text)" },
  { tag: [t.propertyName], color: "var(--color-text)" },
  { tag: [t.function(t.variableName), t.labelName], color: "var(--color-syntax-type)" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "var(--color-syntax-number)" },
  { tag: [t.definition(t.name), t.separator], color: "var(--color-text-subtle)" },
  {
    tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: "var(--color-syntax-number)",
  },
  {
    tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
    color: "var(--color-text-subtle)",
  },
  { tag: [t.meta, t.comment], color: "var(--color-syntax-comment)", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "var(--color-brand)", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "var(--color-text)" },
  { tag: [t.string], color: "var(--color-syntax-string)" },
  { tag: [t.bool, t.null], color: "var(--color-syntax-keyword)" },
]);

export const doospaceTheme = [
  appThemeExtension,
  syntaxHighlighting(appHighlightStyle),
];
