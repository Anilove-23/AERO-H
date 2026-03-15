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

router.get("/",  getDoctors);

router.get("/:id",  getDoctorById);

router.post(
  "/",
 
  createDoctor
);

router.patch(
  "/:id",
 
  updateDoctor
);

router.delete(
  "/:id",
  
  deleteDoctor
);

router.patch(
  "/:id/availability",
 
  updateDoctorAvailability
);

router.post(
  "/:id/assign",
 
  assignDoctorToEmergency
);

export default router;