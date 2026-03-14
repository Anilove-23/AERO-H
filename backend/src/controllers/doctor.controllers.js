import { Doctor } from "../models/doctor.model.js";
import { EmergencyCase } from "../models/emergency.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// ─────────────────────────────────────────
// Create Doctor
// hospital_admin
// ─────────────────────────────────────────
export const createDoctor = asyncHandler(async (req, res) => {

const { name, specialization, experienceLevel, hospitalId } = req.body;

if (!name || !specialization || !hospitalId)
throw new ApiError("Doctor name, specialization and hospital required", 400);

const doctor = await Doctor.create({
name,
specialization,
experienceLevel,
hospitalId
});

res.status(201).json({
status: "success",
doctor
});

});


// ─────────────────────────────────────────
// Get All Doctors
// ─────────────────────────────────────────
export const getDoctors = asyncHandler(async (_req, res) => {

const doctors = await Doctor.find()
.populate("hospitalId", "name location");

res.status(200).json({
status: "success",
results: doctors.length,
doctors
});

});


// ─────────────────────────────────────────
// Get Doctor By ID
// ─────────────────────────────────────────
export const getDoctorById = asyncHandler(async (req, res) => {

const doctor = await Doctor.findById(req.params.id)
.populate("hospitalId", "name");

if (!doctor)
throw new ApiError("Doctor not found", 404);

res.status(200).json({
status: "success",
doctor
});

});


// ─────────────────────────────────────────
// Update Doctor
// hospital_admin
// ─────────────────────────────────────────
export const updateDoctor = asyncHandler(async (req, res) => {

const doctor = await Doctor.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true, runValidators: true }
);

if (!doctor)
throw new ApiError("Doctor not found", 404);

res.status(200).json({
status: "success",
doctor
});

});


// ─────────────────────────────────────────
// Delete Doctor
// hospital_admin
// ─────────────────────────────────────────
export const deleteDoctor = asyncHandler(async (req, res) => {

const doctor = await Doctor.findByIdAndDelete(req.params.id);

if (!doctor)
throw new ApiError("Doctor not found", 404);

res.status(200).json({
status: "success",
message: "Doctor deleted"
});

});


// ─────────────────────────────────────────
// Update Doctor Availability
// ─────────────────────────────────────────
export const updateDoctorAvailability = asyncHandler(async (req, res) => {

const { available } = req.body;

const doctor = await Doctor.findById(req.params.id);

if (!doctor)
throw new ApiError("Doctor not found", 404);

doctor.available = available;

await doctor.save();

res.status(200).json({
status: "success",
doctor
});

});


// ─────────────────────────────────────────
// Assign Doctor To Emergency
// operator
// ─────────────────────────────────────────
export const assignDoctorToEmergency = asyncHandler(async (req, res) => {

const { emergencyId } = req.body;

const doctor = await Doctor.findById(req.params.id);

if (!doctor)
throw new ApiError("Doctor not found", 404);

if (!doctor.available)
throw new ApiError("Doctor not available", 400);

const emergency = await EmergencyCase.findById(emergencyId);

if (!emergency)
throw new ApiError("Emergency not found", 404);

doctor.available = false;
doctor.currentCaseId = emergency._id;

emergency.doctorId = doctor._id;
emergency.status = "doctor_assigned";

await doctor.save();
await emergency.save();

res.status(200).json({
status: "success",
emergency
});

});