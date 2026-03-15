import { Router } from "express";

import {
  startSimulation,
  stopSimulation
} from "../controllers/simulation.controllers.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/start",
 
  startSimulation
);

router.post(
  "/stop",
  
  stopSimulation
);

export default router;