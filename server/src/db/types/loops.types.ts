import { loopsTable } from "../schemas/loops.schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export type Loop = InferSelectModel<typeof loopsTable>;
export type InsertLoop = InferInsertModel<typeof loopsTable>;
export type UpdateLoop = Partial<InsertLoop>;
