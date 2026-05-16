import { db } from "@/db";
import { pagesTable, pageMessagesTable } from "@/db/schemas";
import { eq, desc, and } from "drizzle-orm";
import { type Page, type PageMessage } from "@doospace/shared";

export class PageRepository {
  async list(userId: number) {
    return db
      .select()
      .from(pagesTable)
      .where(eq(pagesTable.owner_id, userId))
      .orderBy(desc(pagesTable.created_at));
  }

  async findById(id: string) {
    const [page] = await db
      .select()
      .from(pagesTable)
      .where(eq(pagesTable.id, id));
    return page;
  }

  async create(data: { name: string; owner_id: number }) {
    const [page] = await db
      .insert(pagesTable)
      .values({
        name: data.name,
        owner_id: data.owner_id,
      })
      .returning();
    return page;
  }

  async updateCode(id: string, code: { html?: string }) {
    const [page] = await db
      .update(pagesTable)
      .set({
        ...code,
        updated_at: new Date(),
      })
      .where(eq(pagesTable.id, id))
      .returning();
    return page;
  }

  async delete(id: string) {
    const [deleted] = await db
      .delete(pagesTable)
      .where(eq(pagesTable.id, id))
      .returning();
    return !!deleted;
  }

  // Messages
  async listMessages(pageId: string) {
    return db
      .select()
      .from(pageMessagesTable)
      .where(eq(pageMessagesTable.page_id, pageId))
      .orderBy(desc(pageMessagesTable.created_at));
  }

  async createMessage(data: {
    page_id: string;
    role: "user" | "assistant" | "system";
    content: string;
  }) {
    const [message] = await db
      .insert(pageMessagesTable)
      .values(data)
      .returning();
    return message;
  }
}

export const pageRepository = new PageRepository();
