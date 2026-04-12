import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { settingsTable } from "../schemas/settings.schema";

export type Setting = InferSelectModel<typeof settingsTable>;
export type InsertSetting = InferInsertModel<typeof settingsTable>;
