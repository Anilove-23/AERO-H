import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import ResourceMap from "../dashboardcomponents/ResourceMap";
import NotificationFeed from "../dashboardcomponents/NotificationFeed";

/* -----------------------------
   Backend API
----------------------------- */
const API = "http://localhost:8000/api/v1";

/* -----------------------------
   Dummy Hospital Data (Fallback)
----------------------------- */
const hospitalsData = [
  { id: "H1", name: "Central Hospital", lat: 28.6205, lng: 77.2100, icuBeds: 3, available: true },
  { id: "H2", name: "City Care Hospital", lat: 28.6050, lng: 77.2250, icuBeds: 1, available: true },
  { id: "H3", name: "Metro Hospital", lat: 28.6400, lng: 77.2000, icuBeds: 0, available: false },
];

/* -----------------------------
   Dummy Doctor Data (Fallback)
----------------------------- */
const doctorsData = [
  { id: "D1", name: "Dr. Mehta", specialization: "Cardiology", available: true },
  { id: "D2", name: "Dr. Singh", specialization: "Orthopedics", available: false },
  { id: "D3", name: "Dr. Rao", specialization: "Neurology", available: true },
];

/* -----------------------------
   Distance Function
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

const Dashboard = () => {

  const [emergencies, setEmergencies] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const [hospitals, setHospitals] = useState(hospitalsData);
  const [doctors, setDoctors] = useState(doctorsData);

  const token = localStorage.getItem("token");

  /* -----------------------------
     LOAD HOSPITALS FROM BACKEND
  ----------------------------- */
  useEffect(() => {

    const loadHospitals = async () => {

      try {

        const res = await axios.get(`${API}/hospitals`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.hospitals?.length) {

          const formatted = res.data.hospitals.map(h => ({
            id: h._id,
            name: h.name,
            lat: h.location?.coordinates?.[1],
            lng: h.location?.coordinates?.[0],
            icuBeds: h.icuBedsAvailable || 2,
            available: true
          }));

          setHospitals(formatted);

        }

      } catch (err) {

        console.log("⚠️ Backend unavailable → using fallback hospitals");

        setHospitals(hospitalsData);

      }

    };

    loadHospitals();

  }, []);

  /* -----------------------------
     LOAD DOCTORS FROM BACKEND
  ----------------------------- */
  useEffect(() => {

    const loadDoctors = async () => {

      try {

        const res = await axios.get(`${API}/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.doctors?.length) {
          setDoctors(res.data.doctors);
        }

      } catch (err) {

        console.log("⚠️ Backend unavailable → using fallback doctors");

        setDoctors(doctorsData);

      }

    };

    loadDoctors();

  }, []);

  /* -----------------------------
     LOAD EMERGENCIES FROM BACKEND
  ----------------------------- */
  useEffect(() => {

    const loadEmergencies = async () => {

      try {

        const res = await axios.get(`${API}/emergencies`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.emergencies) {

          const formatted = res.data.emergencies.map(e => ({
            id: e._id,
            lat: e.location?.coordinates?.[1],
            lng: e.location?.coordinates?.[0],
            severity: e.priority || "Medium"
          }));

          setEmergencies(formatted);

        }

      } catch (err) {

        console.log("⚠️ Backend unavailable → using simulated emergencies");

        const interval = setInterval(() => {

          setEmergencies(prev => [
            ...prev,
            {
              id: Date.now(),
              lat: 28.6139 + Math.random() * 0.02,
              lng: 77.209 + Math.random() * 0.02,
              severity: ["Critical", "Medium", "Low"][Math.floor(Math.random() * 3)]
            }
          ]);

        }, 10000);

        return () => clearInterval(interval);

      }

    };

    loadEmergencies();

  }, []);

  /* -----------------------------
     REAL GPS WATCH
  ----------------------------- */
  useEffect(() => {

    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(

      (pos) => {

        if (!simulating) {

          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });

        }

      },
      (err) => console.error(err),
      { enableHighAccuracy: true }

    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [simulating]);

  /* -----------------------------
     SIMULATE USER / AMBULANCE
  ----------------------------- */
  const startSimulation = () => {

    if (!userLocation) {
      setUserLocation({ lat: 28.6139, lng: 77.209 });
    }

    setSimulating(true);

    let steps = 0;

    const interval = setInterval(() => {

      setUserLocation(prev => {

        if (!prev || steps > 25) {

          clearInterval(interval);
          setSimulating(false);

          return prev;
        }

        steps++;

        return {
          lat: prev.lat + 0.00025,
          lng: prev.lng + 0.00025
        };

      });

    }, 1000);

  };

  /* -----------------------------
     NEAREST HOSPITALS
  ----------------------------- */
  const nearestHospitals = userLocation
    ? hospitals
        .filter(h => h.available && h.icuBeds > 0)
        .map(h => ({
          ...h,
          distance: getDistance(userLocation.lat, userLocation.lng, h.lat, h.lng)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2)
    : [];

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <div className="flex flex-1">

        {/* MAP */}
        <div className="flex-1 p-4">

          <div className="h-[calc(100vh-160px)]">

            <ResourceMap
              emergencies={emergencies}
              setEmergencies={setEmergencies}
              userLocation={userLocation}
              hospitals={nearestHospitals}
              doctors={doctors}
            />

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="w-96 p-4 space-y-4 overflow-y-auto">

          <button
            onClick={startSimulation}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            ▶️ Simulate User / Ambulance Movement
          </button>

          <NotificationFeed emergencies={emergencies} />

          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              🏥 Nearest Hospitals
            </h2>

            {nearestHospitals.map((h) => {

              const icuStatus =
                h.icuBeds > 2 ? "High" :
                h.icuBeds === 1 ? "Low" :
                "Full";

              const icuColor =
                icuStatus === "High"
                  ? "bg-green-100 text-green-800"
                  : icuStatus === "Low"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800";

              return (

                <div
                  key={h.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer shadow-sm"
                >

                  <div>

                    <p className="font-semibold text-gray-800">
                      {h.name}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Distance: {h.distance?.toFixed(2)} km
                    </p>

                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${icuColor}`}>
                    ICU: {h.icuBeds} ({icuStatus})
                  </span>

                </div>

              );

            })}

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
};

export default Dashboard;