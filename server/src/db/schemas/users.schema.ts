import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  version: integer("version").notNull().default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
