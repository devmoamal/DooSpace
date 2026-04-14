export interface ParsedField {
  name: string;
  type: string;
  required: boolean;
}

/**
 * Attempts to parse a simple TypeScript object string like:
 * { name: string; age?: number }
 * into an array of ParsedField objects.
 * Returns null if the string is too complex or unparseable.
 */
export function parseTSFields(typeStr: string | undefined): ParsedField[] | null {
  if (!typeStr) return null;
  const str = typeStr.trim();
  
  // Must be an object type, not an array or union
  if (!str.startsWith("{") || !str.endsWith("}")) return null;
  
  // Remove wrapping braces
  const inner = str.slice(1, -1).trim();
  if (!inner) return []; // Empty object
  
  const fields: ParsedField[] = [];
  
  // Split by comma or semicolon, handling nested objects naively by ignoring them if too complex.
  // We'll use a simple regex for top-level fields for now. 
  // If there are nested { } or [ ], let's just abort and fallback to key-value.
  if (inner.includes("{") || inner.includes("[")) return null;

  const parts = inner.split(/[;,]/).filter(Boolean);
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) return null; // Invalid syntax
    
    let namePart = trimmed.slice(0, colonIdx).trim();
    const typePart = trimmed.slice(colonIdx + 1).trim();
    
    const isOptional = namePart.endsWith("?");
    if (isOptional) {
      namePart = namePart.slice(0, -1).trim();
    }
    
    if (!namePart || !typePart) return null;
    
    fields.push({
      name: namePart,
      type: typePart,
      required: !isOptional,
    });
  }

  return fields;
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
