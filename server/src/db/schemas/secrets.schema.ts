import {
  pgTable,
  text,
  timestamp,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";

export const secretsTable = pgTable(
  "secrets",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    user_id: integer("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(), // SCREAMING_SNAKE_CASE enforced at app layer
    value: text("value").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("secrets_name_idx").on(table.user_id, table.name)],
);
