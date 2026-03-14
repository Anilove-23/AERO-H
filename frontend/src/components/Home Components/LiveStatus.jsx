import React, { useEffect, useState } from "react";

const LiveStatus = () => {
  const [status, setStatus] = useState({
    userLocation: false,
    ambulancesNearby: 0,
    hospitalsAvailable: 0,
    aiTriage: "Idle",
  });

  // Dummy initial data
  const hospitalsData = [
    { id: "H1", available: true, icuBeds: 3 },
    { id: "H2", available: true, icuBeds: 1 },
    { id: "H3", available: false, icuBeds: 0 },
  ];

  const ambulancesData = ["A1", "A2", "A3", "A4"];

  // Simulate status changing every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomHospitalsAvailable = hospitalsData
        .filter((h) => h.available && h.icuBeds > 0).length;
      const randomAmbulances = Math.floor(Math.random() * ambulancesData.length) + 1;
      const aiStatuses = ["Idle", "Running", "Processing"];
      const randomAI = aiStatuses[Math.floor(Math.random() * aiStatuses.length)];

      setStatus({
        userLocation: Math.random() > 0.2, // 80% chance active
        ambulancesNearby: randomAmbulances,
        hospitalsAvailable: randomHospitalsAvailable,
        aiTriage: randomAI,
      });
    }, 3000); // update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const statusItems = [
    { label: "📍 User Location", value: status.userLocation ? "Active" : "Inactive", color: "text-green-600" },
    { label: "🚑 Ambulances Nearby", value: status.ambulancesNearby },
    { label: "🏥 Hospitals Available", value: status.hospitalsAvailable },
    { label: "🧠 AI Triage", value: status.aiTriage, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-3 bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto animate-pulse-slow">
      <h2 className="text-xl font-bold text-gray-800 mb-2">🔴 Live Status</h2>
      {statusItems.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between hover:bg-gray-50 p-3 rounded-lg transition cursor-pointer shadow-sm"
        >
          <span className="font-semibold text-gray-700">{item.label}</span>
          <span className={`${item.color ? item.color : "text-gray-800"} font-medium`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LiveStatus;