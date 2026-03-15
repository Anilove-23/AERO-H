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

  // ─────────────────────────────
  // Safety Checks
  // ─────────────────────────────
  if (!Array.isArray(hospitals)) hospitals = [];
  if (!Array.isArray(doctors)) doctors = [];
  if (!Array.isArray(ambulances)) ambulances = [];

  // ensure numeric
  lat = Number(lat);
  lng = Number(lng);

  // ─────────────────────────────
  // Sort Ambulances by Distance
  // (nearest first)
  // ─────────────────────────────
  ambulances.sort((a, b) => {

    if (!a?.location?.coordinates || !b?.location?.coordinates)
      return 0;

    const distA = Math.sqrt(
      (a.location.coordinates[0] - lng) ** 2 +
      (a.location.coordinates[1] - lat) ** 2
    );

    const distB = Math.sqrt(
      (b.location.coordinates[0] - lng) ** 2 +
      (b.location.coordinates[1] - lat) ** 2
    );

    return distA - distB;

  });

  const nearestAmbulances = ambulances.slice(0, 5);

  // ─────────────────────────────
  // Format Hospitals
  // ─────────────────────────────
  const formattedHospitals = hospitals.map(h => ({
    _id: h._id?.toString(),
    name: h.name,

    x: h?.location?.coordinates?.[0] ?? 0,
    y: h?.location?.coordinates?.[1] ?? 0,

    beds_available: h.icuBedsAvailable ?? 5,
    total_beds: h.totalBeds ?? 10,

    doctor_experience: 0.8,
    ambulance_available: 2
  }));

  // ─────────────────────────────
  // Format Doctors
  // ─────────────────────────────
  const formattedDoctors = doctors.map(d => ({
    _id: d._id?.toString(),
    specialization: d.specialization,
    available: d.available
  }));

  // ─────────────────────────────
  // Format Ambulances
  // ─────────────────────────────
  const formattedAmbulances = nearestAmbulances.map(a => ({
    _id: a._id?.toString(),

    x: a?.location?.coordinates?.[0] ?? 0,
    y: a?.location?.coordinates?.[1] ?? 0,

    available: a.status === "available"
  }));

  try {

    const response = await axios.post("http://localhost:6000/report", {

      message: symptoms,

      location: [lat, lng],

      severityScore: triage?.severityScore ?? 1,
      requiredSpecialization: triage?.requiredSpecialization ?? "General",

      hospitals: formattedHospitals,
      doctors: formattedDoctors,
      ambulances: formattedAmbulances

    });

    const ai = response?.data || {};

    // ─────────────────────────────
    // Safe AI Result Handling
    // ─────────────────────────────
    let hospitalId = ai.hospitalId || hospitals[0]?._id || null;
    let doctorId = ai.doctorId || doctors[0]?._id || null;
    let ambulanceId = ai.ambulanceId || nearestAmbulances[0]?._id || null;

    return {
      hospitalId,
      doctorId,
      ambulanceId
    };

  } catch (error) {

    console.log("⚠️ AI service failed — fallback activated");

    // fallback: choose first available resources
    const fallbackHospital = hospitals[0];
    const fallbackDoctor = doctors[0];
    const fallbackAmbulance = nearestAmbulances[0];

    return {
      hospitalId: fallbackHospital?._id || null,
      doctorId: fallbackDoctor?._id || null,
      ambulanceId: fallbackAmbulance?._id || null
    };

  }

};