import { storageRepository } from "@/repositories/storage.repository";
import { dooRepository } from "@/repositories/doo.repository";
import { type DooStorageUsage } from "@doospace/shared";

export class StorageService {
  async getUsageStats(): Promise<DooStorageUsage[]> {
    const doos = await dooRepository.findAll();
    const stats: DooStorageUsage[] = [];

    for (const doo of doos) {
      const storage = await storageRepository.list(doo.id);
      const totalKeys = storage.length;
      let totalBytes = 0;
      
      // Rough estimation of size from JSON content
      for (const item of storage) {
        totalBytes += JSON.stringify(item.value).length;
      }

      stats.push({
        dooId: doo.id,
        dooName: doo.name,
        keyCount: totalKeys,
        sizeBytes: totalBytes,
        formattedSize: this.formatSize(totalBytes),
      });
    }

    return stats;
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
}

export const storageService = new StorageService();
