import { type Method } from "@doospace/shared";
import { DooBox } from "./doobox";
import { DooSecrets } from "./secrets";

// Trace event colors
export type TraceColor = "log" | "error" | "db" | "fetch" | "call" | "brand" | "purple";

export interface DooRequest<T = any> {
  url: string;
  method: string;
  headers: Headers;
  params: Record<string, string>;
  query: Record<string, string>;
  body: T;
}

type Handler<TResponse = any, TRequest = any> = (
  req: DooRequest<TRequest>,
) => Promise<TResponse | Response> | TResponse | Response;

interface Route {
  method: string | "ALL";
  regex: RegExp;
  keys: string[];
  handler: Handler;
}

export class Doo {
  private routes: Route[] = [];
  public logs: string[] = [];
  public trace: string[] = [];   // flat list of event colors
  public doobox: DooBox;
  public secrets: DooSecrets;

  constructor(dooId: number, secretsMap: Record<string, string> = {}) {
    this.doobox = new DooBox(dooId, (color) => this.trace.push(color));
    this.secrets = new DooSecrets(secretsMap);
  }

  /** Add a trace event pixel (used internally and by callDoo client) */
  _trace(color: string) {
    this.trace.push(color);
  }

  get<TResponse = any>(path: string, handler: Handler<TResponse, any>) {
    this.register("GET", path, handler);
  }

  post<TResponse = any, TRequest = any>(
    path: string,
    handler: Handler<TResponse, TRequest>,
  ) {
    this.register("POST", path, handler);
  }

  put<TResponse = any, TRequest = any>(
    path: string,
    handler: Handler<TResponse, TRequest>,
  ) {
    this.register("PUT", path, handler);
  }

  delete<TResponse = any>(path: string, handler: Handler<TResponse, any>) {
    this.register("DELETE", path, handler);
  }

  all<TResponse = any>(path: string, handler: Handler<TResponse, any>) {
    this.register("ALL", path, handler);
  }

  private register(method: string, path: string, handler: Handler) {
    const keys: string[] = [];
    const pattern = path
      .replace(/:([^/]+)/g, (_, key) => {
        keys.push(key);
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    this.routes.push({
      method,
      regex: new RegExp(`^${pattern}$`),
      keys,
      handler,
    });
  }

  // ── Response Helpers ────────────────────────────────────
  json(data: any, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  text(data: string, status: number = 200): Response {
    return new Response(data, {
      status,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // ── Logging ─────────────────────────────────────────────
  log(message: any) {
    const timestamp = new Date().toISOString();
    const formattedMessage =
      typeof message === "object"
        ? JSON.stringify(message, null, 2)
        : String(message);
    this.logs.push(`[${timestamp}] ${formattedMessage}`);
    this.trace.push("log");   // yellow
  }

  error(message: any) {
    const timestamp = new Date().toISOString();
    const formattedMessage =
      typeof message === "object"
        ? JSON.stringify(message, null, 2)
        : String(message);
    this.logs.push(`[${timestamp}] ERROR: ${formattedMessage}`);
    this.trace.push("error"); // red
  }

  async run(method: string, path: string, request: Request): Promise<Response> {
    for (const route of this.routes) {
      if (route.method !== "ALL" && route.method !== method) continue;

      const match = path.match(route.regex);
      if (match) {
        const params: Record<string, string> = {};
        route.keys.forEach((key, i) => {
          params[key] = match[i + 1];
        });

        const url = new URL(request.url);
        const query: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
          query[key] = value;
        });

        let body: any = null;
        if (request.headers.get("content-type")?.includes("application/json")) {
          try {
            body = await request.clone().json();
          } catch {
            body = null;
          }
        }
        
        // Ergonomic fallback: for GET/DELETE without a body, map the query parameters into the body 
        // so script authors can universally access payloads via req.body (defined by their type T).
        if (!body && ["GET", "DELETE"].includes(request.method)) {
          body = { ...query };
          // Attempt to parse numbers/booleans for convenience since queries are strings
          for (const key in body) {
            const val = body[key];
            if (!Number.isNaN(Number(val)) && val !== "") body[key] = Number(val);
            else if (val === "true") body[key] = true;
            else if (val === "false") body[key] = false;
          }
        }

        const dooReq: DooRequest = {
          params,
          query,
          body,
          url: request.url,
          method: request.method,
          headers: request.headers,
        };

        try {
          const result = await route.handler(dooReq);
          if (result instanceof Response) return result;
          return this.json(result);
        } catch (e: any) {
          this.error(e.message);
          return new Response(e.message, { status: 500 });
        }
      }
    }

    return new Response(`Not Found: ${method} ${path}`, { status: 404 });
  }

  getResults() {
    return {
      logs: this.logs,
      pixels: this.trace,   // flat string[] of event colors, empty = no pixels
    };
  }
}
