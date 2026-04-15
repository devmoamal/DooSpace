import {
  pgTable,
  text,
  timestamp,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { doosTable } from "./doos.schema";

export const dooboxTable = pgTable(
  "doobox",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    doo_id: integer("doo_id")
      .references(() => doosTable.id, { onDelete: "cascade" })
      .notNull(),
    key: text("key").notNull(),
    value: text("value").notNull(),
    expire_at: timestamp("expire_at"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("doobox_key_idx").on(table.doo_id, table.key)],
);
