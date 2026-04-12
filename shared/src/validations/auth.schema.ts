import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const RefreshSchema = z.object({
  refreshToken: z.string(),
});
