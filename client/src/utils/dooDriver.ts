/**
 * DooSpace Type Definitions (Doo Driver)
 * This file provides the TypeScript definitions for the sandboxed Doo environment.
 */

export const DOO_TYPES = `
  declare module "doospace" {
    /**
     * Represents the automated logic environment.
     */
    export interface Doo {
      /**
       * **Storage Engine**  
       * Key-value persistence layer specific to this orchestration unit.
       */
      db: DooStorage;
      
      /**
       * **Visual Canvas Engine**  
       * Control the interactive 24x24 pixel display.
       */
      canvas: DooCanvas;
      
      /**
       * **Execution Logs**  
       * Array of current execution strings.
       */
      logs: string[];

      /**
       * Register a **GET** endpoint.
       */
      get<TResponse = any>(path: string, handler: (req: DooRequest<any>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Register a **POST** endpoint.
       */
      post<TResponse = any, TRequest = any>(path: string, handler: (req: DooRequest<TRequest>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Register a **PUT** endpoint.
       */
      put<TResponse = any, TRequest = any>(path: string, handler: (req: DooRequest<TRequest>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Register a **DELETE** endpoint.
       */
      delete<TResponse = any>(path: string, handler: (req: DooRequest<any>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Register a catch-all endpoint for **ALL** methods.
       */
      all<TResponse = any>(path: string, handler: (req: DooRequest<any>) => Promise<TResponse | Response> | TResponse | Response): void;

      /**
       * Submits a pixel to the visual canvas.
       */
      pixel(x: number, y: number, color: string): void;

      /**
       * Immediately constructs a JSON Response object.
       */
      json(data: any, status?: number): Response;

      /**
       * Immediately constructs a text Response object.
       */
      text(data: string, status?: number): Response;

      /**
       * Logs an informational message to the orchestration console.
       */
      log(message: string): void;

      /**
       * Logs a fatal error message to the orchestration console.
       */
      error(message: string): void;
    }

    /**
     * Represents an incoming HTTP request in the Doo environment.
     */
    export interface DooRequest<T = any> {
      /**
       * The full URL of the request.
       */
      url: string;
      /**
       * The HTTP method (GET, POST, etc).
       */
      method: string;
      /**
       * The incoming request headers.
       */
      headers: Headers;
      /**
       * Object containing named route parameters (e.g., from /users/:id).
       */
      params: Record<string, string>;
      /**
       * The parsed JSON request body, strictly typed.
       */
      body: T;
    }

    export interface DooStorage {
      get<T = any>(key: string): Promise<T | null>;
      set(key: string, value: any, ttlSeconds?: number): Promise<void>;
      delete(key: string): Promise<boolean>;
      list(): Promise<string[]>;
    }

    export interface DooCanvas {
      set(x: number, y: number, color: string): void;
      getPixels(): string[][];
    }
  }

  /**
   * Compatibility: Global Doo instance.
   */
  import { Doo, DooRequest } from "doospace";
  declare const doo: Doo;
`;


