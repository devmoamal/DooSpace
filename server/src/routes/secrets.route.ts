import { Hono } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { secretsService } from "@/services/secrets.service";
import Response from "@/lib/response";
import { type AuthEnv } from "@/context/auth.context";

const router = new Hono<AuthEnv>();

router.use("*", authMiddleware);

// List all secrets (values masked in response — only names exposed)
router.get("/", async (c) => {
  const userId = c.get("auth").id;
  const secrets = await secretsService.list(userId);
  // Mask values: expose name + metadata, not the raw value
  const masked = secrets.map(({ id, name, created_at, updated_at }) => ({
    id,
    name,
    created_at,
    updated_at,
  }));
  return Response.success(c, masked);
});

// Create or update a secret
router.post("/", async (c) => {
  const userId = c.get("auth").id;
  const { name, value } = await c.req.json();
  if (!name || !value) {
    return Response.error(c, "BAD_REQUEST", "name and value are required", 400);
  }
  try {
    const secret = await secretsService.set(userId, name.toUpperCase(), value);
    return Response.success(
      c,
      { id: secret.id, name: secret.name, created_at: secret.created_at, updated_at: secret.updated_at },
      "Secret saved",
      201
    );
  } catch (e: any) {
    return Response.error(c, "BAD_REQUEST", e.message, 400);
  }
});

// Delete a secret
router.delete("/:name", async (c) => {
  const userId = c.get("auth").id;
  const name = c.req.param("name");
  try {
    const result = await secretsService.delete(userId, name);
    return Response.success(c, result, "Secret deleted");
  } catch (e: any) {
    return Response.error(c, "NOT_FOUND", e.message, 404);
  }
});

export default router;
