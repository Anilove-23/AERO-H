import { Hospital } from "../models/hospital.model.js";

export const findBestHospital = async (lng, lat) => {

const hospitals = await Hospital.find({
location: {
$near: {
$geometry: {
type: "Point",
coordinates: [lng, lat]
},
$maxDistance: 20000
}
}
});

if (!hospitals.length) return null;

// pick hospital with most ICU beds
hospitals.sort((a, b) => b.icuBedsAvailable - a.icuBedsAvailable);

return hospitals[0];
};
