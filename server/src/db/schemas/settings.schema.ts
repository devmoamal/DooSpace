import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
