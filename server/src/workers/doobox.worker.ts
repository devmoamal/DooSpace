import { dooboxRepository } from "@/repositories/doobox.repository";
import { logger } from "@/lib/logger";

export class DooBoxWorker {
  private interval: Timer | null = null;
  private isRunning = false;

  constructor(private readonly intervalMs: number = 60 * 1000) {}

  start() {
    if (this.interval) return;

    logger.info(
      `Starting DooBox Expiry Worker (Interval: ${this.intervalMs}ms)`,
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
      logger.info("DooBox Expiry Worker stopped.");
    }
  }

  private async cleanup() {
    if (this.isRunning) return;

    this.isRunning = true;
    try {
      const deletedCount = await dooboxRepository.deleteExpired();
      if (deletedCount > 0) {
        logger.info(
          `DooBox Cleanup: Removed ${deletedCount} expired records.`,
        );
      }
    } catch (error) {
      logger.error("Error during DooBox cleanup:", error);
    } finally {
      this.isRunning = false;
    }
  }
}

export const dooboxWorker = new DooBoxWorker();
