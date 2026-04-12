import { Hono } from "hono";
import { authService } from "@/services/auth.service";
import { validateBody } from "@/middlewares/validate.middleware";
import { LoginSchema, RefreshSchema } from "@doospace/shared";
import Response from "@/lib/response";

const router = new Hono();

router.post("/login", validateBody(LoginSchema), async (c) => {
  const { username, password } = c.req.valid("json");
  const result = await authService.login(username, password);
  return Response.success(c, result, "Login successful");
});

router.post("/refresh", validateBody(RefreshSchema), async (c) => {
  const { refreshToken } = c.req.valid("json");
  const result = await authService.refresh(refreshToken);
  return Response.success(c, result, "Token refreshed");
});

export default router;
