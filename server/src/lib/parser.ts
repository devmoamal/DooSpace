import { type Endpoint } from "@doospace/shared";

/**
 * Extracts endpoints from Doo's TypeScript source code.
 * Matches context.method("/path", ...)
 */
export function extractEndpoints(code: string): Endpoint[] {
  const endpoints: Endpoint[] = [];
  const regex = /\.(get|post|put|delete|patch|all)\(\s*['"](.*?)['"]/gi;

  let match;
  while ((match = regex.exec(code)) !== null) {
    const [, method, path] = match;
    endpoints.push({
      method: method.toUpperCase() as any,
      path: path.startsWith("/") ? path : `/${path}`,
    });
  }

  // Deduplicate and return
  return Array.from(new Set(endpoints.map((e) => JSON.stringify(e)))).map((s) =>
    JSON.parse(s),
  );
}
