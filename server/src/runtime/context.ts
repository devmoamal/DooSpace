import { type Method } from "@doospace/shared";
import { Canvas } from "./canvas";
import { Storage } from "./storage";

type Handler = (req: DooRequest) => Promise<Response>;

export interface DooRequest extends Request {
  params: Record<string, string>;
}

interface Route {
  method: string | "ALL";
  regex: RegExp;
  keys: string[];
  handler: Handler;
}

export class Context {
  private routes: Route[] = [];
  public logs: string[] = [];
  public canvas: Canvas;
  public db: Storage;

  constructor(dooId: number) {
    this.canvas = new Canvas();
    this.db = new Storage(dooId);
  }

  get(path: string, handler: Handler) {
    this.register("GET", path, handler);
  }

  post(path: string, handler: Handler) {
    this.register("POST", path, handler);
  }

  put(path: string, handler: Handler) {
    this.register("PUT", path, handler);
  }

  delete(path: string, handler: Handler) {
    this.register("DELETE", path, handler);
  }

  all(path: string, handler: Handler) {
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

  log(message: string) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
  }

  error(message: string) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ERROR: ${message}`);
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

        const dooReq = request as DooRequest;
        dooReq.params = params;

        try {
          return await route.handler(dooReq);
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
