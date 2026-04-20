import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { doosTable } from "./doos.schema";
import { type LoopType, type LoopStatus } from "@doospace/shared";

export const loopsTable = pgTable("loops", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  doo_id: integer("doo_id")
    .references(() => doosTable.id, { onDelete: "cascade" })
    .notNull(),
  
  type: text("type").$type<LoopType>().notNull(),
  interval_ms: integer("interval_ms"),
  cron_expr: text("cron_expr"),

  payload: jsonb("payload"),
  target_path: text("target_path").notNull(),
  end_expression: text("end_expression"),
  
  status: text("status").$type<LoopStatus>().default("active").notNull(),

  last_run_at: timestamp("last_run_at"),
  next_run_at: timestamp("next_run_at"),

  retries: integer("retries").default(0).notNull(),
  max_retries: integer("max_retries").default(3).notNull(),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
