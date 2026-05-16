import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";

export const pagesTable = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  owner_id: integer("owner_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  html: text("html").default("").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const pageMessagesTable = pgTable("page_messages", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  page_id: uuid("page_id")
    .references(() => pagesTable.id, { onDelete: "cascade" })
    .notNull(),
  role: text("role").$type<"user" | "assistant" | "system">().notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
