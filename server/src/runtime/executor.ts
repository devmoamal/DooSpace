import { Doo } from "./context";

export async function executeDoo(
  dooId: number,
  code: string,
  method: string,
  path: string,
  originalRequest: Request,
) {
  const transpiler = new Bun.Transpiler({
    loader: "ts",
    target: "node",
  });

  try {
    // 1. Transpile code
    let jsCode = transpiler.transformSync(code);

    // 2. Transform ESM to CJS for the sandbox (new Function)
    // Convert: import { x } from "doospace" -> const { x } = require("doospace")
    jsCode = jsCode.replace(
      /import\s*{\s*(.*?)\s*}\s*from\s*['"](.*?)['"];?/g,
      'const { $1 } = require("$2");',
    );
    
    // Convert: import x from "doospace" -> const x = require("doospace").default || require("doospace")
    jsCode = jsCode.replace(
      /import\s+(.*?)\s+from\s*['"](.*?)['"];?/g,
      'const $1 = require("$2").default || require("$2");',
    );

    // Convert: export default ... -> exports.default = ...
    jsCode = jsCode.replace(/export\s+default\s+/g, "exports.default = ");

    // 3. Prepare the sandbox
    const doo = new Doo(dooId);

    // 3. Execute the code to get the default export
    const wrapper = `
      const exports = {};
      const module = { exports };
      const require = (pkg) => {
        if (pkg === "doospace") return { Doo: arguments[0], default: arguments[0] };
        throw new Error("Package '" + pkg + "' is not available in the Doo sandbox.");
      };
      
      const doo = arguments[0];
      const fetch = globalThis.fetch;
      const Headers = globalThis.Headers;
      const Request = globalThis.Request;
      const Response = globalThis.Response;
      
      try {
        ${jsCode}
      } catch (e) {
        throw new Error("Runtime Error: " + e.message);
      }
      
      return typeof exports.default === 'function' ? exports.default : module.exports.default;
    `;

    const dooFactory = new Function("DooInternal", wrapper);
    const dooFunction = dooFactory(doo);

    if (typeof dooFunction !== "function") {
      throw new Error("The Doo code must have a default export function (e.g., export default function(doo: Doo) { ... }).");
    }

    // 4. Initialize the Doo
    dooFunction(doo);

    // 5. Run the specific route
    const startTime = Date.now();
    const response = await doo.run(method, path, originalRequest);
    const duration = Date.now() - startTime;

    // 6. Return results
    return {
      response,
      duration,
      ...doo.getResults(),
    };
  } catch (e: any) {
    const errorDoo = new Doo(dooId);
    errorDoo.error(e.message);
    return {
      response: new Response(e.message, { status: 500 }),
      duration: 0,
      ...errorDoo.getResults(),
    };
  }
}
