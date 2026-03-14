import { Router } from "express";

import {
  getOverviewStats,
  getHospitalStatus,
  getActiveEmergencies,
  getAmbulanceLocations,
  getDoctorsOnDuty
} from "../controllers/dashboard.controller.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/overview",
  protect,
  restrict("operator"),
  getOverviewStats
);

router.get(
  "/hospitals",
  protect,
  restrict("operator"),
  getHospitalStatus
);

router.get(
  "/emergencies",
  protect,
  restrict("operator"),
  getActiveEmergencies
);

router.get(
  "/ambulances",
  protect,
  restrict("operator"),
  getAmbulanceLocations
);

router.get(
  "/doctors",
  protect,
  restrict("operator"),
  getDoctorsOnDuty
);

export default router;