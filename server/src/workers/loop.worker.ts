import { loopRepository } from "@/repositories/loop.repository";
import { loopService } from "@/services/loop.service";

const POLL_INTERVAL_MS = 5000; // Poll every 5 seconds

export class LoopWorker {
  private timer: Timer | null = null;
  private isProcessing = false;

  start() {
    console.log("[LoopWorker] Starting...");
    this.timer = setInterval(() => this.tick(), POLL_INTERVAL_MS);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const dueLoops = await loopRepository.findDueLoops();

      if (dueLoops.length > 0) {
        console.log(
          `[LoopWorker] Found ${dueLoops.length} due loops. Processing...`,
        );

        // Trigger all due loops in parallel
        await Promise.allSettled(
          dueLoops.map((loop) => loopService.triggerLoop(loop.id)),
        );
      }
    } catch (err) {
      console.error("[LoopWorker] Tick error:", err);
    } finally {
      this.isProcessing = false;
    }
  }
}

export const loopWorker = new LoopWorker();
