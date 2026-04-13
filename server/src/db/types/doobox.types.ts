import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { dooboxTable } from "../schemas/doobox.schema";

export type ProjectDooBox = InferSelectModel<typeof dooboxTable>;
export type InsertProjectDooBox = InferInsertModel<typeof dooboxTable>;
