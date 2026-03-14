import mongoose from "mongoose";

const bloodDonorSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  bloodType: {
    type: String,
    required: true
  },

  phone: String,

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },

    coordinates: {
      type: [Number],
      required: true
    }
  }
},
{ timestamps: true }
);

bloodDonorSchema.index({ location: "2dsphere" });

export const BloodDonor = mongoose.model("BloodDonor", bloodDonorSchema);