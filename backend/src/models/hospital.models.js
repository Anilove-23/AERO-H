import mongoose from "mongoose";

const hospitalResourcesSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      unique: true
    },

    icuBedsAvailable: {
      type: Number,
      default: 0
    },

    ventilatorsAvailable: {
      type: Number,
      default: 0
    },

    doctorsAvailable: {
      type: Number,
      default: 0
    },

    erCapacity: {
      type: Number, // %
      min: 0,
      max: 100
    }
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const HospitalResources = mongoose.model(
  "HospitalResources",
  hospitalResourcesSchema
);