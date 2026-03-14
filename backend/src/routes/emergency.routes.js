import { Router } from "express";

import {
  reportEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergencyStatus,
  assignHospital,
  assignAmbulance,
  assignDoctor,
  closeEmergency
} from "../controllers/emergency.controllers.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, reportEmergency);

router.get("/", protect, getEmergencies);

router.get("/:id", protect, getEmergencyById);

router.patch(
  "/:id/status",
  protect,
  restrict("operator"),
  updateEmergencyStatus
);

router.post(
  "/:id/assign-hospital",
  protect,
  restrict("operator"),
  assignHospital
);

router.post(
  "/:id/assign-ambulance",
  protect,
  restrict("operator"),
  assignAmbulance
);

router.post(
  "/:id/assign-doctor",
  protect,
  restrict("operator"),
  assignDoctor
);

router.post(
  "/:id/close",
  protect,
  restrict("doctor", "operator"),
  closeEmergency
);

export default router;