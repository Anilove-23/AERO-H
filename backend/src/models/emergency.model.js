import mongoose from "mongoose";

const emergencyCaseSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    symptoms: {
      type: String,
      required: true,
      trim: true
    },

    severityScore: {
      type: Number,
      min: 0,
      max: 100
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },

    requiredSpecialization: {
      type: String,
      trim: true
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null
    },

    ambulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance",
      default: null
    },

    isSimulation: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: [
        "reported",
        "triaged",
        "ambulance_assigned",
        "in_transit",
        "treated",
        "closed"
      ],
      default: "reported"
    }
  },
  { timestamps: true }
);


// GEO INDEX → find nearest hospitals/ambulances
emergencyCaseSchema.index({ location: "2dsphere" });
emergencyCaseSchema.index({ status: 1, priority: 1 });

// ─────────────────────────────────────────
// METHOD → assign hospital
// ─────────────────────────────────────────
emergencyCaseSchema.methods.assignHospital = function (hospitalId) {
  this.hospitalId = hospitalId;
  this.status = "triaged";
  return this.save();
};


// ─────────────────────────────────────────
// METHOD → assign ambulance
// ─────────────────────────────────────────
emergencyCaseSchema.methods.assignAmbulance = function (ambulanceId) {
  this.ambulanceId = ambulanceId;
  this.status = "ambulance_assigned";
  return this.save();
};


// ─────────────────────────────────────────
// METHOD → mark in transit
// ─────────────────────────────────────────
emergencyCaseSchema.methods.startTransport = function () {
  this.status = "in_transit";
  return this.save();
};


// ─────────────────────────────────────────
// METHOD → assign doctor
// ─────────────────────────────────────────
emergencyCaseSchema.methods.assignDoctor = function (doctorId) {
  this.doctorId = doctorId;
  return this.save();
};


// ─────────────────────────────────────────
// METHOD → close emergency
// ─────────────────────────────────────────
emergencyCaseSchema.methods.closeCase = function () {
  this.status = "closed";
  return this.save();
};


export const EmergencyCase = mongoose.model(
  "EmergencyCase",
  emergencyCaseSchema
);