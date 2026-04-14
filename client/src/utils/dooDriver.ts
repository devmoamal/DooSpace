/**
 * DooSpace Driver — type definitions injected into the Monaco editor sandbox.
 */

export const DOO_TYPES = `
declare module "doospace" {

  // ── Routing ──────────────────────────────────────────────────────────────

  export interface DooRequest<T = any> {
    /** Full request URL */
    url: string;
    /** HTTP method */
    method: string;
    /** Web Headers object */
    headers: Headers;
    /** Path params extracted from the route (e.g. /users/:id → { id: "1" }) */
    params: Record<string, string>;
    /** Query string params (e.g. ?page=2 → { page: "2" }) */
    query: Record<string, string>;
    /** Parsed JSON body for POST/PUT/PATCH */
    body: T;
  }

  type Handler<TRes = any, TReq = any> =
    (req: DooRequest<TReq>) => Promise<TRes | Response> | TRes | Response;

  export interface Doo {
    /** Register a GET handler */
    get<TRes = any>(path: string, handler: Handler<TRes>): void;
    /** Register a POST handler */
    post<TRes = any, TReq = any>(path: string, handler: Handler<TRes, TReq>): void;
    /** Register a PUT handler */
    put<TRes = any, TReq = any>(path: string, handler: Handler<TRes, TReq>): void;
    /** Register a DELETE handler */
    delete<TRes = any>(path: string, handler: Handler<TRes>): void;
    /** Register a PATCH handler */
    patch<TRes = any, TReq = any>(path: string, handler: Handler<TRes, TReq>): void;
    /** Register a handler for every HTTP method */
    all<TRes = any>(path: string, handler: Handler<TRes>): void;

    /** DooBox storage for this Doo */
    doobox: DooBox;
    /** User secrets (SCREAMING_SNAKE_CASE keys) */
    secrets: DooSecrets;
    /** 24×24 pixel canvas */
    canvas: DooCanvas;

    /** Return a JSON response */
    json(data: any, status?: number): Response;
    /** Return a plain-text response */
    text(data: string, status?: number): Response;
    /** Log a message */
    log(message: any): void;
    /** Log an error */
    error(message: any): void;
    /** Draw a single pixel on the canvas (0–23) */
    pixel(x: number, y: number, color: string): void;
    /** Fill the entire canvas */
    fill(color: string): void;
    /** Draw a rectangle */
    rect(x: number, y: number, w: number, h: number, color: string): void;
  }

  // ── DooBox ───────────────────────────────────────────────────────────────

  export interface DooBox {
    /** Get a stored value by key */
    get<T = any>(key: string): Promise<T | null>;
    /** Set a value, optionally with a TTL in seconds */
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    /** Delete a key — returns true if it existed */
    delete(key: string): Promise<boolean>;
    /** List all keys */
    list(): Promise<string[]>;
    /** Clear all data */
    clear(): Promise<void>;
  }

  // ── Secrets ──────────────────────────────────────────────────────────────

  /**
   * User secrets — set them in the Secrets page.
   * Access by SCREAMING_SNAKE_CASE name.
   *
   * @example
   * const token = secrets.MY_API_TOKEN; // string | undefined
   */
  export type DooSecrets = Record<string, string | undefined>;

  // ── Canvas ───────────────────────────────────────────────────────────────

  export interface DooCanvas {
    set(x: number, y: number, color: string): void;
    fill(color: string): void;
    clear(): void;
    rect(x: number, y: number, w: number, h: number, color: string): void;
    getPixels(): string[][];
  }

  // ── callDoo ──────────────────────────────────────────────────────────────

  /**
   * Client for calling other Doos directly — no HTTP hop.
   *
   * @example
   * import { callDoo } from "doospace";
   *
   * const users = await callDoo.get(13, "/users");
   * const user  = await callDoo.post(13, "/users", { name: "moamal" });
   * await callDoo.put(13, "/users/1", { name: "updated" });
   * await callDoo.delete(13, "/users/1");
   */
  export interface DooCallClient {
    get<T = any>(dooId: number, path: string): Promise<T>;
    post<T = any>(dooId: number, path: string, body?: any): Promise<T>;
    put<T = any>(dooId: number, path: string, body?: any): Promise<T>;
    delete<T = any>(dooId: number, path: string): Promise<T>;
    patch<T = any>(dooId: number, path: string, body?: any): Promise<T>;
  }

  // ── Module exports ───────────────────────────────────────────────────────

  export const doobox:  DooBox;
  export const secrets: DooSecrets;
  export const callDoo: DooCallClient;
}

// ── Globals available without import ─────────────────────────────────────────

/** Current Doo instance — use to register routes */
declare const doo: import("doospace").Doo;

/** Key-value storage for this Doo */
declare const doobox: import("doospace").DooBox;

/** User secrets (SCREAMING_SNAKE_CASE) */
declare const secrets: import("doospace").DooSecrets;

/** Call other Doos directly */
declare const callDoo: import("doospace").DooCallClient;

type Doo        = import("doospace").Doo;
type DooRequest<T = any> = import("doospace").DooRequest<T>;

// ── Standard Web APIs ─────────────────────────────────────────────────────────
declare function fetch(input: string | Request | URL, init?: RequestInit): Promise<Response>;
declare const Headers:  { new (init?: HeadersInit): Headers;  prototype: Headers;  };
declare const Request:  { new (input: string | Request | URL, init?: RequestInit): Request;  prototype: Request;  };
declare const Response: {
  new (body?: BodyInit | null, init?: ResponseInit): Response;
  prototype: Response;
  error(): Response;
  redirect(url: string | URL, status?: number): Response;
  json(data: any, init?: ResponseInit): Response;
};
`;
