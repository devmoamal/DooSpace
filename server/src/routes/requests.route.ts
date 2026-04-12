import { Hono } from "hono";
import { validateParams, validateQuery } from "@/middlewares/validate.middleware";
import { DooIdParamSchema, PaginationSchema } from "@doospace/shared";
import { requestService } from "@/services/request.service";
import Response from "@/lib/response";

import { authMiddleware } from "@/middlewares/auth.middleware";

const router = new Hono();

router.use("*", authMiddleware);

// List all logs (global)
router.get("/", validateQuery(PaginationSchema), async (c) => {
  const query = c.req.valid("query");
  const logs = await requestService.getAllLogs(query);
  return Response.success(c, logs);
});

// List logs for a specific Doo
router.get("/:doo_id", validateParams(DooIdParamSchema), validateQuery(PaginationSchema), async (c) => {
  const { doo_id } = c.req.valid("param");
  const query = c.req.valid("query");
  const logs = await requestService.getLogsByDooId(doo_id, query);
  return Response.success(c, logs);
});




export default router;
