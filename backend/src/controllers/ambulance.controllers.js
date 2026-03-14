import { Ambulance } from "../models/ambulance.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// ─────────────────────────────────────────
// Create Ambulance
// hospital_admin only
// ─────────────────────────────────────────
export const createAmbulance = asyncHandler(async (req, res) => {

const { ambulanceCode, driverName, hospitalId } = req.body;

if (!ambulanceCode || !hospitalId)
throw new AppError("Ambulance code and hospital are required", 400);

const existing = await Ambulance.findOne({ ambulanceCode });

if (existing)
throw new AppError("Ambulance already exists", 409);

const ambulance = await Ambulance.create({
ambulanceCode,
driverName,
hospitalId
});

res.status(201).json({
status: "success",
ambulance
});

});

// ─────────────────────────────────────────
// Get All Ambulances
// ─────────────────────────────────────────
export const getAmbulances = asyncHandler(async (_req, res) => {

const ambulances = await Ambulance.find()
.populate("hospitalId", "name location");

res.status(200).json({
status: "success",
results: ambulances.length,
ambulances
});

});

// ─────────────────────────────────────────
// Get Single Ambulance
// ─────────────────────────────────────────
export const getAmbulanceById = asyncHandler(async (req, res) => {

const ambulance = await Ambulance.findById(req.params.id)
.populate("hospitalId", "name location");

if (!ambulance)
throw new AppError("Ambulance not found", 404);

res.status(200).json({
status: "success",
ambulance
});

});

// ─────────────────────────────────────────
// Update Ambulance
// ─────────────────────────────────────────
export const updateAmbulance = asyncHandler(async (req, res) => {

const ambulance = await Ambulance.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true, runValidators: true }
);

if (!ambulance)
throw new AppError("Ambulance not found", 404);

res.status(200).json({
status: "success",
ambulance
});

});

// ─────────────────────────────────────────
// Update Ambulance Location (GPS)
// Used for real-time tracking
// ─────────────────────────────────────────
export const updateAmbulanceLocation = asyncHandler(async (req, res) => {

const { lat, lng } = req.body;

if (!lat || !lng)
throw new AppError("Latitude and longitude required", 400);

const ambulance = await Ambulance.findById(req.params.id);

if (!ambulance)
throw new AppError("Ambulance not found", 404);

ambulance.location = {
type: "Point",
coordinates: [lng, lat]
};

await ambulance.save();

res.status(200).json({
status: "success",
message: "Location updated",
ambulance
});

});

// ─────────────────────────────────────────
// Dispatch Ambulance
// ─────────────────────────────────────────
export const dispatchAmbulance = asyncHandler(async (req, res) => {

const { emergencyId } = req.body;

const ambulance = await Ambulance.findById(req.params.id);

if (!ambulance)
throw new AppError("Ambulance not found", 404);

if (ambulance.status === "dispatched")
throw new AppError("Ambulance already dispatched", 400);

ambulance.status = "dispatched";
ambulance.currentEmergencyId = emergencyId;

await ambulance.save();

res.status(200).json({
status: "success",
message: "Ambulance dispatched",
ambulance
});

});

// ─────────────────────────────────────────
// Mark Ambulance Available
// ─────────────────────────────────────────
export const markAmbulanceAvailable = asyncHandler(async (req, res) => {

const ambulance = await Ambulance.findById(req.params.id);

if (!ambulance)
throw new AppError("Ambulance not found", 404);

ambulance.status = "available";
ambulance.currentEmergencyId = null;

await ambulance.save();

res.status(200).json({
status: "success",
message: "Ambulance available",
ambulance
});

});
