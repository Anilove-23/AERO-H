import { Router } from "express";

import {
  getLogs,
  getEmergencyLogs
} from "../controllers/log.controller.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/",
  protect,
  restrict("operator"),
  getLogs
);

router.get(
  "/emergency/:id",
  protect,
  restrict("operator"),
  getEmergencyLogs
);

export default router;