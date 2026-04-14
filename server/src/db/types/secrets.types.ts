import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { secretsTable } from "../schemas/secrets.schema";

export type ProjectSecret = InferSelectModel<typeof secretsTable>;
export type InsertProjectSecret = InferInsertModel<typeof secretsTable>;
