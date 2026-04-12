import { Hono } from "hono";
import { overviewService } from "@/services/overview.service";
import Response from "@/lib/response";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = new Hono();

// Protect all overview routes
router.use("*", authMiddleware);

router.get("/stats", async (c) => {
  const stats = await overviewService.getStats();
  return Response.success(c, stats);
});

router.get("/charts", async (c) => {
  const charts = await overviewService.getChartData();
  return Response.success(c, charts);
});

export default router;
