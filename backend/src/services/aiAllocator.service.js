import axios from "axios";

export const getAIAllocation = async (
  symptoms,
  lat,
  lng,
  triage,
  hospitals,
  doctors,
  ambulances
) => {

  // Safety check
  if (!Array.isArray(hospitals)) hospitals = [];
  if (!Array.isArray(doctors)) doctors = [];
  if (!Array.isArray(ambulances)) ambulances = [];

  const formattedHospitals = hospitals.map(h => ({
    _id: h._id.toString(),         
    name: h.name,
    x: h.location.coordinates[0],
    y: h.location.coordinates[1],

    beds_available: 5,
    total_beds: 10,
    doctor_experience: 0.8,
    ambulance_available: 2
  }));

  const formattedDoctors = doctors.map(d => ({
    _id: d._id.toString(),          // ✅ FIXED
    specialization: d.specialization,
    available: d.available
  }));

  const formattedAmbulances = ambulances.map(a => ({
    _id: a._id.toString(),          // ✅ FIXED
    x: a.location.coordinates[0],
    y: a.location.coordinates[1],
    available: a.status === "available"
  }));


  const response = await axios.post("http://localhost:6000/report", {

    message: symptoms,

    location: [lat, lng],

    severityScore: triage.severityScore,
    requiredSpecialization: triage.requiredSpecialization,

    hospitals: formattedHospitals,
    doctors: formattedDoctors,
    ambulances: formattedAmbulances

  });

  return response.data;
};