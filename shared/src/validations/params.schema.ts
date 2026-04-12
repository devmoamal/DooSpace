import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.coerce.number().int(),
});

export const DooIdParamSchema = z.object({
  doo_id: z.coerce.number().int(),
});

export type IdParam = z.infer<typeof IdParamSchema>;
export type DooIdParam = z.infer<typeof DooIdParamSchema>;

