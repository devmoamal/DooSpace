import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { requestsTable } from "../schemas/requests.schema";

export type DooRequest = InferSelectModel<typeof requestsTable>;
export type InsertDooRequest = InferInsertModel<typeof requestsTable>;

