import { BloodDonor } from "../models/bloodDonor.model.js";
import { BloodRequest } from "../models/bloodRequest.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// ─────────────────────────────────────────
// Register Blood Donor
// ─────────────────────────────────────────
export const registerDonor = asyncHandler(async (req, res) => {

const { name, bloodType, phone, lat, lng } = req.body;

if (!name || !bloodType)
throw new ApiError("Name and blood type required", 400);

const donor = await BloodDonor.create({
name,
bloodType,
phone,
location: {
type: "Point",
coordinates: [lng, lat]
}
});

res.status(201).json({
status: "success",
donor
});

});

// ─────────────────────────────────────────
// Get All Donors
// ─────────────────────────────────────────
export const getDonors = asyncHandler(async (_req, res) => {

const donors = await BloodDonor.find();

res.status(200).json({
status: "success",
results: donors.length,
donors
});

});

// ─────────────────────────────────────────
// Get Nearby Donors
// ─────────────────────────────────────────
export const getNearbyDonors = asyncHandler(async (req, res) => {

const { lat, lng, bloodType } = req.query;

if (!lat || !lng)
throw new ApiError("Latitude and longitude required", 400);

const donors = await BloodDonor.find({
bloodType,
location: {
$near: {
$geometry: {
type: "Point",
coordinates: [parseFloat(lng), parseFloat(lat)]
},
$maxDistance: 10000
}
}
});

res.status(200).json({
status: "success",
results: donors.length,
donors
});

});

// ─────────────────────────────────────────
// Request Blood
// ─────────────────────────────────────────
export const requestBlood = asyncHandler(async (req, res) => {

const { hospitalId, bloodType, unitsRequired, emergencyId } = req.body;

if (!hospitalId || !bloodType)
throw new ApiError("Hospital and blood type required", 400);

const request = await BloodRequest.create({
hospitalId,
bloodType,
unitsRequired,
emergencyId,
status: "open"
});

res.status(201).json({
status: "success",
request
});

});

// ─────────────────────────────────────────
// Complete Blood Request
// ─────────────────────────────────────────
export const completeBloodRequest = asyncHandler(async (req, res) => {

const request = await BloodRequest.findById(req.params.id);

if (!request)
throw new ApiError("Blood request not found", 404);

request.status = "fulfilled";

await request.save();

res.status(200).json({
status: "success",
request
});

});

