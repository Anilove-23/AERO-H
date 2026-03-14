import { Doctor } from "../models/doctor.model.js";

export const findBestDoctor = async (hospitalId, specialization) => {

const doctors = await Doctor.find({
hospitalId,
specialization,
available: true,
shiftStatus: "on_duty"
});

if (!doctors.length) return null;

// prefer most experienced doctor
doctors.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);

return doctors[0];
};
