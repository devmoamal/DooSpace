import { Doo } from "./context";
import { dooRepository } from "@/repositories/doo.repository";
import { secretsRepository } from "@/repositories/secrets.repository";

// ── DooCallClient — callable class for Doo-to-Doo routing ───────────────────
// Usage: callDoo.get(13, "/users")
//        callDoo.post(13, "/users", { name: "moamal" })

export class DooCallClient {
  constructor(private traceFn?: (color: string) => void) {}

  async get<T = any>(dooId: number, path: string): Promise<T> {
    this.traceFn?.("brand");
    return executeDooById(dooId, "GET", path);
  }

  async post<T = any>(dooId: number, path: string, body?: any): Promise<T> {
    this.traceFn?.("brand");
    return executeDooById(dooId, "POST", path, { body });
  }

  async put<T = any>(dooId: number, path: string, body?: any): Promise<T> {
    this.traceFn?.("brand");
    return executeDooById(dooId, "PUT", path, { body });
  }

  async delete<T = any>(dooId: number, path: string): Promise<T> {
    this.traceFn?.("brand");
    return executeDooById(dooId, "DELETE", path);
  }

  async patch<T = any>(dooId: number, path: string, body?: any): Promise<T> {
    this.traceFn?.("brand");
    return executeDooById(dooId, "PATCH", path, { body });
  }
}

// ── Main executor ────────────────────────────────────────────────────────────

export async function executeDoo(
  dooId: number,
  code: string,
  method: string,
  path: string,
  originalRequest: Request,
  secretsMap: Record<string, string> = {},
) {
  const transpiler = new Bun.Transpiler({ loader: "ts", target: "node" });

  try {
    // 1. Transpile TypeScript → JS
    let jsCode = transpiler.transformSync(code);

    // 2. ESM → CJS
    jsCode = jsCode.replace(
      /import\s*\{\s*(.*?)\s*\}\s*from\s*['"](.*?)['"]\s*;?/g,
      'const { $1 } = require("$2");',
    );
    jsCode = jsCode.replace(
      /import\s+(.*?)\s+from\s*['"](.*?)['"]\s*;?/g,
      'const $1 = require("$2").default || require("$2");',
    );
    jsCode = jsCode.replace(/export\s+default\s+/g, "exports.default = ");

    // 3. Build sandbox objects
    const doo        = new Doo(dooId, secretsMap);
    const doobox     = doo.doobox;
    const secrets    = doo.secrets.asProxy();
    const callDoo    = new DooCallClient((color) => doo._trace(color));

    // 4. Sandbox wrapper — all imports from "doospace" resolve here
    const wrapper = `
      const exports = {};
      const module  = { exports };

      const require = (pkg) => {
        if (pkg === "doospace") {
          return {
            doobox:  arguments[1],
            secrets: arguments[2],
            callDoo: arguments[3],
            Doo:     arguments[0],
            default: arguments[0],
          };
        }
        throw new Error("Package '" + pkg + "' is not available in the Doo sandbox.");
      };

      const doo     = arguments[0];
      const doobox  = arguments[1];
      const secrets = arguments[2];
      const callDoo = arguments[3];

      const fetch    = globalThis.fetch;
      const Headers  = globalThis.Headers;
      const Request  = globalThis.Request;
      const Response = globalThis.Response;

      try {
        ${jsCode}
      } catch (e) {
        throw new Error("Runtime Error: " + e.message);
      }

      return typeof exports.default === 'function'
        ? exports.default
        : module.exports.default;
    `;

    const dooFactory  = new Function("_doo", "_doobox", "_secrets", "_callDoo", wrapper);
    const dooFunction = dooFactory(doo, doobox, secrets, callDoo);

    if (typeof dooFunction !== "function") {
      throw new Error(
        "Doo must export a default function, e.g.:\n" +
        "export default function(doo) { doo.get('/', () => ({ ok: true })); }"
      );
    }

    dooFunction(doo);

    const startTime = Date.now();
    const response  = await doo.run(method, path, originalRequest);
    const duration  = Date.now() - startTime;

    return { response, duration, ...doo.getResults() };

  } catch (e: any) {
    const errDoo = new Doo(dooId);
    errDoo.error(e.message);
    return {
      response: new Response(e.message, { status: 500 }),
      duration: 0,
      ...errDoo.getResults(),
    };
  }
}

// ── executeDooById — direct engine call, no HTTP ─────────────────────────────

export async function executeDooById(
  dooId: number,
  method: string,
  path: string,
  options?: { body?: any; headers?: Record<string, string> },
): Promise<any> {
  const doo = await dooRepository.findById(dooId);
  if (!doo) throw new Error(`callDoo: Doo #${dooId} not found`);

  const secretsMap = doo.owner_id
    ? await secretsRepository.getAsMap(doo.owner_id)
    : {};

  const normalPath = path.startsWith("/") ? path : `/${path}`;
  const url        = `http://internal/doos/doo_${dooId}${normalPath}`;

  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  };
  if (options?.body && method !== "GET" && method !== "DELETE") {
    init.body = JSON.stringify(options.body);
  }

  const syntheticRequest = new Request(url, init);
  const result = await executeDoo(doo.id, doo.code, method, normalPath, syntheticRequest, secretsMap);

  try {
    return await result.response.clone().json();
  } catch {
    return await result.response.clone().text();
  }
}
