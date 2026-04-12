import { Context, Next } from "hono";

/**
 * Middleware to trim trailing slashes from the request path.
 * e.g., /doos/3/ -> /doos/3
 */
export const trimSlash = async (c: Context, next: Next) => {
  const url = new URL(c.req.url);

  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
    return c.redirect(url.toString(), 301);
  }

  await next();
};
