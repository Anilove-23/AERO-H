import { Router } from "express";

import {
  registerDonor,
  getDonors,
  getNearbyDonors,
  requestBlood,
  completeBloodRequest
} from "../controllers/blood.controllers.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/donors", protect, registerDonor);

router.get("/donors", protect, getDonors);

router.get("/donors/nearby", protect, getNearbyDonors);

router.post("/request", protect, requestBlood);

router.patch("/request/:id/complete", protect, completeBloodRequest);

export default router;