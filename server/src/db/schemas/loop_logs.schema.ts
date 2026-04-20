import {
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { loopsTable } from "./loops.schema";

export const loopLogsTable = pgTable("loop_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  loop_id: text("loop_id")
    .references(() => loopsTable.id, { onDelete: "cascade" })
    .notNull(),
  
  status: text("status").$type<"success" | "failed">().notNull(),
  
  duration_ms: integer("duration_ms").notNull(),
  response_body: text("response_body"),
  error_message: text("error_message"),

  run_at: timestamp("run_at").defaultNow().notNull(),
});
