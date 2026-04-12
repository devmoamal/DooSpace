import { z } from "zod";

export const MethodSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
]);

export const EndpointSchema = z.object({
  method: MethodSchema,
  path: z.string().min(1),
});

export const DooSchema = z.object({
  id: z.optional(z.number()), // Integer ID
  name: z.string().min(1),
  is_active: z.boolean().default(true),
  description: z.optional(z.string()),
  endpoints: z.array(EndpointSchema).optional().default([]),
  code: z.string().min(1),
  created_at: z.optional(z.date()),
  updated_at: z.optional(z.date()),
});




export type Method = z.infer<typeof MethodSchema>;
export type Endpoint = z.infer<typeof EndpointSchema>;
export type Doo = z.infer<typeof DooSchema>;

