import { loopRepository } from "@/repositories/loop.repository";
import { loopLogsRepository } from "@/repositories/loop_logs.repository";
import { executionService } from "@/services/execution.service";
import { type Loop, type InsertLoop, type UpdateLoop } from "@/db/types";
import { NotFoundError } from "@/lib/error";

function processPayload(payload: any): string {
  let str = JSON.stringify(payload || {});
  
  str = str.replace(/\{random_string_(\d+)\}/g, (_, length) => {
    const len = Math.min(parseInt(length) || 10, 100);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({length: len}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  });
  
  str = str.replace(/\{random_number_(\d+)\}/g, (_, length) => {
    const len = Math.min(parseInt(length) || 5, 20);
    return Math.floor(Math.random() * Math.pow(10, len)).toString().padStart(len, '0');
  });

  str = str.replace(/\{random_emoji\}/g, () => {
    const emojis = ["🚀", "🔥", "✨", "🎉", "🌟", "💡", "🌈", "🎈", "🍕", "🎸"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  });

  str = str.replace(/\{random_timestamp\}/g, () => Date.now().toString());
  str = str.replace(/\{random_bool\}/g, () => (Math.random() > 0.5).toString());
  
  return str;
}

export class LoopService {
  async getAllLoops(query: { page: number; limit: number; doo_id?: number }) {
    const { page, limit } = query;
    const { data, total } = await loopRepository.findPaginated(query);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getLoopLogs(id: string, query: { page: number; limit: number }) {
    const { page, limit } = query;
    const { data, total } = await loopLogsRepository.findPaginated({ ...query, loop_id: id });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getLoopById(id: string) {
    const loop = await loopRepository.findById(id);
    if (!loop) throw new NotFoundError("Loop not found");
    return loop;
  }

  async createLoop(data: InsertLoop) {
    const nextRun = data.type === 'once' ? new Date() : this.calculateNextRun(data.type, data.interval_ms);
    return await loopRepository.create({
      ...data,
      next_run_at: nextRun,
    });
  }

  async updateLoop(id: string, data: UpdateLoop) {
    return await loopRepository.update(id, data);
  }

  async deleteLoop(id: string) {
    return await loopRepository.delete(id);
  }

  async triggerLoop(id: string) {
    const loop = await this.getLoopById(id);
    if (loop.status !== "active") return;

    const startTime = Date.now();
    try {
      const processedBody = processPayload(loop.payload);

      // Construct a mock Request for the execution service
      const mockRequest = new Request(`http://localhost/loop/${loop.id}`, {
        method: "POST",
        body: processedBody,
        headers: { "Content-Type": "application/json" },
      });

      const response = await executionService.executeDoo(
        loop.doo_id,
        "POST", // Loops always call via POST or the designated endpoint
        loop.target_path,
        mockRequest
      );

      const responseText = await response.text();
      const duration = Date.now() - startTime;
      
      // Update last run and calculate next run
      const nextRun = this.calculateNextRun(loop.type, loop.interval_ms);
      
      let newStatus = loop.status;
      if (loop.type === "once") newStatus = "paused";

      await loopRepository.update(loop.id, {
        last_run_at: new Date(),
        next_run_at: nextRun,
        status: newStatus as any,
        retries: 0, // Reset retries on success
      });

      await loopLogsRepository.create({
        loop_id: loop.id,
        status: "success",
        duration_ms: duration,
        response_body: responseText,
      });

      // Handle end expression if present
      if (loop.end_expression) {
        try {
          const resJson = JSON.parse(responseText);
          const fn = new Function('res', `return ${loop.end_expression}`);
          if (fn(resJson)) {
            await loopRepository.update(loop.id, { status: "paused" });
          }
        } catch (e) {
          // Fallback to string check
          if (responseText.includes(loop.end_expression)) {
            await loopRepository.update(loop.id, { status: "paused" });
          }
        }
      }

    } catch (err: any) {
      console.error(`Loop ${id} failed:`, err);
      const duration = Date.now() - startTime;
      
      const newRetries = loop.retries + 1;
      const status = newRetries >= loop.max_retries ? "failed" : "active";
      
      await loopRepository.update(loop.id, {
        retries: newRetries,
        status,
        next_run_at: status === "active" ? new Date(Date.now() + 60000) : null, // Retry in 1m
      });

      await loopLogsRepository.create({
        loop_id: loop.id,
        status: "failed",
        duration_ms: duration,
        error_message: err.message || String(err),
      });
    }
  }

  private calculateNextRun(type: string, interval_ms?: number | null): Date | null {
    if (type === "once") return null;
    if (type === "interval" && interval_ms) {
      return new Date(Date.now() + interval_ms);
    }
    // Cron logic would go here later
    return null;
  }
}

export const loopService = new LoopService();
