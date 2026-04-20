import { Hono } from "hono";
import doosRoutes from "./doos.route";
import requestsRoutes from "./requests.route";
import settingsRoutes from "./settings.route";
import authRoutes from "./auth.route";
import dooboxRoutes from "./doobox.route";
import overviewRoutes from "./overview.route";
import secretsRoutes from "./secrets.route";
import loopRoute from "./loop.route";
import aiRoutes from "./ai.route";

const router = new Hono();

router.route("/auth", authRoutes);
router.route("/doos", doosRoutes);
router.route("/requests", requestsRoutes);
router.route("/settings", settingsRoutes);
router.route("/doobox", dooboxRoutes);
router.route("/overview", overviewRoutes);
router.route("/secrets", secretsRoutes);
router.route("/loops", loopRoute);
router.route("/ai", aiRoutes);

export default router;



