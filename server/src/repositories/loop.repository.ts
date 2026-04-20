import { db } from "@/db";
import { loopsTable } from "@/db/schemas";
import { count, eq, and, desc, asc, lte, or, isNull } from "drizzle-orm";
import { type Loop, type InsertLoop, type UpdateLoop } from "@/db/types";

export interface FindLoopsQuery {
  page: number;
  limit: number;
  doo_id?: number;
}

export class LoopRepository {
  async findPaginated({ page, limit, doo_id }: FindLoopsQuery) {
    const offset = (page - 1) * limit;
    
    const where = doo_id ? eq(loopsTable.doo_id, doo_id) : undefined;
    const orderBy = desc(loopsTable.created_at);

    const [data, totalResult] = await Promise.all([
      db.select().from(loopsTable).where(where).orderBy(orderBy).limit(limit).offset(offset),
      db.select({ value: count() }).from(loopsTable).where(where),
    ]);

    return {
      data,
      total: totalResult[0].value,
    };
  }

  async findDueLoops(): Promise<Loop[]> {
    const now = new Date();
    return await db.select()
      .from(loopsTable)
      .where(
        and(
          eq(loopsTable.status, "active"),
          lte(loopsTable.next_run_at, now)
        )
      );
  }

  async findById(id: string): Promise<Loop | null> {
    const [loop] = await db.select().from(loopsTable).where(eq(loopsTable.id, id)).limit(1);
    return loop || null;
  }

  async create(data: InsertLoop): Promise<Loop> {
    const [newLoop] = await db.insert(loopsTable).values(data).returning();
    return newLoop;
  }

  async update(id: string, data: UpdateLoop): Promise<Loop | null> {
    const [updatedLoop] = await db
      .update(loopsTable)
      .set({ ...data, updated_at: new Date() })
      .where(eq(loopsTable.id, id))
      .returning();

    return updatedLoop || null;
  }

  async delete(id: string): Promise<Loop | null> {
    const [deletedLoop] = await db.delete(loopsTable).where(eq(loopsTable.id, id)).returning();
    return deletedLoop || null;
  }
}

export const loopRepository = new LoopRepository();
