/**
 * DooSecrets — runtime wrapper for user secrets.
 * Pre-loaded at execution time; exposed as a Proxy so that
 * `secrets.MY_KEY` returns the value or undefined.
 */
export class DooSecrets {
  private readonly map: Readonly<Record<string, string>>;

  constructor(secretsMap: Record<string, string>) {
    this.map = Object.freeze({ ...secretsMap });
  }

  /** Get a secret by name */
  get(name: string): string | undefined {
    return this.map[name];
  }

  /** All secret names (values are never exposed in logs) */
  keys(): string[] {
    return Object.keys(this.map);
  }

  /**
   * Build a Proxy that allows property-style access:
   *   secrets.MY_SECRET
   */
  asProxy(): Record<string, string | undefined> {
    const map = this.map;
    return new Proxy({} as Record<string, string | undefined>, {
      get(_target, prop: string) {
        return map[prop];
      },
      has(_target, prop: string) {
        return prop in map;
      },
      ownKeys() {
        return Object.keys(map);
      },
      getOwnPropertyDescriptor(_target, prop: string) {
        if (prop in map) {
          return { value: map[prop], writable: false, enumerable: true, configurable: true };
        }
        return undefined;
      },
    });
  }
}
