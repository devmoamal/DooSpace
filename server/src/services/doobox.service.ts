import { dooboxRepository } from "@/repositories/doobox.repository";
import { dooRepository } from "@/repositories/doo.repository";
import { type DooBoxUsage } from "@doospace/shared";

export class DooBoxService {
  async getUsageStats(): Promise<DooBoxUsage[]> {
    const doos = await dooRepository.findAll();
    const stats: DooBoxUsage[] = [];

    for (const doo of doos) {
      const doobox = await dooboxRepository.list(doo.id);
      const totalKeys = doobox.length;
      let totalBytes = 0;
      
      // Rough estimation of size from JSON content
      for (const item of doobox) {
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

export const dooboxService = new DooBoxService();
