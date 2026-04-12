import { db } from "@/db";
import { doosTable } from "@/db/schemas";
import { count, eq, ilike, or, and, desc, asc } from "drizzle-orm";
import { type Doo, type InsertDoo, type UpdateDoo } from "@/db/types";

export interface FindPaginatedQuery {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sort?: "asc" | "desc";
}

export class DooRepository {
  async findPaginated({ page, limit, search, status, sort }: FindPaginatedQuery) {
    const offset = (page - 1) * limit;
    
    const where = and(
      search 
        ? or(
            ilike(doosTable.name, `%${search}%`),
            ilike(doosTable.description, `%${search}%`)
          ) 
        : undefined,
      status === "active" ? eq(doosTable.is_active, true) : status === "inactive" ? eq(doosTable.is_active, false) : undefined
    );

    const orderBy = sort === "asc" ? asc(doosTable.created_at) : desc(doosTable.created_at);

    const [data, totalResult] = await Promise.all([
      db.select().from(doosTable).where(where).orderBy(orderBy).limit(limit).offset(offset),
      db.select({ value: count() }).from(doosTable).where(where),
    ]);

    return {
      data,
      total: totalResult[0].value,
    };
  }

  async findAll(): Promise<Doo[]> {
    return await db.select().from(doosTable);
  }

  async findById(id: number): Promise<Doo | null> {
    const [doo] = await db.select().from(doosTable).where(eq(doosTable.id, id)).limit(1);
    return doo || null;
  }

  async create(data: InsertDoo): Promise<Doo> {
    const [newDoo] = await db.insert(doosTable).values(data).returning();
    return newDoo;
  }

  async update(id: number, data: UpdateDoo): Promise<Doo | null> {
    const [updatedDoo] = await db
      .update(doosTable)
      .set({ ...data, updated_at: new Date() })
      .where(eq(doosTable.id, id))
      .returning();

    return updatedDoo || null;
  }

  async delete(id: number): Promise<Doo | null> {
    const [deletedDoo] = await db.delete(doosTable).where(eq(doosTable.id, id)).returning();
    return deletedDoo || null;
  }
}



export const dooRepository = new DooRepository();
