/**
 * DooSpace Type Definitions (Doo Driver)
 * This file provides the TypeScript definitions for the sandboxed Doo environment.
 */

export const DOO_TYPES = `
  /**
   * DooSpace Environment - Types and APIs
   * This module defines the available globals and types in the Doo sandbox.
   */
  declare module "doospace" {
    /**
     * The Doo instance provides access to the storage, canvas, and routing systems.
     */
    export interface Doo {
      /**
       * **Key-Value Storage**
       * Persist data across executions. Each Doo unit has its own private storage.
       */
      db: DooStorage;
      
      /**
       * **24x24 Visual Canvas**
       * Directly manipulate the pixel display.
       */
      canvas: DooCanvas;
      
      /**
       * **Execution Logs**
       * Access the logs generated during the current execution.
       */
      logs: string[];

      /**
       * Register a GET endpoint.
       * 
       * @param path The route path (e.g., "/items", "/items/:id")
       * @param handler Function to handle the request
       * @example
       * doo.get("/hello", (req) => {
       *   return { message: "Hello World" };
       * });
       */
      get<TResponse = any>(path: string, handler: (req: DooRequest<any>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Register a POST endpoint.
       * 
       * @param path The route path
       * @param handler Function to handle the request. Access the body via req.body.
       * @example
       * doo.post("/submit", async (req) => {
       *   const data = req.body;
       *   await doo.db.set("last_submission", data);
       *   return { success: true };
       * });
       */
      post<TResponse = any, TRequest = any>(path: string, handler: (req: DooRequest<TRequest>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Register a PUT endpoint.
       */
      put<TResponse = any, TRequest = any>(path: string, handler: (req: DooRequest<TRequest>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Register a DELETE endpoint.
       */
      delete<TResponse = any>(path: string, handler: (req: DooRequest<any>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Register a handler for ALL HTTP methods.
       */
      all<TResponse = any>(path: string, handler: (req: DooRequest<any>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Shortcut to draw a pixel on the canvas.
       * @param x X coordinate (0-23)
       * @param y Y coordinate (0-23)
       * @param color Hex color or brand color name
       */
      pixel(x: number, y: number, color: string): void;

      /**
       * Fills the entire canvas with a single color.
       * @param color Hex color or brand color name
       */
      fill(color: string): void;

      /**
       * Draws a rectangle on the canvas.
       */
      rect(x: number, y: number, w: number, h: number, color: string): void;

      /**
       * Helper to create a JSON Response.
       * @param data The object to serialize
       * @param status HTTP status code (default 200)
       */
      json(data: any, status?: number): Response;

      /**
       * Helper to create a plain text Response.
       * @param data The string content
       * @param status HTTP status code (default 200)
       */
      text(data: string, status?: number): Response;

      /**
       * Log a message to the Doo console.
       * @param message Message to log
       */
      log(message: any): void;

      /**
       * Log an error message to the Doo console.
       * @param message Error message
       */
      error(message: any): void;
    }

    /**
     * Represents an incoming HTTP request.
     */
    export interface DooRequest<T = any> {
      /** The full request URL */
      url: string;
      /** HTTP method (GET, POST, etc.) */
      method: string;
      /** Standard Web Headers object */
      headers: Headers;
      /** URL parameters extracted from the path (e.g., { id: "123" }) */
      params: Record<string, string>;
      /** Query parameters (e.g., /?name=bob -> { name: "bob" }) */
      query: Record<string, string>;
      /** Parsed JSON body (for POST/PUT requests) */
      body: T;
    }

    /**
     * Key-Value storage interface.
     */
    export interface DooStorage {
      /**
       * Retrieve a value by key.
       * @template T The expected type of the value
       */
      get<T = any>(key: string): Promise<T | null>;
      
      /**
       * Save a value.
       * @param key Unique identifier
       * @param value Data to save (must be JSON serializable)
       * @param ttlSeconds Optional time-to-live in seconds
       */
      set(key: string, value: any, ttlSeconds?: number): Promise<void>;
      
      /**
       * Remove an item from storage.
       * @returns true if the item was deleted
       */
      delete(key: string): Promise<boolean>;
      
      /**
       * List all keys in this Doo's storage.
       */
      list(): Promise<string[]>;

      /**
       * Clear all data from this Doo's storage.
       */
      clear(): Promise<void>;
    }

    /**
     * Canvas manipulation interface.
     */
    export interface DooCanvas {
      /** Set pixel color at (x, y) */
      set(x: number, y: number, color: string): void;
      /** Fill the entire canvas with color */
      fill(color: string): void;
      /** Reset canvas to default */
      clear(): void;
      /** Draw a rectangle */
      rect(x: number, y: number, w: number, h: number, color: string): void;
      /** Get the full 24x24 pixel grid */
      getPixels(): string[][];
    }
  }

  /**
   * The global Doo instance provided by the environment.
   */
  declare const doo: import("doospace").Doo;

  /**
   * The Doo interface for type annotations.
   */
  type Doo = import("doospace").Doo;

  /**
   * Represents an incoming HTTP request.
   */
  type DooRequest<T = any> = import("doospace").DooRequest<T>;

  /** Standard Web APIs available in the sandbox */
  declare function fetch(input: string | Request | URL, init?: RequestInit): Promise<Response>;
  declare const Headers: {
    new (init?: HeadersInit): Headers;
    prototype: Headers;
  };
  declare const Request: {
    new (input: string | Request | URL, init?: RequestInit): Request;
    prototype: Request;
  };
  declare const Response: {
    new (body?: BodyInit | null, init?: ResponseInit): Response;
    prototype: Response;
    error(): Response;
    redirect(url: string | URL, status?: number): Response;
    json(data: any, init?: ResponseInit): Response;
  };
`;
