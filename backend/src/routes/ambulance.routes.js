import { Router } from "express";

import {
createAmbulance,
getAmbulances,
getAmbulanceById,
updateAmbulance,
updateAmbulanceLocation,
dispatchAmbulance,
markAmbulanceAvailable
} from "../controllers/ambulance.controllers.js";

import { protect, restrict } from "../middlewares/auth.middleware.js";

const router = Router();

// ── Public / Shared ─────────────────────────────────────

// Get all ambulances
router.get("/", protect, getAmbulances);

// Get single ambulance
router.get("/:id", protect, getAmbulanceById);

// ── Hospital Admin Routes ───────────────────────────────

// Create ambulance
router.post(
"/",
protect,
restrict("hospital_admin"),
createAmbulance
);

// Update ambulance info
router.patch(
"/:id",
protect,
restrict("hospital_admin"),
updateAmbulance
);

// ── Real-Time Updates ───────────────────────────────────

// Update ambulance GPS location
router.patch(
"/:id/location",
protect,
updateAmbulanceLocation
);

// ── Emergency Operator Routes ───────────────────────────

// Dispatch ambulance to emergency
router.post(
"/:id/dispatch",
protect,
restrict("operator"),
dispatchAmbulance
);

// Mark ambulance available again
router.patch(
"/:id/available",
protect,
restrict("operator"),
markAmbulanceAvailable
);

export default router;
