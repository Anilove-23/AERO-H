import { useState, useEffect } from "react";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

// Dummy donor photos (replace with actual images in real app)
const dummyPhotos = [
  "https://i.pravatar.cc/100?img=10",
  "https://i.pravatar.cc/100?img=20",
  "https://i.pravatar.cc/100?img=30",
  "https://i.pravatar.cc/100?img=40",
  "https://i.pravatar.cc/100?img=50",
  "https://i.pravatar.cc/100?img=60",
];

// Dummy hospitals & donors
const dummyHospitals = [
  {
    id: "H1",
    name: "Central Hospital",
    lat: 28.6205,
    lng: 77.2100,
    distance: 2.5,
    donors: [
      { name: "Rohit Sharma", blood: "O+", last: "2026-01-10", donations: 5, available: true },
      { name: "Anita Verma", blood: "A-", last: "2026-02-05", donations: 3, available: false },
      { name: "Kiran Mehta", blood: "B+", last: "2026-02-15", donations: 7, available: true },
      { name: "Suresh Patel", blood: "AB-", last: "2026-01-25", donations: 2, available: true },
      { name: "Priya Singh", blood: "O-", last: "2026-03-01", donations: 4, available: true },
      { name: "Amit Kumar", blood: "A+", last: "2026-02-20", donations: 6, available: true },
    ],
  },
  {
    id: "H2",
    name: "City Care Hospital",
    lat: 28.6050,
    lng: 77.2250,
    distance: 4.2,
    donors: [
      { name: "Neha Joshi", blood: "B-", last: "2026-01-15", donations: 3, available: true },
      { name: "Rajesh Singh", blood: "AB+", last: "2026-02-20", donations: 5, available: false },
      { name: "Sneha Mehta", blood: "O+", last: "2026-03-05", donations: 2, available: true },
      { name: "Vikram Verma", blood: "A-", last: "2026-02-01", donations: 4, available: true },
    ],
  },
];

// Dummy donation camps
const dummyCamps = [
  { name: "Red Cross Camp", date: "2026-03-20", location: "Central Park" },
  { name: "City Blood Drive", date: "2026-03-25", location: "City Mall" },
  { name: "Hospital Blood Camp", date: "2026-04-01", location: "City Care Hospital" },
];

const bloodTypes = ["All", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

const BloodDonor = () => {
  const [selectedBlood, setSelectedBlood] = useState("All");
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    // In real app: fetch hospitals + donors from backend
    setHospitals(dummyHospitals);
  }, []);

  const filterDonors = (donors) => {
    if (selectedBlood === "All") return donors;
    return donors.filter((d) => d.blood === selectedBlood);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-red-500 text-3xl">🩸</span> Blood Donors & Camps Near You
        </h1>

        {/* Blood Type Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {bloodTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedBlood(type)}
              className={`px-4 py-1 rounded-full font-medium text-sm transition ${
                selectedBlood === type
                  ? "bg-red-500 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-red-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Hospitals & Donors */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {hospitals.map((h, idx) => (
            <div
              key={h.id}
              className="bg-white rounded-3xl p-6 shadow hover:shadow-red-300 transition"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{h.name}</h2>
                <span className="text-gray-500 text-sm">{h.distance} km away</span>
              </div>
              <p className="text-gray-500 font-medium mb-3">
                🩸 {filterDonors(h.donors).length} Available Donors
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                {filterDonors(h.donors).map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-red-50 p-3 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={dummyPhotos[i % dummyPhotos.length]}
                      alt={d.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{d.name}</p>
                      <p className="text-sm text-gray-500">
                        Blood Type: <span className="font-medium">{d.blood}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Last Donation: {d.last}
                      </p>
                      <p className="text-sm text-yellow-600">
                        ⭐ {d.donations} donations
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        d.available ? "bg-green-100 text-green-700 animate-pulse" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {d.available ? "Ready" : "Busy"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Donation Camps */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Blood Donation Camps</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dummyCamps.map((c, idx) => (
            <div
              key={idx}
              className="min-w-[220px] bg-red-50 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col gap-2"
            >
              <h3 className="font-semibold text-gray-800">{c.name}</h3>
              <p className="text-gray-500 text-sm">📍 {c.location}</p>
              <p className="text-gray-600 text-sm font-medium">📅 {c.date}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BloodDonor;