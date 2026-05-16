import { AppError } from "@/lib/error";

export class RuntimeExecutionError extends AppError {
  constructor(message: string, public readonly stack?: string) {
    super(message, 500, "SERVER_ERROR");
    this.name = "RuntimeExecutionError";
  }
}

export class TranspilationError extends AppError {
  constructor(message: string) {
    super(message, 400, "BAD_REQUEST");
    this.name = "TranspilationError";
  }
}

export class SandboxError extends AppError {
  constructor(message: string) {
    super(message, 500, "SERVER_ERROR");
    this.name = "SandboxError";
  }
}

export class DooExportError extends AppError {
  constructor() {
    super(
      "Doo must export a default function, e.g.:\n" +
      "export default function(doo) { doo.get('/', () => ({ ok: true })); }",
      400,
      "BAD_REQUEST"
    );
    this.name = "DooExportError";
  }
}
