import { type Method } from "@doospace/shared";
import { Canvas } from "./canvas";
import { DooBox } from "./doobox";

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
  public canvas: Canvas;
  public doobox: DooBox;

  constructor(dooId: number) {
    this.canvas = new Canvas();
    this.doobox = new DooBox(dooId);
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
    // Simple regex parser for :params
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

  // Canvas Helpers
  pixel(x: number, y: number, color: string) {
    this.canvas.set(x, y, color);
  }

  fill(color: string) {
    this.canvas.fill(color);
  }

  rect(x: number, y: number, w: number, h: number, color: string) {
    this.canvas.rect(x, y, w, h, color);
  }

  // Response Helpers
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

  log(message: any) {
    const timestamp = new Date().toISOString();
    const formattedMessage =
      typeof message === "object"
        ? JSON.stringify(message, null, 2)
        : String(message);
    this.logs.push(`[${timestamp}] ${formattedMessage}`);
  }

  error(message: any) {
    const timestamp = new Date().toISOString();
    const formattedMessage =
      typeof message === "object"
        ? JSON.stringify(message, null, 2)
        : String(message);
    this.logs.push(`[${timestamp}] ERROR: ${formattedMessage}`);
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

        // Parse query params
        const url = new URL(request.url);
        const query: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
          query[key] = value;
        });

        // Parse body if it's JSON
        let body: any = null;
        if (request.headers.get("content-type")?.includes("application/json")) {
          try {
            body = await request.clone().json();
          } catch {
            body = null;
          }
        }

        // Create a safe, mutable request context instead of mutating the frozen standard Request object
        const dooReq: DooRequest = {
          params,
          query,
          body,
          url: request.url,
          method: request.method,
          headers: request.headers,
          // Add any other needed raw request properties here
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
      pixels: this.canvas.getPixels(),
    };
  }
}
