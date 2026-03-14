import { Ambulance } from "../models/ambulance.model.js";

export const findNearestAmbulance = async (lng, lat) => {

const ambulance = await Ambulance.findOne({
status: "available",
location: {
$near: {
$geometry: {
type: "Point",
coordinates: [lng, lat]
},
$maxDistance: 10000
}
}
});

return ambulance;
};
