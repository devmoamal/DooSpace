import { z } from "zod";

export const CreatePageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export const PageChatSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const UpdatePageCodeSchema = z.object({
  html: z.string().optional(),
  css: z.string().optional(),
  js: z.string().optional(),
});
