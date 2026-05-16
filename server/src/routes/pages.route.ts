import { Hono } from "hono";
import {
  validateBody,
  validateParams,
} from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  CreatePageSchema,
  PageChatSchema,
} from "@doospace/shared";
import { pageService } from "@/services/page.service";
import Response from "@/lib/response";
import { z } from "zod";

const router = new Hono();

const PageIdParamSchema = z.object({
  id: z.string().uuid(),
});

// List all pages
router.get("/", authMiddleware, async (c) => {
  const auth = c.get("auth");
  const pages = await pageService.listPages(auth.id);
  return Response.success(c, pages);
});

// Get one page + messages
router.get("/:id", authMiddleware, validateParams(PageIdParamSchema), async (c) => {
  const { id } = c.req.valid("param");
  const page = await pageService.getPage(id);
  const messages = await pageService.getMessages(id);
  return Response.success(c, { page, messages });
});

// Create page
router.post("/", authMiddleware, validateBody(CreatePageSchema), async (c) => {
  const { name } = c.req.valid("json");
  const auth = c.get("auth");
  const newPage = await pageService.createPage(auth.id, name);
  return Response.success(c, newPage, "Page created successfully", 201);
});

// Delete page
router.delete("/:id", authMiddleware, validateParams(PageIdParamSchema), async (c) => {
  const { id } = c.req.valid("param");
  await pageService.deletePage(id);
  return Response.success(c, null, "Page deleted successfully");
});

// Chat with the agent for a specific page
router.post("/:id/chat", authMiddleware, validateParams(PageIdParamSchema), validateBody(PageChatSchema), async (c) => {
  const { id } = c.req.valid("param");
  const { message } = c.req.valid("json");
  
  try {
    const aiResponse = await pageService.chat(id, message);
    return Response.success(c, aiResponse);
  } catch (error: any) {
    console.error("Page Chat Error:", error);
    return Response.error(c, "SERVER_ERROR", error.message || "AI execution failed", 500);
  }
});

// Serve the page content
router.get("/:id/serve", async (c) => {
  const id = c.req.param("id");
  try {
    const page = await pageService.getPage(id);
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.name}</title>
    <!-- Tailwind CSS v4 is recommended for the V0 architect -->
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
</head>
<body class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
    ${page.html}
</body>
</html>
    `;
    
    return c.html(html);
  } catch (error) {
    return c.html("<h1>Page Not Found</h1>", 404);
  }
});

export default router;
