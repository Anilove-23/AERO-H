import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true
    },

    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true
    },

    experienceLevel: {
      type: String,
      enum: ["junior", "mid", "senior"],
      required: true
    },

    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    available: {
      type: Boolean,
      default: true
    },

    currentCaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmergencyCase",
      default: null
    },

    shiftStatus: {
      type: String,
      enum: ["on_duty", "off_duty"],
      default: "off_duty"
    }
  },
  { timestamps: true }
);


doctorSchema.index({ hospitalId: 1 });
doctorSchema.index({ specialization: 1 });
// ─────────────────────────────────────────
// METHOD → Check if doctor can take case
// ─────────────────────────────────────────
doctorSchema.methods.canTakeCase = function () {
  return this.available && this.shiftStatus === "on_duty";
};



// ─────────────────────────────────────────
// METHOD → Assign case
// ─────────────────────────────────────────
doctorSchema.methods.assignCase = function (caseId) {
  this.currentCaseId = caseId;
  this.available = false;
  return this.save();
};



// ─────────────────────────────────────────
// METHOD → Finish case
// ─────────────────────────────────────────
doctorSchema.methods.finishCase = function () {
  this.currentCaseId = null;
  this.available = true;
  return this.save();
};



export const Doctor = mongoose.model("Doctor", doctorSchema);