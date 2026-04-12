import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { usersTable } from "../schemas/users.schema";

export type User = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;
