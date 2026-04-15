import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { doosTable } from "./doos.schema";

export const requestsTable = pgTable("requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  doo_id: integer("doo_id")
    .references(() => doosTable.id, { onDelete: "cascade" })
    .notNull(),

  method: text("method").notNull(),
  path: text("path").notNull(),
  status: integer("status").notNull(),
  response: text("response"),
  logs: jsonb("logs").$type<string[]>().default([]).notNull(),
  doo_pix: jsonb("doo_pix").$type<string[]>().default([]).notNull(), // array of event colors
  duration: integer("duration"), // ms
  created_at: timestamp("created_at").defaultNow().notNull(),
});
