import { storageRepository } from "@/repositories/storage.repository";
import { logger } from "@/lib/logger";

export class StorageWorker {
  private interval: Timer | null = null;
  private isRunning = false;

  constructor(private readonly intervalMs: number = 60 * 1000) {}

  start() {
    if (this.interval) return;

    logger.info(
      `Starting Storage Expiry Worker (Interval: ${this.intervalMs}ms)`,
    );

    // Run immediately on start
    this.cleanup();

    this.interval = setInterval(() => {
      this.cleanup();
    }, this.intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      logger.info("Storage Expiry Worker stopped.");
    }
  }

  private async cleanup() {
    if (this.isRunning) return;

    this.isRunning = true;
    try {
      const deletedCount = await storageRepository.deleteExpired();
      if (deletedCount > 0) {
        logger.info(
          `Storage Cleanup: Removed ${deletedCount} expired records.`,
        );
      }
    } catch (error) {
      logger.error("Error during storage cleanup:", error);
    } finally {
      this.isRunning = false;
    }
  }
}

export const storageWorker = new StorageWorker();
