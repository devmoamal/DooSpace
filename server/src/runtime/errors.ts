export class DooError extends Error {
  constructor(message: string, public readonly type: string) {
    super(message);
    this.name = "DooError";
  }
}

export class TranspilationError extends DooError {
  constructor(message: string) {
    super(message, "transpilation");
    this.name = "TranspilationError";
  }
}

export class SandboxError extends DooError {
  constructor(message: string) {
    super(message, "sandbox");
    this.name = "SandboxError";
  }
}

export class RuntimeError extends DooError {
  constructor(message: string, public readonly stackTrace?: string) {
    super(message, "runtime");
    this.name = "RuntimeError";
  }
}
