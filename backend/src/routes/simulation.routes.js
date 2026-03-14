import { Router } from "express";

import {
  startSimulation,
  stopSimulation
} from "../controllers/simulation.controllers.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/start",
  protect,
  restrict("operator"),
  startSimulation
);

router.post(
  "/stop",
  protect,
  restrict("operator"),
  stopSimulation
);

export default router;