import { Hospital } from "../models/hospital.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// ─────────────────────────────────────────
// Create Hospital
// admin
// ─────────────────────────────────────────
export const createHospital = asyncHandler(async (req, res) => {

const { name, address, lat, lng, contactNumber } = req.body;

if (!name || !lat || !lng)
throw new ApiError("Hospital name and location required", 400);

const hospital = await Hospital.create({
name,
address,
contactNumber,
location: {
type: "Point",
coordinates: [lng, lat]
}
});

res.status(201).json({
status: "success",
hospital
});

});

// ─────────────────────────────────────────
// Get All Hospitals
// ─────────────────────────────────────────
export const getHospitals = asyncHandler(async (_req, res) => {

const hospitals = await Hospital.find();

res.status(200).json({
status: "success",
results: hospitals.length,
hospitals
});

});

// ─────────────────────────────────────────
// Get Hospital By ID
// ─────────────────────────────────────────
export const getHospitalById = asyncHandler(async (req, res) => {

const hospital = await Hospital.findById(req.params.id);

if (!hospital)
throw new ApiError("Hospital not found", 404);

res.status(200).json({
status: "success",
hospital
});

});

// ─────────────────────────────────────────
// Update Hospital
// admin
// ─────────────────────────────────────────
export const updateHospital = asyncHandler(async (req, res) => {

const hospital = await Hospital.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true, runValidators: true }
);

if (!hospital)
throw new ApiError("Hospital not found", 404);

res.status(200).json({
status: "success",
hospital
});

});

// ─────────────────────────────────────────
// Delete Hospital
// admin
// ─────────────────────────────────────────
export const deleteHospital = asyncHandler(async (req, res) => {

const hospital = await Hospital.findByIdAndDelete(req.params.id);

if (!hospital)
throw new ApiError("Hospital not found", 404);

res.status(200).json({
status: "success",
message: "Hospital deleted"
});

});

// ─────────────────────────────────────────
// Get Nearby Hospitals
// Uses MongoDB Geo Query
// ─────────────────────────────────────────
export const getNearbyHospitals = asyncHandler(async (req, res) => {

const { lat, lng } = req.query;

if (!lat || !lng)
throw new ApiError("Latitude and longitude required", 400);

const hospitals = await Hospital.find({
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
results: hospitals.length,
hospitals
});

});

// ─────────────────────────────────────────
// Update Hospital Capacity
// hospital_admin
// ─────────────────────────────────────────
export const updateHospitalCapacity = asyncHandler(async (req, res) => {

const { icuBedsAvailable, erCapacity, ventilatorsAvailable } = req.body;

const hospital = await Hospital.findById(req.params.id);

if (!hospital)
throw new ApiError("Hospital not found", 404);

if (icuBedsAvailable !== undefined)
hospital.icuBedsAvailable = icuBedsAvailable;

if (erCapacity !== undefined)
hospital.erCapacity = erCapacity;

if (ventilatorsAvailable !== undefined)
hospital.ventilatorsAvailable = ventilatorsAvailable;

await hospital.save();

res.status(200).json({
status: "success",
hospital
});

});

