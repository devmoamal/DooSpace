import { db } from "@/db";
import { loopLogsTable } from "@/db/schemas";
import { count, eq, desc } from "drizzle-orm";
import { type LoopLog, type InsertLoopLog } from "@/db/types";

export interface FindLoopLogsQuery {
  page: number;
  limit: number;
  loop_id?: string;
}

export class LoopLogsRepository {
  async findPaginated({ page, limit, loop_id }: FindLoopLogsQuery) {
    const offset = (page - 1) * limit;
    
    const where = loop_id ? eq(loopLogsTable.loop_id, loop_id) : undefined;
    const orderBy = desc(loopLogsTable.run_at);

    const [data, totalResult] = await Promise.all([
      db.select().from(loopLogsTable).where(where).orderBy(orderBy).limit(limit).offset(offset),
      db.select({ value: count() }).from(loopLogsTable).where(where),
    ]);

    return {
      data,
      total: totalResult[0].value,
    };
  }

  async create(data: InsertLoopLog): Promise<LoopLog> {
    const [newLog] = await db.insert(loopLogsTable).values(data).returning();
    return newLog;
  }
}

export const loopLogsRepository = new LoopLogsRepository();
