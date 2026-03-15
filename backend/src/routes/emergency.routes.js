import { Router } from "express";

import {
  reportEmergency,
  getEmergencies,
  getEmergencyById,
  updateEmergencyStatus,
  assignHospital,
  assignAmbulance,
  assignDoctor,
  closeEmergency,
  upload
} from "../controllers/emergency.controllers.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

/* -------- FIX: attach multer -------- */
router.post("/", upload.single("file"), reportEmergency);

router.get("/", getEmergencies);

router.get("/:id", getEmergencyById);

router.patch(
  "/:id/status",
  updateEmergencyStatus
);

router.post(
  "/:id/assign-hospital",
  assignHospital
);

router.post(
  "/:id/assign-ambulance",
  assignAmbulance
);

router.post(
  "/:id/assign-doctor",
  assignDoctor
);

router.post(
  "/:id/close",
  closeEmergency
);

export default router;