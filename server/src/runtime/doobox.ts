import { dooboxRepository } from "@/repositories/doobox.repository";

type TraceFn = (color: string) => void;

export class DooBox {
  constructor(
    private dooId: number,
    private traceFn?: TraceFn,
  ) {}

  async get<T = any>(key: string): Promise<T | null> {
    const item = await dooboxRepository.get(this.dooId, key);
    this.traceFn?.("db"); // amber — db read
    return item ? (item.value as T) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const expireAt = ttlSeconds
      ? new Date(Date.now() + ttlSeconds * 1000)
      : undefined;
    
    const textValue = typeof value === "string" ? value : JSON.stringify(value);

    await dooboxRepository.set(this.dooId, key, textValue, expireAt);
    this.traceFn?.("db"); // amber — db write
  }

  async delete(key: string): Promise<boolean> {
    this.traceFn?.("error"); // red — deletion
    return await dooboxRepository.delete(this.dooId, key);
  }

  async list() {
    return await dooboxRepository.list(this.dooId);
  }

  async clear() {
    await dooboxRepository.clear(this.dooId);
  }
}
