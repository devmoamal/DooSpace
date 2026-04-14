import { db } from "@/db";
import { secretsTable } from "@/db/schemas";
import { eq, and } from "drizzle-orm";
import { type ProjectSecret } from "@/db/types";

export class SecretsRepository {
  async list(userId: number): Promise<ProjectSecret[]> {
    return await db
      .select()
      .from(secretsTable)
      .where(eq(secretsTable.user_id, userId));
  }

  async get(userId: number, name: string): Promise<ProjectSecret | null> {
    const [result] = await db
      .select()
      .from(secretsTable)
      .where(and(eq(secretsTable.user_id, userId), eq(secretsTable.name, name)))
      .limit(1);
    return result || null;
  }

  async set(userId: number, name: string, value: string): Promise<ProjectSecret> {
    const [result] = await db
      .insert(secretsTable)
      .values({ user_id: userId, name, value })
      .onConflictDoUpdate({
        target: [secretsTable.user_id, secretsTable.name],
        set: { value, updated_at: new Date() },
      })
      .returning();
    return result;
  }

  async delete(userId: number, name: string): Promise<boolean> {
    const result = await db
      .delete(secretsTable)
      .where(and(eq(secretsTable.user_id, userId), eq(secretsTable.name, name)))
      .returning();
    return result.length > 0;
  }

  /** Returns a plain Record<string, string> for runtime injection */
  async getAsMap(userId: number): Promise<Record<string, string>> {
    const secrets = await this.list(userId);
    return Object.fromEntries(secrets.map((s) => [s.name, s.value]));
  }
}

export const secretsRepository = new SecretsRepository();
