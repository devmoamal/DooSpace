import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { type Endpoint } from "@doospace/shared";
import { usersTable } from "./users.schema";

export const doosTable = pgTable("doos", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  owner_id: integer("owner_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  endpoints: jsonb("endpoints").$type<Endpoint[]>().notNull().default([]),
  code: text("code").notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
