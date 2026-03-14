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

    // Useful for demo / testing
    isSimulation: {
      type: Boolean,
      default: false
    },

    // Emergency lifecycle
    status: {
      type: String,
      enum: [
        "reported",
        "triaged",
        "hospital_assigned",
        "ambulance_dispatched",
        "ambulance_assigned",
        "in_transit",
        "doctor_assigned",
        "treated",
        "closed"
      ],
      default: "reported"
    },

    // Optional AI debug info
    aiDecisionMeta: {
      hospitalScore: Number,
      ambulanceScore: Number,
      doctorScore: Number
    }
  },
  { timestamps: true }
);


// ─────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────

// GEO INDEX → find nearest hospitals / ambulances
emergencyCaseSchema.index({ location: "2dsphere" });

// Query active emergencies quickly
emergencyCaseSchema.index({ status: 1, priority: 1 });

// Fast lookup for hospital dashboards
emergencyCaseSchema.index({ hospitalId: 1 });


// ─────────────────────────────────────────
// METHODS
// ─────────────────────────────────────────

// Assign hospital
emergencyCaseSchema.methods.assignHospital = function (hospitalId) {
  this.hospitalId = hospitalId;
  this.status = "hospital_assigned";
  return this.save();
};


// Assign ambulance
emergencyCaseSchema.methods.assignAmbulance = function (ambulanceId) {
  this.ambulanceId = ambulanceId;
  this.status = "ambulance_dispatched";
  return this.save();
};


// Mark ambulance en route
emergencyCaseSchema.methods.startTransport = function () {
  this.status = "in_transit";
  return this.save();
};


// Assign doctor
emergencyCaseSchema.methods.assignDoctor = function (doctorId) {
  this.doctorId = doctorId;
  this.status = "doctor_assigned";
  return this.save();
};


// Mark treatment complete
emergencyCaseSchema.methods.markTreated = function () {
  this.status = "treated";
  return this.save();
};


// Close emergency
emergencyCaseSchema.methods.closeCase = function () {
  this.status = "closed";
  return this.save();
};


export const EmergencyCase = mongoose.model(
  "EmergencyCase",
  emergencyCaseSchema
);