import React, { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

import {
  FaExclamationTriangle,
  FaDownload,
  FaHospital,
} from "react-icons/fa";

const API = "http://localhost:8000/api/v1";

/* -----------------------------------
   FALLBACK DATA
------------------------------------ */

const fallbackHospitalData = {
  "City Hospital": [
    { date: "2026-03-01", department: "ER", patients: 20, icuBeds: 5, doctorsAvailable: 4 },
    { date: "2026-03-02", department: "ER", patients: 25, icuBeds: 4, doctorsAvailable: 3 },
    { date: "2026-03-03", department: "ER", patients: 28, icuBeds: 4, doctorsAvailable: 4 },
    { date: "2026-03-04", department: "ER", patients: 30, icuBeds: 3, doctorsAvailable: 3 },
    { date: "2026-03-05", department: "ER", patients: 35, icuBeds: 3, doctorsAvailable: 2 },
  ],
  "Metro Medical": [
    { date: "2026-03-01", department: "ER", patients: 18, icuBeds: 4, doctorsAvailable: 3 },
    { date: "2026-03-02", department: "ER", patients: 22, icuBeds: 3, doctorsAvailable: 3 },
    { date: "2026-03-03", department: "ER", patients: 26, icuBeds: 2, doctorsAvailable: 2 },
    { date: "2026-03-04", department: "ER", patients: 29, icuBeds: 2, doctorsAvailable: 2 },
    { date: "2026-03-05", department: "ER", patients: 32, icuBeds: 1, doctorsAvailable: 1 },
  ],
};

/* -----------------------------------
   SAFE PREDICTION ALGORITHM
------------------------------------ */

const predictNextDayPatients = (data) => {

  if (!data || data.length < 2) {
    return data?.[0]?.patients || 0;
  }

  const n = data.length;

  const x = data.map((_, i) => i + 1);
  const y = data.map((d) => Number(d.patients) || 0);

  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (x[i] - xMean) * (y[i] - yMean);
    den += (x[i] - xMean) ** 2;
  }

  if (den === 0) return yMean;

  const slope = num / den;
  const intercept = yMean - slope * xMean;

  const result = intercept + slope * (n + 1);

  return Number.isFinite(result) ? Math.round(result) : 0;
};

const generate7DayTrend = (data) => {

  const trend = [];
  let baseData = [...data];

  for (let i = 0; i < 7; i++) {

    const next = predictNextDayPatients(baseData);

    trend.push({
      date: `Day ${i + 1}`,
      patients: next,
    });

    baseData.push({ patients: next });

  }

  return trend;
};

/* -----------------------------------
   CSV EXPORT
------------------------------------ */

const exportToCSV = (data, hospital) => {

  if (!data.length) return;

  const headers = Object.keys(data[0]);

  const rows = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => row[h]).join(",")),
  ];

  const csv = "data:text/csv;charset=utf-8," + rows.join("\n");

  const link = document.createElement("a");

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", `${hospital}-analytics.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* -----------------------------------
   COMPONENT
------------------------------------ */

const PredictiveDemand = () => {

  const [hospitalData, setHospitalData] = useState(fallbackHospitalData);

  const [selectedHospital, setSelectedHospital] = useState("");

  const [filteredData, setFilteredData] = useState([]);

  const [predictedPatients, setPredictedPatients] = useState(0);

  const [alerts, setAlerts] = useState([]);

  const [sevenDayTrend, setSevenDayTrend] = useState([]);

  /* -----------------------------------
     LOAD BACKEND DATA
  ------------------------------------ */

  useEffect(() => {

    const loadData = async () => {

      try {

        const hospitalsRes = await axios.get(`${API}/hospitals`);
        const doctorsRes = await axios.get(`${API}/doctors`);
        const emergenciesRes = await axios.get(`${API}/emergencies`);

        const hospitals = hospitalsRes.data?.hospitals || [];
        const doctors = doctorsRes.data?.doctors || [];
        const emergencies = emergenciesRes.data?.emergencies || [];

        const generated = {};

        hospitals.forEach((h) => {

          const hospitalDoctors = doctors.filter(
            (d) => String(d.hospitalId) === String(h._id)
          );

          const hospitalEmergencies = emergencies.filter(
            (e) => String(e.hospitalId) === String(h._id)
          );

          const basePatients = hospitalEmergencies.length || 5;

          generated[h.name] = Array.from({ length: 5 }).map((_, i) => {

            const date = new Date();
            date.setDate(date.getDate() - (4 - i));

            return {
              date: date.toISOString().slice(0, 10),
              department: "ER",
              patients: basePatients + Math.floor(Math.random() * 5),
              icuBeds: h.icuBedsAvailable || 2,
              doctorsAvailable: hospitalDoctors.filter((d) => d.available).length || 2,
            };

          });

        });

        if (Object.keys(generated).length) {
          setHospitalData(generated);
        }

      } catch (err) {

        console.log("⚠️ Backend unavailable → using fallback predictive data");

        setHospitalData(fallbackHospitalData);

      }

    };

    loadData();

  }, []);

  /* -----------------------------------
     PROCESS DATA
  ------------------------------------ */

  useEffect(() => {

    if (!selectedHospital) return;

    const data = hospitalData[selectedHospital] || [];

    setFilteredData(data);

    const prediction = predictNextDayPatients(data);

    setPredictedPatients(prediction);

    const latest = data[data.length - 1] || {};

    const newAlerts = [];

    if ((latest.icuBeds ?? 0) <= 1) {
      newAlerts.push("ICU beds are critically low");
    }

    if ((latest.doctorsAvailable ?? 0) <= 1) {
      newAlerts.push("Doctor availability is low");
    }

    setAlerts(newAlerts);

    setSevenDayTrend(generate7DayTrend(data));

  }, [selectedHospital, hospitalData]);

  /* -----------------------------------
     SELECT HOSPITAL SCREEN
  ------------------------------------ */

  if (!selectedHospital) {

    return (

      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gradient-to-r from-purple-100 via-blue-50 to-green-50">

        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FaHospital /> Select Hospital
        </h1>

        <select
          className="border px-6 py-3 rounded-xl shadow"
          value={selectedHospital}
          onChange={(e) => setSelectedHospital(e.target.value)}
        >

          <option value="">Choose Hospital</option>

          {Object.keys(hospitalData).map((hospital) => (

            <option key={hospital} value={hospital}>
              {hospital}
            </option>

          ))}

        </select>

      </div>

    );

  }

  /* -----------------------------------
     DASHBOARD
  ------------------------------------ */

  return (

    <>
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-8">
          Predictive Hospital Dashboard
        </h1>

        <div className="text-center mb-6">

          <h2 className="text-xl font-semibold text-indigo-600">
            Predicted Patients Tomorrow
          </h2>

          <p className="text-5xl font-bold">
            {Number.isFinite(predictedPatients) ? predictedPatients : 0}
          </p>

        </div>

        {alerts.map((a, i) => (

          <div
            key={i}
            className="bg-red-100 p-4 rounded-lg mb-4 flex items-center gap-2"
          >

            <FaExclamationTriangle />

            {a}

          </div>

        ))}

        {filteredData.length > 0 && (

          <ResponsiveContainer width="100%" height={400}>

            <LineChart data={filteredData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="patients"
                stroke="#4f46e5"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="icuBeds"
                stroke="#ef4444"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="doctorsAvailable"
                stroke="#10b981"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        )}

        {sevenDayTrend.length > 0 && (

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4 text-center">
              7 Day Prediction
            </h2>

            <ResponsiveContainer width="100%" height={350}>

              <LineChart data={sevenDayTrend}>

                <CartesianGrid strokeDasharray="4 4" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#6366f1"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        )}

        <div className="text-center mt-10">

          <button
            onClick={() => exportToCSV(filteredData, selectedHospital)}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2 mx-auto"
          >

            <FaDownload /> Export CSV

          </button>

        </div>

      </div>

      <Footer />

    </>
  );

};

export default PredictiveDemand;