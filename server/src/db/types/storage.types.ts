import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { storageTable } from "../schemas/storage.schema";

export type ProjectStorage = InferSelectModel<typeof storageTable>;
export type InsertProjectStorage = InferInsertModel<typeof storageTable>;
