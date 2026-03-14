import { EmergencyCase } from "../models/emergency.model.js";
import { Hospital } from "../models/hospital.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// ─────────────────────────────────────────
// Start Simulation
// operator
// Creates multiple simulated emergencies
// ─────────────────────────────────────────
export const startSimulation = asyncHandler(async (req, res) => {

const { type, patients, lat, lng } = req.body;

if (!type || !patients)
throw new ApiError("Simulation type and patient count required", 400);

const emergencies = [];

for (let i = 0; i < patients; i++) {

const emergency = await EmergencyCase.create({
  symptoms: `Simulation: ${type}`,
  status: "reported",
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  isSimulation: true
});

emergencies.push(emergency);

}

res.status(201).json({
status: "success",
message: "Simulation started",
createdEmergencies: emergencies.length,
emergencies
});

});


// ─────────────────────────────────────────
// Stop Simulation
// Removes all simulated emergencies
// ─────────────────────────────────────────
export const stopSimulation = asyncHandler(async (_req, res) => {

const result = await EmergencyCase.deleteMany({
isSimulation: true
});

res.status(200).json({
status: "success",
message: "Simulation stopped",
removed: result.deletedCount
});

});