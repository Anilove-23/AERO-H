import { findNearestAmbulance } from "./ambulance.service.js";
import { findBestHospital } from "./hospital.service.js";
import { findBestDoctor } from "./doctor.service.js";

export const allocateResources = async (emergency) => {

const [lng, lat] = emergency.location.coordinates;

// find ambulance
const ambulance = await findNearestAmbulance(lng, lat);

// find hospital
const hospital = await findBestHospital(lng, lat);

// find doctor
let doctor = null;

if (hospital && emergency.requiredSpecialization) {
doctor = await findBestDoctor(
hospital._id,
emergency.requiredSpecialization
);
}

return {
ambulance,
hospital,
doctor
};
};
