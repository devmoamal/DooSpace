export interface ParsedField {
  name: string;
  type: string;
  required: boolean;
}

/**
 * Extracts the first top-level balanced object type { ... } from the string.
 * This handles cases where the stored type may include extra code after the closing brace.
 */
function extractFirstObjectType(str: string): string | null {
  const start = str.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}") {
      depth--;
      if (depth === 0) {
        return str.slice(start, i + 1).trim();
      }
    }
  }
  return null; // unbalanced
}

/**
 * Attempts to parse a simple TypeScript object string like:
 * { name: string; age?: number }
 * into an array of ParsedField objects.
 * Returns null if the string is too complex or unparseable.
 * 
 * Handles the case where the type string contains extra code after the closing brace
 * by extracting just the first object type block.
 */
export function parseTSFields(typeStr: string | undefined): ParsedField[] | null {
  if (!typeStr) return null;
  const str = typeStr.trim();

  // Extract just the first complete object type block from the string.
  // This handles cases where the stored type may include extra code after.
  const extracted = extractFirstObjectType(str);
  if (!extracted) return null;

  // Remove wrapping braces
  const inner = extracted.slice(1, -1).trim();
  if (!inner) return []; // Empty object

  const fields: ParsedField[] = [];

  // Check for nested structures
  const hasNested = inner.includes("{") || inner.includes("[");

  if (hasNested) {
    // Use depth-aware split for nested types
    const parts = splitTopLevel(inner);
    if (parts === null) return null;
    for (const part of parts) {
      const field = parseField(part);
      if (!field) return null;
      fields.push(field);
    }
  } else {
    // Simple split by semicolon or comma
    const parts = inner.split(/\s*[;,]\s*/).filter(Boolean);
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const field = parseField(trimmed);
      if (!field) return null;
      fields.push(field);
    }
  }

  return fields.length > 0 ? fields : null;
}

/**
 * Splits a string by top-level semicolons/commas only
 * (ignoring those inside nested braces/brackets).
 */
function splitTopLevel(str: string): string[] | null {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of str) {
    if (char === "{" || char === "[" || char === "(") depth++;
    else if (char === "}" || char === "]" || char === ")") {
      if (depth === 0) return null; // unbalanced
      depth--;
    }
    if ((char === ";" || char === ",") && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/**
 * Parses a single field string like "name: string" or "age?: number"
 */
function parseField(part: string): ParsedField | null {
  const trimmed = part.trim();
  if (!trimmed) return null;

  const colonIdx = trimmed.indexOf(":");
  if (colonIdx === -1) return null;

  let namePart = trimmed.slice(0, colonIdx).trim();
  const typePart = trimmed.slice(colonIdx + 1).trim();

  const isOptional = namePart.endsWith("?");
  if (isOptional) {
    namePart = namePart.slice(0, -1).trim();
  }

  if (!namePart || !typePart) return null;

  return {
    name: namePart,
    type: typePart,
    required: !isOptional,
  };
}

/**
 * Extracts param names from a given path like
 * "/users/:userId/posts/:postId" -> ["userId", "postId"]
 */
export function extractPathParams(path: string): string[] {
  const matches = path.match(/:([a-zA-Z0-9_]+)/g);
  if (!matches) return [];
  return matches.map((m) => m.substring(1));
}

/**
 * Builds the actual URL replacing specific param names with values.
 */
export function buildPathWithParams(path: string, params: Record<string, string>): string {
  return path.replace(/:([a-zA-Z0-9_]+)/g, (match, paramName) => {
    return params[paramName] ? encodeURIComponent(params[paramName]) : match;
  });
}

/**
 * Formats a type string cleanly for display in the UI.
 * Extracts just the first top-level object block and pretty-prints it.
 * If no object type is found, returns the raw string (trimmed).
 */
export function formatTypeForDisplay(typeStr: string | undefined): string {
  if (!typeStr) return "";
  const str = typeStr.trim();
  
  // Extract first object block
  const block = extractFirstObjectType(str);
  if (!block) {
    // Not an object type — return as-is (could be a primitive union, etc.)
    return str;
  }

  // Pretty-print: normalize whitespace while preserving structure
  const inner = block.slice(1, -1).trim();
  if (!inner) return "{}";

  // Split fields to format nicely
  const fields = inner.split(/[;,]/).map(s => s.trim()).filter(Boolean);
  if (fields.length === 0) return "{}";

  return "{\n" + fields.map(f => `  ${f};`).join("\n") + "\n}";
}

