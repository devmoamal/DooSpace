import { db } from "@/db";
import { requestsTable } from "@/db/schemas";
import { count, eq, sql } from "drizzle-orm";
import { type DooRequest, type InsertDooRequest } from "@/db/types";

export class RequestRepository {
  async findPaginated(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(requestsTable)
        .orderBy(sql`${requestsTable.created_at} DESC`)
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(requestsTable),
    ]);

    return {
      data,
      total: totalResult[0].value,
    };
  }

  async findPaginatedByDooId(dooId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(requestsTable)
        .where(eq(requestsTable.doo_id, dooId))
        .orderBy(sql`${requestsTable.created_at} DESC`)
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(requestsTable)
        .where(eq(requestsTable.doo_id, dooId)),
    ]);

    return {
      data,
      total: totalResult[0].value,
    };
  }

  async create(data: InsertDooRequest): Promise<DooRequest> {
    const [newRequest] = await db.insert(requestsTable).values(data).returning();
    return newRequest;
  }

  async findByDooId(dooId: number): Promise<DooRequest[]> {
    return await db.select().from(requestsTable).where(eq(requestsTable.doo_id, dooId));
  }
}

export const requestRepository = new RequestRepository();
