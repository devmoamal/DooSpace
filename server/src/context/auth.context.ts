import { JWTMiniAppPayload } from "@/lib/types/jwt";
import { type Context } from "hono";

export type AuthEnv = {
  Variables: {
    auth: JWTMiniAppPayload;
  };
};

export type AuthCtx = Context<AuthEnv>;
