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
router.get("/", getAmbulances);

// Get single ambulance
router.get("/:id", getAmbulanceById);

// ── Hospital Admin Routes ───────────────────────────────

// Create ambulance
router.post(
"/",

restrict("hospital_admin"),
createAmbulance
);

// Update ambulance info
router.patch(
"/:id",

restrict("hospital_admin"),
updateAmbulance
);

// ── Real-Time Updates ───────────────────────────────────

// Update ambulance GPS location
router.patch(
"/:id/location",

updateAmbulanceLocation
);

// ── Emergency Operator Routes ───────────────────────────

// Dispatch ambulance to emergency
router.post(
"/:id/dispatch",

restrict("operator"),
dispatchAmbulance
);

// Mark ambulance available again
router.patch(
"/:id/available",

restrict("operator"),
markAmbulanceAvailable
);

export default router;
