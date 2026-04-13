import { db } from "@/db";
import { dooboxTable } from "@/db/schemas";
import { eq, and, or, isNull, gt, lt, sql } from "drizzle-orm";
import { type ProjectDooBox, type InsertProjectDooBox } from "@/db/types";

export class DooBoxRepository {
  private get expiryFilter() {
    return or(
      isNull(dooboxTable.expire_at),
      gt(dooboxTable.expire_at, new Date())
    );
  }

  async get(dooId: number, key: string): Promise<ProjectDooBox | null> {
    const [result] = await db
      .select()
      .from(dooboxTable)
      .where(
        and(
          eq(dooboxTable.doo_id, dooId), 
          eq(dooboxTable.key, key),
          this.expiryFilter
        )
      )
      .limit(1);
    return result || null;
  }

  async set(dooId: number, key: string, value: any, expireAt?: Date): Promise<ProjectDooBox> {
    const [result] = await db
      .insert(dooboxTable)
      .values({ 
        doo_id: dooId, 
        key, 
        value, 
        expire_at: expireAt || null 
      })
      .onConflictDoUpdate({
        target: [dooboxTable.doo_id, dooboxTable.key],
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
      .delete(dooboxTable)
      .where(and(eq(dooboxTable.doo_id, dooId), eq(dooboxTable.key, key)))
      .returning();
    return result.length > 0;
  }

  async list(dooId: number): Promise<ProjectDooBox[]> {
    return await db
      .select()
      .from(dooboxTable)
      .where(
        and(
          eq(dooboxTable.doo_id, dooId),
          this.expiryFilter
        )
      );
  }

  async clear(dooId: number): Promise<void> {
    await db
      .delete(dooboxTable)
      .where(eq(dooboxTable.doo_id, dooId));
  }

  async executeSql(dooId: number, query: string): Promise<any> {
    // We use a transaction to set a local variable for RLS or simple isolation
    // For this implementation, we will perform a safe replacement or wrapping
    // A more robust way is to use "SET LOCAL" but that requires a transaction
    return await db.transaction(async (tx) => {
      // Set the current doo_id in a session variable
      await tx.execute(sql.raw(`SET LOCAL doo.current_doo_id = ${dooId}`));
      
      // Execute the user query
      // NOTE: We assume the user is querying the "doobox" table.
      // We can use a regex to ensure they only touch allowed tables if needed.
      const result = await tx.execute(sql.raw(query));
      return result;
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await db
      .delete(dooboxTable)
      .where(lt(dooboxTable.expire_at, new Date()))
      .returning();
    return result.length;
  }
}

export const dooboxRepository = new DooBoxRepository();
