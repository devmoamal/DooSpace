import { dooboxRepository } from "@/repositories/doobox.repository";

export class DooBox {
  constructor(private dooId: number) {}

  async get<T = any>(key: string): Promise<T | null> {
    const item = await dooboxRepository.get(this.dooId, key);
    return item ? (item.value as T) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const expireAt = ttlSeconds
      ? new Date(Date.now() + ttlSeconds * 1000)
      : undefined;
    await dooboxRepository.set(this.dooId, key, value, expireAt);
  }

  async delete(key: string): Promise<boolean> {
    return await dooboxRepository.delete(this.dooId, key);
  }

  async list() {
    return await dooboxRepository.list(this.dooId);
  }

  async clear() {
    await dooboxRepository.clear(this.dooId);
  }
}
