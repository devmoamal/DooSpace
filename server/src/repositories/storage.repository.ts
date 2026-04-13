import { db } from "@/db";
import { storageTable } from "@/db/schemas";
import { eq, and, or, isNull, gt, lt } from "drizzle-orm";
import { type ProjectStorage, type InsertProjectStorage } from "@/db/types";

export class StorageRepository {
  private get expiryFilter() {
    return or(
      isNull(storageTable.expire_at),
      gt(storageTable.expire_at, new Date())
    );
  }

  async get(dooId: number, key: string): Promise<ProjectStorage | null> {
    const [result] = await db
      .select()
      .from(storageTable)
      .where(
        and(
          eq(storageTable.doo_id, dooId), 
          eq(storageTable.key, key),
          this.expiryFilter
        )
      )
      .limit(1);
    return result || null;
  }

  async set(dooId: number, key: string, value: any, expireAt?: Date): Promise<ProjectStorage> {
    const [result] = await db
      .insert(storageTable)
      .values({ 
        doo_id: dooId, 
        key, 
        value, 
        expire_at: expireAt || null 
      })
      .onConflictDoUpdate({
        target: [storageTable.doo_id, storageTable.key],
        set: { 
          value, 
          expire_at: expireAt || null,
          updated_at: new Date() 
        },
      })
      .returning();
    return result;
  }

  async delete(dooId: number, key: string): Promise<boolean> {
    const result = await db
      .delete(storageTable)
      .where(and(eq(storageTable.doo_id, dooId), eq(storageTable.key, key)))
      .returning();
    return result.length > 0;
  }

  async list(dooId: number): Promise<ProjectStorage[]> {
    return await db
      .select()
      .from(storageTable)
      .where(
        and(
          eq(storageTable.doo_id, dooId),
          this.expiryFilter
        )
      );
  }

  async clear(dooId: number): Promise<void> {
    await db
      .delete(storageTable)
      .where(eq(storageTable.doo_id, dooId));
  }

  async deleteExpired(): Promise<number> {
    const result = await db
      .delete(storageTable)
      .where(lt(storageTable.expire_at, new Date()))
      .returning();
    return result.length;
  }
}


export const storageRepository = new StorageRepository();
