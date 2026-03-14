import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
{
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  emergencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmergencyCase"
  },

  bloodType: {
    type: String,
    required: true
  },

  unitsRequired: {
    type: Number,
    default: 1
  },

  status: {
    type: String,
    enum: ["open", "fulfilled"],
    default: "open"
  }

},
{ timestamps: true }
);

export const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);