import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  address: String,

  contactNumber: String,

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

hospitalSchema.index({ location: "2dsphere" });

export const Hospital = mongoose.model("Hospital", hospitalSchema);