import { Router } from "express";

import {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
  getNearbyHospitals,
  updateHospitalCapacity
} from "../controllers/hospital.controllers.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/",  getHospitals);

router.get("/:id",  getHospitalById);

router.post(
  "/",
 
  createHospital
);

router.patch(
  "/:id",
 
  updateHospital
);

router.delete(
  "/:id",
 
  deleteHospital
);

router.get(
  "/nearby",
 
  getNearbyHospitals
);

router.patch(
  "/:id/capacity",
 
  updateHospitalCapacity
);

export default router;