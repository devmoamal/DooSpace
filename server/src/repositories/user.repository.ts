import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { type User, type InsertUser } from "@/db/types";

export class UserRepository {
  async findById(id: number): Promise<User | null> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return user || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);
    return user || null;
  }

  async create(data: InsertUser): Promise<User> {
    const [newUser] = await db.insert(usersTable).values(data).returning();
    return newUser;
  }
}

export const userRepository = new UserRepository();
