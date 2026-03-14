import { EmergencyCase } from "../models/emergency.model.js";
import { Ambulance } from "../models/ambulance.model.js";
import { Hospital } from "../models/hospital.model.js";
import { Doctor } from "../models/doctor.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { analyzeSymptoms } from "../services/gemini.service.js";
import { getAIAllocation } from "../services/aiAllocator.service.js";
import { generateEmergencyAudio } from "../services/emergencyAudio.service.js";

import { io } from "../server.js";


// ─────────────────────────────────────────
// Report Emergency
// ─────────────────────────────────────────
export const reportEmergency = asyncHandler(async (req, res) => {

  const { symptoms, lat, lng } = req.body;

  if (!symptoms || lat === undefined || lng === undefined) {
    throw new ApiError("Symptoms and location required", 400);
  }

  console.log("🚨 Emergency reported:", symptoms);
  console.log("📍 Location:", lat, lng);

  // ── Phase 1: Gemini Neural Triage
  const triage = await analyzeSymptoms(symptoms);

  console.log("🧠 Triage result:", triage);

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

  // 🔴 REALTIME EVENT
  io.emit("emergency:new", {
    emergencyId: emergency._id,
    symptoms,
    location: { lat, lng },
    severity: triage.severityScore,
    priority: triage.priority
  });

  // ── Fetch Available Resources
  const [hospitals, doctors, ambulances] = await Promise.all([
    Hospital.find(),
    Doctor.find({ available: true }),
    Ambulance.find({ status: "available" })
  ]);

  let allocation;

  // ── Phase 2: AI Allocation Engine
  try {

    allocation = await getAIAllocation(
      symptoms,
      lat,
      lng,
      triage,
      hospitals,
      doctors,
      ambulances
    );

  } catch (err) {

    console.log("⚠️ AI service failed — fallback activated");

    allocation = {
      hospitalId: hospitals?.[0]?._id,
      ambulanceId: ambulances?.[0]?._id,
      doctorId: doctors?.[0]?._id
    };
  }

  console.log("🏥 AI hospital:", allocation?.hospitalId);
  console.log("🚑 AI ambulance:", allocation?.ambulanceId);
  console.log("👨‍⚕️ AI doctor:", allocation?.doctorId);

  let ambulance = null;
  let doctor = null;
  let hospital = null;


  // ─────────────────────────
  // Assign Hospital
  // ─────────────────────────
  if (allocation?.hospitalId) {

    hospital = await Hospital.findById(allocation.hospitalId);

    if (hospital) {

      emergency.hospitalId = hospital._id;

      io.emit("hospital:assigned", {
        emergencyId: emergency._id,
        hospitalId: hospital._id,
        hospitalName: hospital.name
      });
    }
  }


  // ─────────────────────────
  // Assign Ambulance
  // ─────────────────────────
  if (allocation?.ambulanceId) {

    ambulance = await Ambulance.findById(allocation.ambulanceId);

    if (ambulance && ambulance.status === "available") {

      ambulance.status = "dispatched";
      ambulance.currentEmergencyId = emergency._id;

      // ✅ FIX: ensure hospitalId exists before saving
      if (!ambulance.hospitalId) {

        if (allocation?.hospitalId) {
          ambulance.hospitalId = allocation.hospitalId;
        }

        else if (hospital?._id) {
          ambulance.hospitalId = hospital._id;
        }

        else if (emergency?.hospitalId) {
          ambulance.hospitalId = emergency.hospitalId;
        }

      }

      await ambulance.save();

      emergency.ambulanceId = ambulance._id;
      emergency.status = "ambulance_assigned";

      io.emit("ambulance:dispatched", {
        emergencyId: emergency._id,
        ambulanceId: ambulance._id,
        ambulanceCode: ambulance.ambulanceCode
      });
    }
  }


  // ─────────────────────────
  // Assign Doctor
  // ─────────────────────────
  if (allocation?.doctorId) {

    doctor = await Doctor.findById(allocation.doctorId);

    if (doctor && doctor.available) {

      doctor.available = false;
      doctor.currentCaseId = emergency._id;

      await doctor.save();

      emergency.doctorId = doctor._id;

      io.emit("doctor:assigned", {
        emergencyId: emergency._id,
        doctorId: doctor._id,
        doctorName: doctor.name
      });
    }
  }

  await emergency.save();

  // ─────────────────────────
  // Dynamic Emergency Audio Response
  // ─────────────────────────
  let audio = null;

  const audioText = `
Emergency detected.
Priority level is ${triage.priority}.
Possible condition is ${triage.possibleCondition || "under evaluation"}.
${hospital ? `Nearest hospital assigned is ${hospital.name}.` : "Hospital is being assigned."}
${ambulance ? "An ambulance has been dispatched to your location." : "Ambulance dispatch is in progress."}
${doctor ? `Doctor ${doctor.name} has been assigned.` : "Doctor assignment is in progress."}
Please remain calm and follow first aid instructions.
`;

  try {
    audio = await generateEmergencyAudio(audioText);
  } catch (err) {
    console.log("⚠️ Emergency audio generation failed:", err.message);
    audio = null;
  }

  res.status(201).json({
    status: "success",
    message: "Emergency reported and AI resources allocated",
    emergency,
    audioText,
    audio
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

  io.emit("emergency:statusUpdate", emergency);

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

  if (!emergency) throw new ApiError("Emergency not found", 404);
  if (!hospital) throw new ApiError("Hospital not found", 404);

  emergency.hospitalId = hospitalId;
  emergency.status = "hospital_assigned";

  await emergency.save();

  io.emit("hospital:assigned", {
    emergencyId: emergency._id,
    hospitalId: hospital._id,
    hospitalName: hospital.name
  });

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

  if (!emergency) throw new ApiError("Emergency not found", 404);
  if (!ambulance) throw new ApiError("Ambulance not found", 404);

  if (ambulance.status !== "available") {
    throw new ApiError("Ambulance not available", 400);
  }

  ambulance.status = "dispatched";
  ambulance.currentEmergencyId = emergency._id;

  emergency.ambulanceId = ambulanceId;
  emergency.status = "ambulance_dispatched";

  await Promise.all([
    ambulance.save(),
    emergency.save()
  ]);

  io.emit("ambulance:dispatched", {
    emergencyId: emergency._id,
    ambulanceId: ambulance._id
  });

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

  if (!emergency) throw new ApiError("Emergency not found", 404);
  if (!doctor) throw new ApiError("Doctor not found", 404);

  if (!doctor.available) {
    throw new ApiError("Doctor not available", 400);
  }

  doctor.available = false;
  doctor.currentCaseId = emergency._id;

  emergency.doctorId = doctorId;
  emergency.status = "doctor_assigned";

  await Promise.all([
    doctor.save(),
    emergency.save()
  ]);

  io.emit("doctor:assigned", {
    emergencyId: emergency._id,
    doctorId: doctor._id
  });

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

  io.emit("emergency:closed", {
    emergencyId: emergency._id
  });

  res.status(200).json({
    status: "success",
    message: "Emergency closed",
    emergency
  });
});