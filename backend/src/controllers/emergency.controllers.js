import { EmergencyCase } from "../models/emergency.model.js";
import { Ambulance } from "../models/ambulance.model.js";
import { Hospital } from "../models/hospital.model.js";
import { Doctor } from "../models/doctor.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { analyzeSymptoms } from "../services/gemini.service.js";
import { getAIAllocation } from "../services/aiAllocator.service.js";


// ─────────────────────────────────────────
// Report Emergency
// ─────────────────────────────────────────
export const reportEmergency = asyncHandler(async (req, res) => {

  const { symptoms, lat, lng } = req.body;

  if (!symptoms || lat === undefined || lng === undefined) {
    throw new ApiError("Symptoms and location required", 400);
  }

  // ── Phase 1: Gemini Neural Triage
  const triage = await analyzeSymptoms(symptoms);

  // ── Create Emergency Case
  const emergency = await EmergencyCase.create({
    reportedBy: req.user._id,
    symptoms,
    severityScore: triage.severityScore,
    priority: triage.priority,
    requiredSpecialization: triage.requiredSpecialization,
    location: {
      type: "Point",
      coordinates: [lng, lat]
    },
    status: "reported"
  });

  // ── Fetch Available Resources
  const [hospitals, doctors, ambulances] = await Promise.all([
    Hospital.find(),
    Doctor.find({ available: true }),
    Ambulance.find({ status: "available" })
  ]);

  // ── Phase 2: AI Allocation Engine
  const allocation = await getAIAllocation(
    symptoms,
    lat,
    lng,
    triage,          // ✅ FIXED
    hospitals,
    doctors,
    ambulances
  );

  let ambulance = null;
  let doctor = null;
  let hospital = null;

  // ── Assign Ambulance
  if (allocation?.ambulanceId) {

    ambulance = await Ambulance.findById(allocation.ambulanceId);

    if (ambulance && ambulance.status === "available") {

      ambulance.status = "dispatched";
      ambulance.currentEmergencyId = emergency._id;

      await ambulance.save();

      emergency.ambulanceId = ambulance._id;
      emergency.status = "ambulance_assigned";
    }
  }

  // ── Assign Hospital
  if (allocation?.hospitalId) {

    hospital = await Hospital.findById(allocation.hospitalId);

    if (hospital) {
      emergency.hospitalId = hospital._id;
    }
  }

  // ── Assign Doctor
  if (allocation?.doctorId) {

    doctor = await Doctor.findById(allocation.doctorId);

    if (doctor && doctor.available) {

      doctor.available = false;
      doctor.currentCaseId = emergency._id;

      await doctor.save();

      emergency.doctorId = doctor._id;
    }
  }

  await emergency.save();

  res.status(201).json({
    status: "success",
    message: "Emergency reported and AI resources allocated",
    emergency
  });

});


// ─────────────────────────────────────────
// Get All Emergencies
// ─────────────────────────────────────────
export const getEmergencies = asyncHandler(async (_req, res) => {

  const emergencies = await EmergencyCase.find()
    .populate("reportedBy", "name")
    .populate("hospitalId", "name")
    .populate("doctorId", "name specialization")
    .populate("ambulanceId", "ambulanceCode");

  res.status(200).json({
    status: "success",
    results: emergencies.length,
    emergencies
  });

});


// ─────────────────────────────────────────
// Get Emergency By ID
// ─────────────────────────────────────────
export const getEmergencyById = asyncHandler(async (req, res) => {

  const emergency = await EmergencyCase.findById(req.params.id)
    .populate("reportedBy", "name")
    .populate("hospitalId")
    .populate("doctorId")
    .populate("ambulanceId");

  if (!emergency) {
    throw new ApiError("Emergency not found", 404);
  }

  res.status(200).json({
    status: "success",
    emergency
  });

});


// ─────────────────────────────────────────
// Update Emergency Status
// ─────────────────────────────────────────
export const updateEmergencyStatus = asyncHandler(async (req, res) => {

  const emergency = await EmergencyCase.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!emergency) {
    throw new ApiError("Emergency not found", 404);
  }

  res.status(200).json({
    status: "success",
    emergency
  });

});


// ─────────────────────────────────────────
// Assign Hospital (Manual Override)
// ─────────────────────────────────────────
export const assignHospital = asyncHandler(async (req, res) => {

  const { hospitalId } = req.body;

  const [emergency, hospital] = await Promise.all([
    EmergencyCase.findById(req.params.id),
    Hospital.findById(hospitalId)
  ]);

  if (!emergency) {
    throw new ApiError("Emergency not found", 404);
  }

  if (!hospital) {
    throw new ApiError("Hospital not found", 404);
  }

  emergency.hospitalId = hospitalId;
  emergency.status = "triaged";

  await emergency.save();

  res.status(200).json({
    status: "success",
    message: "Hospital assigned manually",
    emergency
  });

});


// ─────────────────────────────────────────
// Assign Ambulance (Manual Override)
// ─────────────────────────────────────────
export const assignAmbulance = asyncHandler(async (req, res) => {

  const { ambulanceId } = req.body;

  const [emergency, ambulance] = await Promise.all([
    EmergencyCase.findById(req.params.id),
    Ambulance.findById(ambulanceId)
  ]);

  if (!emergency) {
    throw new ApiError("Emergency not found", 404);
  }

  if (!ambulance) {
    throw new ApiError("Ambulance not found", 404);
  }

  if (ambulance.status !== "available") {
    throw new ApiError("Ambulance not available", 400);
  }

  ambulance.status = "dispatched";
  ambulance.currentEmergencyId = emergency._id;

  emergency.ambulanceId = ambulanceId;
  emergency.status = "ambulance_assigned";

  await Promise.all([
    ambulance.save(),
    emergency.save()
  ]);

  res.status(200).json({
    status: "success",
    message: "Ambulance dispatched manually",
    emergency
  });

});


// ─────────────────────────────────────────
// Assign Doctor (Manual Override)
// ─────────────────────────────────────────
export const assignDoctor = asyncHandler(async (req, res) => {

  const { doctorId } = req.body;

  const [emergency, doctor] = await Promise.all([
    EmergencyCase.findById(req.params.id),
    Doctor.findById(doctorId)
  ]);

  if (!emergency) {
    throw new ApiError("Emergency not found", 404);
  }

  if (!doctor) {
    throw new ApiError("Doctor not found", 404);
  }

  if (!doctor.available) {
    throw new ApiError("Doctor not available", 400);
  }

  doctor.available = false;
  doctor.currentCaseId = emergency._id;

  emergency.doctorId = doctorId;
  emergency.status = "treated";

  await Promise.all([
    doctor.save(),
    emergency.save()
  ]);

  res.status(200).json({
    status: "success",
    message: "Doctor assigned manually",
    emergency
  });

});


// ─────────────────────────────────────────
// Close Emergency
// ─────────────────────────────────────────
export const closeEmergency = asyncHandler(async (req, res) => {

  const emergency = await EmergencyCase.findByIdAndUpdate(
    req.params.id,
    { status: "closed" },
    { new: true }
  );

  if (!emergency) {
    throw new ApiError("Emergency not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Emergency closed",
    emergency
  });

});