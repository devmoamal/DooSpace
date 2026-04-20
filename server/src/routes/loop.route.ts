import { Hono } from "hono";
import { loopService } from "@/services/loop.service";
import { z } from "zod";
import { validateBody } from "@/middlewares/validate.middleware";
import Response from "@/lib/response";

const loopRoute = new Hono();

loopRoute.get("/", async (c) => {
  const page = Number(c.req.query("page") || "1");
  const limit = Number(c.req.query("limit") || "10");
  const doo_id = c.req.query("doo_id")
    ? Number(c.req.query("doo_id"))
    : undefined;

  const result = await loopService.getAllLoops({ page, limit, doo_id });
  return Response.success(c, result);
});

loopRoute.get("/:id", async (c) => {
  const id = c.req.param("id");
  const loop = await loopService.getLoopById(id);
  return Response.success(c, loop);
});

loopRoute.get("/:id/logs", async (c) => {
  const id = c.req.param("id");
  const page = Number(c.req.query("page") || "1");
  const limit = Number(c.req.query("limit") || "20");
  const result = await loopService.getLoopLogs(id, { page, limit });
  return Response.success(c, result);
});

loopRoute.post(
  "/",
  validateBody(
    z.object({
      doo_id: z.number(),
      type: z.enum(["interval", "cron", "once", "event"]),
      interval_ms: z.number().optional(),
      cron_expr: z.string().optional(),
      payload: z.any().optional(),
      target_path: z.string(),
      end_expression: z.string().optional(),
      max_retries: z.number().optional(),
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const loop = await loopService.createLoop(data as any);
    return Response.success(c, loop);
  },
);

loopRoute.patch(
  "/:id/status",
  validateBody(
    z.object({
      status: z.enum(["active", "paused"]),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const { status } = c.req.valid("json");
    const loop = await loopService.updateLoop(id, { status });
    return Response.success(c, loop);
  },
);

loopRoute.patch(
  "/:id",
  validateBody(
    z.object({
      type: z.enum(["interval", "cron", "once", "event"]).optional(),
      interval_ms: z.number().optional(),
      cron_expr: z.string().optional(),
      payload: z.any().optional(),
      target_path: z.string().optional(),
      end_expression: z.string().optional(),
      max_retries: z.number().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const loop = await loopService.updateLoop(id, data as any);
    return Response.success(c, loop);
  },
);

loopRoute.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await loopService.deleteLoop(id);
  return Response.success(c, null, "Loop deleted");
});

export default loopRoute;
