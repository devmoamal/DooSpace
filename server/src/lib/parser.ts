import { type Endpoint } from "@doospace/shared";

/**
 * Scans code for type and interface declarations and returns a map of name -> definition.
 */
function extractTypes(code: string): Map<string, string> {
  const types = new Map<string, string>();

  // Use a more robust approach: find 'type Name =' or 'interface Name' and then 
  // extract until the end of the block/statement.
  
  // 1. Capture types: type Name = ...;
  const typeRegex = /type\s+(\w+)(?:\s*<.*?>)?\s*=\s*/g;
  let match;
  while ((match = typeRegex.exec(code)) !== null) {
    const name = match[1];
    let start = match.index + match[0].length;
    let braceCount = 0;
    let i = start;
    let definition = "";
    
    // skip whitespace
    while (i < code.length && /\s/.test(code[i])) {
      i++;
    }
    
    const isObject = code[i] === "{";
    
    // Scan until we find the end
    while (i < code.length) {
      if (code[i] === "{") braceCount++;
      if (code[i] === "}") {
        braceCount--;
        if (isObject && braceCount === 0) {
           definition += "}";
           break;
        }
      }
      
      if (!isObject && braceCount === 0) {
         if (code[i] === ";") break;
         if (code[i] === "\n") {
            const rest = code.slice(i+1).trimStart();
            if (/^(type|interface|export|function|const|let|var|class|doo\.)\b/.test(rest)) {
               break;
            }
         }
      }
      
      definition += code[i];
      i++;
    }
    types.set(name, definition.trim());
  }

  // 2. Capture interfaces: interface Name { ... }
  const interfaceRegex = /interface\s+(\w+)(?:\s*<.*?>)?\s*{/g;
  while ((match = interfaceRegex.exec(code)) !== null) {
    const name = match[1];
    let start = match.index + match[0].length - 1; // start at {
    let braceCount = 0;
    let i = start;
    let definition = "";
    
    while (i < code.length) {
      if (code[i] === "{") braceCount++;
      if (code[i] === "}") {
        braceCount--;
        if (braceCount === 0) {
          definition += "}";
          break;
        }
      }
      definition += code[i];
      i++;
    }
    types.set(name, definition.trim());
  }

  return types;
}

/**
 * Recursively resolves types.
 */
function resolveType(
  typeStr: string,
  typesMap: Map<string, string>,
  depth = 0,
): string {
  if (depth > 5) return typeStr; // Prevent infinite recursion

  let resolved = typeStr.trim();

  // Handle Arrays: Name[]
  if (resolved.endsWith("[]")) {
    const baseType = resolved.slice(0, -2);
    const resolvedBase = resolveType(baseType, typesMap, depth + 1);
    return `${resolvedBase}[]`;
  }

  // Handle Generics: Name<Arg>
  const genericMatch = resolved.match(/^(\w+)\s*<([\s\S]*)>$/);
  if (genericMatch) {
    const [, name, arg] = genericMatch;
    const definition = typesMap.get(name);
    if (definition) {
      // Very simple parameter substitution (assumes single parameter T)
      const resolvedArg = resolveType(arg, typesMap, depth + 1);
      return definition.replace(/\bT\b/g, resolvedArg);
    }
  }

  // Handle Simple Types
  const definition = typesMap.get(resolved);
  if (definition) {
    return resolveType(definition, typesMap, depth + 1);
  }

  return resolved;
}

export function extractEndpoints(code: string): Endpoint[] {
  const endpoints: Endpoint[] = [];
  const typesMap = extractTypes(code);

  const regex =
    /\.(get|post|put|delete|patch|all)(?:\s*<([^>]*?(?:<[^>]*?>[^>]*?)*)>)?\s*\(\s*['"](.*?)['"](?:(?:(?!\.(?:get|post|put|delete|patch|all)).)*?DooRequest(?:\s*<([^>]*?(?:<[^>]*?>[^>]*?)*)>))?/gi;

  let match;
  while ((match = regex.exec(code)) !== null) {
    const [, method, response_type, path, request_type] = match;

    endpoints.push({
      method: method.toUpperCase() as any,
      path: path.startsWith("/") ? path : `/${path}`,
      response_type: response_type
        ? resolveType(response_type, typesMap)
        : undefined,
      request_type: request_type
        ? resolveType(request_type, typesMap)
        : undefined,
    });
  }

  // Deduplication
  const seen = new Set<string>();
  return endpoints.filter((e) => {
    const key = `${e.method}:${e.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
