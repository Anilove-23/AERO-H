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

router.get("/", protect, getHospitals);

router.get("/:id", protect, getHospitalById);

router.post(
  "/",
  protect,
  restrict("admin"),
  createHospital
);

router.patch(
  "/:id",
  protect,
  restrict("admin"),
  updateHospital
);

router.delete(
  "/:id",
  protect,
  restrict("admin"),
  deleteHospital
);

router.get(
  "/nearby",
  protect,
  getNearbyHospitals
);

router.patch(
  "/:id/capacity",
  protect,
  restrict("hospital_admin"),
  updateHospitalCapacity
);

export default router;