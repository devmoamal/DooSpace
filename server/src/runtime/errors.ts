import { AppError } from "@/lib/error";

/**
 * Base class for all Doo runtime errors
 */
export class DooRuntimeError extends AppError {
  constructor(message: string, code: any = "RUNTIME_ERROR") {
    super(message, 500, code);
  }
}

/**
 * Thrown when TypeScript transpilation fails
 */
export class DooTranspilationError extends DooRuntimeError {
  constructor(message: string) {
    super(`Transpilation Error: ${message}`, "TRANSPILATION_ERROR");
  }
}

/**
 * Thrown when the Doo fails to register (e.g. invalid default export)
 */
export class DooRegistrationError extends DooRuntimeError {
  constructor(message: string) {
    super(`Registration Error: ${message}`);
  }
}

/**
 * Thrown when a Doo handler fails during execution
 */
export class DooExecutionError extends DooRuntimeError {
  constructor(message: string) {
    super(`Execution Error: ${message}`);
  }
}
