import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { doosTable } from "./doos.schema";

export const storageTable = pgTable(
  "storage",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    doo_id: integer("doo_id")
      .references(() => doosTable.id, { onDelete: "cascade" })
      .notNull(),
    key: text("key").notNull(),
    value: jsonb("value").notNull(),
    expire_at: timestamp("expire_at"),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("doo_key_idx").on(table.doo_id, table.key)],
);
