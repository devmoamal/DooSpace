import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { doosTable } from "../schemas/doos.schema";

export type Doo = InferSelectModel<typeof doosTable>;
export type InsertDoo = InferInsertModel<typeof doosTable>;
export type UpdateDoo = Partial<Omit<Doo, "id" | "created_at" | "updated_at">>;
