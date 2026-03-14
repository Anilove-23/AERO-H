import { Router } from "express";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  updateDoctorAvailability,
  assignDoctorToEmergency
} from "../controllers/doctor.controllers.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protect, getDoctors);

router.get("/:id", protect, getDoctorById);

router.post(
  "/",
  protect,
  restrict("hospital_admin"),
  createDoctor
);

router.patch(
  "/:id",
  protect,
  restrict("hospital_admin"),
  updateDoctor
);

router.delete(
  "/:id",
  protect,
  restrict("hospital_admin"),
  deleteDoctor
);

router.patch(
  "/:id/availability",
  protect,
  updateDoctorAvailability
);

router.post(
  "/:id/assign",
  protect,
  restrict("operator"),
  assignDoctorToEmergency
);

export default router;