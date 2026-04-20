import { Hono } from "hono";
import { validateBody } from "@/middlewares/validate.middleware";
import { z } from "zod";
import { aiService } from "@/services/ai.service";
import Response from "@/lib/response";
import { API_ERROR_CODE } from "@doospace/shared";

const router = new Hono();

const ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })),
});

// List all AI providers
router.get("/providers", async (c) => {
  const providers = aiService.getProviders();
  return Response.success(c, providers);
});

// List models for a provider
router.get("/models/:provider", async (c) => {
  const provider = c.req.param("provider");
  try {
    const models = await aiService.fetchModels(provider);
    return Response.success(c, models);
  } catch (error: any) {
    return Response.error(c, API_ERROR_CODE.BAD_REQUEST, error.message || "Failed to fetch models", 400);
  }
});

// Chat with the agent
router.post("/chat", validateBody(ChatSchema), async (c) => {
  const { messages } = c.req.valid("json");
  try {
    const response = await aiService.chat(messages);
    return Response.success(c, response);
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return Response.error(c, API_ERROR_CODE.SERVER_ERROR, error.message || "AI execution failed", 500);
  }
});

export default router;
