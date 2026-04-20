import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { loopLogsTable } from "../schemas/loop_logs.schema";

export type LoopLog = InferSelectModel<typeof loopLogsTable>;
export type InsertLoopLog = InferInsertModel<typeof loopLogsTable>;
