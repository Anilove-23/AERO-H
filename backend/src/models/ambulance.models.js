import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    ambulanceCode: {
      type: String,
      required: [true, "Ambulance code is required"],
      unique: true,
      trim: true
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    driverName: {
      type: String,
      required: [true, "Driver name is required"],
      trim: true
    },

    status: {
      type: String,
      enum: ["available", "dispatched", "offline"],
      default: "available"
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

    currentEmergencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmergencyCase",
      default: null
    }
  },
  {
    timestamps: { createdAt: false, updatedAt: true }
  }
);


// GEO INDEX → for nearest ambulance search
ambulanceSchema.index({ location: "2dsphere" });


// ─────────────────────────────────────────
// METHOD → Check if ambulance is available
// ─────────────────────────────────────────
ambulanceSchema.methods.isAvailable = function () {
  return this.status === "available";
};


// ─────────────────────────────────────────
// METHOD → Dispatch ambulance
// ─────────────────────────────────────────
ambulanceSchema.methods.dispatch = function (emergencyId) {
  this.status = "dispatched";
  this.currentEmergencyId = emergencyId;
  return this.save();
};


// ─────────────────────────────────────────
// METHOD → Mark ambulance available again
// ─────────────────────────────────────────
ambulanceSchema.methods.completeTrip = function () {
  this.status = "available";
  this.currentEmergencyId = null;
  return this.save();
};


export const Ambulance = mongoose.model("Ambulance", ambulanceSchema);