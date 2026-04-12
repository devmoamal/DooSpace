import { createMiddleware } from "hono/factory";
import { JWT } from "@/lib/jwt";
import { UnauthorizedError } from "@/lib/error";
import { type AuthEnv } from "@/context/auth.context";

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized: Missing or invalid token");
  }

  const token = authHeader.split(" ")[1];
  const payload = JWT.verifyAccessToken(token);

  if (!payload) {
    throw new UnauthorizedError("Unauthorized: Invalid or expired token");
  }

  // Attach user identity to context as 'auth'
  c.set("auth", payload);

  await next();
});
