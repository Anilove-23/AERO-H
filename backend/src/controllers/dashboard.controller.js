import { EmergencyCase } from "../models/emergency.model.js";
import { Ambulance } from "../models/ambulance.model.js";
import { Hospital } from "../models/hospital.model.js";
import { Doctor } from "../models/doctor.model.js";

import asyncHandler from "../utils/asyncHandler.js";

// ─────────────────────────────────────────
// Overview Stats
// Used for operator dashboard summary
// ─────────────────────────────────────────
export const getOverviewStats = asyncHandler(async (_req, res) => {

const activeEmergencies = await EmergencyCase.countDocuments({
status: { $ne: "closed" }
});

const ambulancesAvailable = await Ambulance.countDocuments({
status: "available"
});

const doctorsOnDuty = await Doctor.countDocuments({
available: true
});

const hospitals = await Hospital.countDocuments();

res.status(200).json({
status: "success",
stats: {
activeEmergencies,
ambulancesAvailable,
doctorsOnDuty,
hospitals
}
});

});


// ─────────────────────────────────────────
// Hospital Status
// Shows ICU capacity etc
// ─────────────────────────────────────────
export const getHospitalStatus = asyncHandler(async (_req, res) => {

const hospitals = await Hospital.find().select(
"name icuBedsAvailable erCapacity ventilatorsAvailable location"
);

res.status(200).json({
status: "success",
hospitals
});

});


// ─────────────────────────────────────────
// Active Emergencies
// ─────────────────────────────────────────
export const getActiveEmergencies = asyncHandler(async (_req, res) => {

const emergencies = await EmergencyCase.find({
status: { $ne: "closed" }
})
.populate("hospitalId", "name")
.populate("doctorId", "name")
.populate("ambulanceId");

res.status(200).json({
status: "success",
results: emergencies.length,
emergencies
});

});


// ─────────────────────────────────────────
// Ambulance Locations
// Used for live map
// ─────────────────────────────────────────
export const getAmbulanceLocations = asyncHandler(async (_req, res) => {

const ambulances = await Ambulance.find().select(
"ambulanceCode status location"
);

res.status(200).json({
status: "success",
ambulances
});

});


// ─────────────────────────────────────────
// Doctors On Duty
// ─────────────────────────────────────────
export const getDoctorsOnDuty = asyncHandler(async (_req, res) => {

const doctors = await Doctor.find({
available: true
}).select("name specialization hospitalId");

res.status(200).json({
status: "success",
doctors
});

});