import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.string().optional().transform((v) => parseInt(v || "1", 10)).pipe(z.number().min(1)),
  limit: z.string().optional().transform((v) => parseInt(v || "10", 10)).pipe(z.number().min(1).max(100)),
  search: z.string().optional(),
  status: z.enum(["all", "active", "inactive"]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

export type PaginationQuery = z.infer<typeof PaginationSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}
