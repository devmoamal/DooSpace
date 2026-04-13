import { storageRepository } from "@/repositories/storage.repository";

export class Storage {
  constructor(private dooId: number) {}

  async get<T = any>(key: string): Promise<T | null> {
    const item = await storageRepository.get(this.dooId, key);
    return item ? (item.value as T) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const expireAt = ttlSeconds
      ? new Date(Date.now() + ttlSeconds * 1000)
      : undefined;
    await storageRepository.set(this.dooId, key, value, expireAt);
  }

  async delete(key: string): Promise<boolean> {
    return await storageRepository.delete(this.dooId, key);
  }

  async list() {
    return await storageRepository.list(this.dooId);
  }

  async clear() {
    await storageRepository.clear(this.dooId);
  }
}
