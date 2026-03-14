import { useState, useEffect, useMemo } from "react";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

// Dummy hospitals with doctors and photos
const dummyHospitals = [
  {
    hospitalId: "H1",
    hospitalName: "Central Hospital",
    lat: 28.6205,
    lng: 77.2100,
    icuBeds: 5,
    doctors: Array.from({ length: 12 }).map((_, i) => ({
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
    lat: 28.6050,
    lng: 77.2250,
    icuBeds: 4,
    doctors: Array.from({ length: 10 }).map((_, i) => ({
      name: `Dr. Verma ${i + 1}`,
      specialization: ["Cardiology", "Orthopedics", "Neurology", "Trauma"][i % 4],
      experience: `${Math.floor(Math.random() * 15) + 1} yrs`,
      available: Math.random() > 0.3,
      photo: `https://i.pravatar.cc/150?img=${i + 20}`,
    })),
  },
];

// Helper: Haversine distance
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
  const [hospitals, setHospitals] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const requiredSpecializations = geminiData?.requiredSpecialization || [];

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Please allow location access to see nearest hospitals.")
    );
  }, []);

  // Sort hospitals by distance
  useEffect(() => {
    if (!userLocation) return;
    const sortedHospitals = dummyHospitals
      .map((h) => ({
        ...h,
        distance: getDistance(userLocation.lat, userLocation.lng, h.lat, h.lng),
      }))
      .sort((a, b) => a.distance - b.distance);
    setHospitals(sortedHospitals);
  }, [userLocation]);

  // Auto-refresh doctor availability every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setHospitals((prev) =>
        prev.map((h) => ({
          ...h,
          doctors: h.doctors.map((d) => ({ ...d, available: Math.random() > 0.3 })),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // All available specializations for filter
  const allSpecializations = useMemo(
    () =>
      [...new Set(hospitals.flatMap((h) => h.doctors.map((d) => d.specialization)))],
    [hospitals]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Nearby Hospitals & Doctors</h1>

        {!userLocation && !locationError && (
          <p className="text-gray-500">Loading your location...</p>
        )}
        {locationError && <p className="text-red-500">{locationError}</p>}

        {hospitals.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium">Filter by Specialization:</label>
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

            <button
              onClick={() =>
                setHospitals((prev) =>
                  prev.map((h) => ({
                    ...h,
                    doctors: h.doctors.map((d) => ({ ...d, available: Math.random() > 0.3 })),
                  }))
                )
              }
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Refresh Availability
            </button>
          </div>
        )}

        <div className="space-y-6">
          {hospitals.map((h) => {
            const filteredDoctors = (requiredSpecializations.length > 0
              ? h.doctors.filter((d) => requiredSpecializations.includes(d.specialization))
              : h.doctors
            ).filter((d) => !selectedSpecialization || d.specialization === selectedSpecialization);

            return (
              <div
                key={h.hospitalId}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-indigo-400/30 transition transform hover:-translate-y-1"
              >
                {/* Hospital Header */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-bold text-2xl">{h.hospitalName}</h2>
                  {h.distance != null && (
                    <span className="text-sm text-gray-500">{h.distance.toFixed(2)} km away</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      h.icuBeds > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    ICU Beds: {h.icuBeds}
                  </span>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                  {filteredDoctors.length === 0 ? (
                    <p className="text-gray-400 text-sm col-span-full">
                      No doctors available for selected specialization.
                    </p>
                  ) : (
                    filteredDoctors.map((d, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-4 rounded-xl shadow hover:shadow-lg transition ${
                          d.available
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-red-50 hover:bg-red-100"
                        }`}
                      >
                        {/* Doctor Photo */}
                        <div className="flex items-center gap-4">
                          <img
                            src={d.photo}
                            alt={d.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <span className="font-semibold text-lg">{d.name}</span>
                            <p className="text-gray-600 text-sm mt-1">{d.specialization}</p>
                            <p className="text-gray-500 text-xs">{d.experience}</p>
                          </div>
                        </div>

                        <div>
                          <span
                            className={`font-bold ${
                              d.available ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {d.available ? "Available" : "Busy"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {userLocation && hospitals.length === 0 && (
            <p className="text-gray-500">No hospitals found near your location.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}