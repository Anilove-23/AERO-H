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

 
  getOverviewStats
);

router.get(
  "/hospitals",

 
  getHospitalStatus
);

router.get(
  "/emergencies",
 
  
  getActiveEmergencies
);

router.get(
  "/ambulances",
 
  
  getAmbulanceLocations
);

router.get(
  "/doctors",
 
  
  getDoctorsOnDuty
);

export default router;