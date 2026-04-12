import { db } from "@/db";
import { settingsTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { type Setting } from "@/db/types";

export class SettingsRepository {
  async findAll(): Promise<Setting[]> {
    return await db.select().from(settingsTable);
  }

  async findByKey(key: string): Promise<Setting | null> {
    const [setting] = await db.select().from(settingsTable).where(eq(settingsTable.key, key)).limit(1);
    return setting || null;
  }

  async upsert(key: string, value: string): Promise<Setting> {
    const [upserted] = await db
      .insert(settingsTable)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value, updated_at: new Date() },
      })
      .returning();
    return upserted;
  }
}


export const settingsRepository = new SettingsRepository();
