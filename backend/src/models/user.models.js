import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ["citizen", "doctor", "hospital_admin", "operator"],
      default: "citizen"
    },

    phone: {
      type: String
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0]
      }
    },

    refreshToken: {
      type: String,
      select: false
    }

  },
  { timestamps: true }
);


// ─────────────────────────────────────────
// HASH PASSWORD BEFORE SAVE
// ─────────────────────────────────────────
userSchema.pre("save", async function (next) {

  if (!this.isModified("passwordHash")) return next();

  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);

  next();

});


// ─────────────────────────────────────────
// COMPARE PASSWORD
// ─────────────────────────────────────────
userSchema.methods.comparePassword = async function (password) {

  return bcrypt.compare(password, this.password);

};


// ─────────────────────────────────────────
// GENERATE ACCESS TOKEN
// ─────────────────────────────────────────
userSchema.methods.generateAccessToken = function () {

  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );

};


// ─────────────────────────────────────────
// GENERATE REFRESH TOKEN
// ─────────────────────────────────────────
userSchema.methods.generateRefreshToken = function () {

  return jwt.sign(
    {
      id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );

};


// ─────────────────────────────────────────
// GENERATE TEMP TOKEN
// (used for OTP / verification etc)
// ─────────────────────────────────────────
userSchema.methods.generateTempToken = function () {

  return jwt.sign(
    {
      id: this._id
    },
    process.env.TEMP_TOKEN_SECRET,
    {
      expiresIn: process.env.TEMP_TOKEN_EXPIRY
    }
  );

};


// ─────────────────────────────────────────
// SAFE PUBLIC PROFILE
// ─────────────────────────────────────────
userSchema.methods.toPublicJSON = function () {

  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    location: this.location,
    createdAt: this.createdAt
  };

};


export const User = mongoose.model("User", userSchema);