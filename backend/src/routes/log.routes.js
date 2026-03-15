import { Router } from "express";

import {
  getLogs,
  getEmergencyLogs
} from "../controllers/log.controller.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/",
 
  getLogs
);

router.get(
  "/emergency/:id",
  
  getEmergencyLogs
);

export default router;