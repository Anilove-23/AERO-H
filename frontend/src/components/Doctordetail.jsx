import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

const API = "http://localhost:8000/api/v1";

/* -----------------------------
   Dummy fallback hospitals
----------------------------- */
const dummyHospitals = [
  {
    hospitalId: "H1",
    hospitalName: "Central Hospital",
    lat: 28.6205,
    lng: 77.2100,
    icuBeds: 5,
    doctors: Array.from({ length: 6 }).map((_, i) => ({
      name: `Dr. Mehta ${i + 1}`,
      specialization: ["Cardiology", "Orthopedics", "Neurology", "Trauma"][i % 4],
      experience: `${Math.floor(Math.random() * 15) + 1} yrs`,
      available: Math.random() > 0.3,
      photo: `https://i.pravatar.cc/150?img=${i + 1}`,
    })),
  },
  {
    hospitalId: "H2",
    hospitalName: "City Care Hospital",
    lat: 28.605,
    lng: 77.225,
    icuBeds: 4,
    doctors: Array.from({ length: 6 }).map((_, i) => ({
      name: `Dr. Verma ${i + 1}`,
      specialization: ["Cardiology", "Orthopedics", "Neurology", "Trauma"][i % 4],
      experience: `${Math.floor(Math.random() * 15) + 1} yrs`,
      available: Math.random() > 0.3,
      photo: `https://i.pravatar.cc/150?img=${i + 20}`,
    })),
  },
];

/* -----------------------------
   Distance function
----------------------------- */
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function DoctorDetail({ geminiData }) {

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [hospitals, setHospitals] = useState(dummyHospitals);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const requiredSpecializations = geminiData?.requiredSpecialization || [];

  /* -----------------------------
     LOAD HOSPITALS + DOCTORS
  ----------------------------- */
  useEffect(() => {

    const loadHospitals = async () => {

      try {

        const token = localStorage.getItem("token");

        const hospitalsRes = await axios.get(`${API}/hospitals`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const doctorsRes = await axios.get(`${API}/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const hospitalsFromAPI = hospitalsRes.data?.hospitals || [];
        const doctorsFromAPI = doctorsRes.data?.doctors || [];

        const mergedHospitals = hospitalsFromAPI.map((h) => {

          let hospitalDoctors = doctorsFromAPI
            .filter((d) => String(d.hospitalId) === String(h._id))
            .map((d, i) => ({
              name: d.name,
              specialization: d.specialization || "General",
              experience: `${d.experienceLevel || 1} yrs`,
              available: d.available ?? true,
              photo: `https://i.pravatar.cc/150?img=${i + 30}`,
            }));

          /* fallback doctors if backend empty */
          if (hospitalDoctors.length === 0) {

            hospitalDoctors = dummyHospitals[0].doctors;

          }

          return {
            hospitalId: h._id,
            hospitalName: h.name,
            lat: h.location?.coordinates?.[1],
            lng: h.location?.coordinates?.[0],
            icuBeds: h.icuBedsAvailable || 2,
            doctors: hospitalDoctors,
          };

        });

        if (mergedHospitals.length > 0) {
          setHospitals(mergedHospitals);
        }

      } catch (err) {

        console.log("⚠️ Backend unavailable → using fallback hospitals");

        setHospitals(dummyHospitals);

      }

    };

    loadHospitals();

  }, []);

  /* -----------------------------
     GET USER LOCATION
  ----------------------------- */
  useEffect(() => {

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setLocationError("Please allow location access")
    );

  }, []);

  /* -----------------------------
     SORT BY DISTANCE
  ----------------------------- */
  useEffect(() => {

    if (!userLocation) return;

    const sorted = hospitals
      .map((h) => ({
        ...h,
        distance: getDistance(userLocation.lat, userLocation.lng, h.lat, h.lng),
      }))
      .sort((a, b) => a.distance - b.distance);

    setHospitals(sorted);

  }, [userLocation]);

  /* -----------------------------
     SPECIALIZATION LIST
  ----------------------------- */
  const allSpecializations = useMemo(() => {

    return [
      ...new Set(
        hospitals.flatMap((h) => h.doctors.map((d) => d.specialization))
      ),
    ];

  }, [hospitals]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Nearby Hospitals & Doctors
        </h1>

        {locationError && (
          <p className="text-red-500">{locationError}</p>
        )}

        {/* specialization filter */}
        <div className="flex items-center gap-4 mb-4">

          <label className="text-sm font-medium">
            Filter by Specialization:
          </label>

          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >

            <option value="">All</option>

            {allSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}

          </select>

        </div>

        <div className="space-y-6">

          {hospitals.map((h) => {

            const filteredDoctors = h.doctors.filter(
              (d) =>
                !selectedSpecialization ||
                d.specialization === selectedSpecialization
            );

            return (

              <div
                key={h.hospitalId}
                className="bg-white p-8 rounded-3xl shadow-lg"
              >

                <div className="flex justify-between mb-2">

                  <h2 className="font-bold text-2xl">
                    {h.hospitalName}
                  </h2>

                  {h.distance && (
                    <span className="text-sm text-gray-500">
                      {h.distance.toFixed(2)} km
                    </span>
                  )}

                </div>

                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  ICU Beds: {h.icuBeds}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                  {filteredDoctors.map((d, idx) => (

                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-xl shadow ${
                        d.available ? "bg-green-50" : "bg-red-50"
                      }`}
                    >

                      <div className="flex items-center gap-4">

                        <img
                          src={d.photo}
                          alt={d.name}
                          className="w-14 h-14 rounded-full"
                        />

                        <div>
                          <p className="font-semibold">{d.name}</p>
                          <p className="text-sm">{d.specialization}</p>
                          <p className="text-xs text-gray-500">{d.experience}</p>
                        </div>

                      </div>

                      <span className="font-bold text-sm">
                        {d.available ? "Available" : "Busy"}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            );

          })}

        </div>

      </div>

      <Footer />

    </div>
  );
}