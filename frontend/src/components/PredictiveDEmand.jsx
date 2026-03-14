// PredictiveDemand.jsx
import React, { useState, useEffect } from "react";
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
import { FaExclamationTriangle, FaUserMd, FaDownload, FaHospital } from "react-icons/fa";

// ===== 1️⃣ Hospital Data =====
const hospitalData = {
  "City Hospital": [
    { date: "2026-03-01", department: "ICU", patients: 5, icuBeds: 5, doctorsAvailable: 3 },
    { date: "2026-03-02", department: "ER", patients: 20, icuBeds: 4, doctorsAvailable: 5 },
    { date: "2026-03-03", department: "General", patients: 45, icuBeds: 3, doctorsAvailable: 8 },
    { date: "2026-03-04", department: "ICU", patients: 8, icuBeds: 2, doctorsAvailable: 2 },
  ],
  "Metro Medical": [
    { date: "2026-03-01", department: "ICU", patients: 3, icuBeds: 3, doctorsAvailable: 2 },
    { date: "2026-03-02", department: "ER", patients: 25, icuBeds: 2, doctorsAvailable: 4 },
    { date: "2026-03-03", department: "General", patients: 50, icuBeds: 1, doctorsAvailable: 6 },
    { date: "2026-03-04", department: "ICU", patients: 10, icuBeds: 0, doctorsAvailable: 1 },
  ],
};

// ===== 2️⃣ Helper Functions =====
const predictNextDayPatients = (data) => {
  if (!data.length) return 0;
  const n = data.length;
  const x = data.map((_, i) => i + 1);
  const y = data.map((d) => d.patients);
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - xMean) * (y[i] - yMean);
    den += (x[i] - xMean) ** 2;
  }
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  return Math.round(intercept + slope * (n + 1));
};

const generate7DayTrend = (data) => {
  const trend = [];
  let baseData = [...data];
  for (let i = 0; i < 7; i++) {
    const nextDayPatients = predictNextDayPatients(baseData);
    trend.push({
      date: `Day ${i + 1}`,
      patients: nextDayPatients,
      critical: nextDayPatients > 80,
    });
    baseData.push({ patients: nextDayPatients });
  }
  return trend;
};

const exportToCSV = (data, hospital) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(","), ...data.map((row) => headers.map((h) => row[h]).join(","))];
  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${hospital}-AllDepartments-data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ===== 3️⃣ Component =====
const PredictiveDemand = () => {
  const [selectedHospital, setSelectedHospital] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [predictedPatients, setPredictedPatients] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [sevenDayTrend, setSevenDayTrend] = useState([]);

  useEffect(() => {
    if (!selectedHospital) return;

    const allData = hospitalData[selectedHospital] || [];
    let data = !departmentFilter.length || departmentFilter.includes("All")
      ? allData
      : allData.filter((d) => departmentFilter.includes(d.department));

    setFilteredData(data);
    const prediction = predictNextDayPatients(data);
    setPredictedPatients(prediction);

    const latestData = data[data.length - 1] || {};
    const newAlerts = [];
    if ((latestData.icuBeds ?? 0) < 2 || prediction > 80) {
      newAlerts.push({ message: "ICU beds likely insufficient tomorrow!", type: "critical" });
    }
    if ((latestData.doctorsAvailable ?? 0) < 3) {
      newAlerts.push({ message: "Doctor availability is low!", type: "warning" });
    }
    setAlerts(newAlerts);

    setSevenDayTrend(generate7DayTrend(data));
  }, [selectedHospital, departmentFilter]);

  // ===== Hospital Selection Page =====
  if (!selectedHospital) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gradient-to-r from-purple-100 via-blue-50 to-green-50">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 animate-pulse text-center">
          <FaHospital className="inline mr-2" /> Select a Hospital
        </h1>
        <select
          className="border px-6 py-3 rounded-3xl shadow-xl text-lg hover:shadow-2xl transition duration-300 bg-white"
          value={selectedHospital}
          onChange={(e) => setSelectedHospital(e.target.value)}
        >
          <option value="">-- Choose Hospital --</option>
          {Object.keys(hospitalData).map((hospital) => (
            <option key={hospital} value={hospital}>
              {hospital}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ===== Dashboard =====
  return (
    <>
      <Navbar />
      <div className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl shadow-2xl max-w-7xl mx-auto mt-6 mb-12">
        <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 mb-8 animate-pulse">
          Predictive Hospital Dashboard
        </h1>

        {/* Hospital & Department Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
          <div className="w-full md:w-64">
            <label className="block font-semibold mb-2 text-lg">Select Hospital</label>
            <select
              className="border px-4 py-2 rounded-2xl shadow-md w-full hover:shadow-xl transition duration-300 bg-white"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              <option value="">-- Choose Hospital --</option>
              {Object.keys(hospitalData).map((hospital) => (
                <option key={hospital} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
          </div>

          

<div className="w-full md:w-64">
  <label className="block font-semibold mb-2 text-lg">Filter by Department</label>

  {/* Input box for selecting */}
  <div className="border rounded-2xl shadow-md px-3 py-2 bg-white flex flex-wrap gap-1 cursor-text hover:shadow-lg transition duration-300">
    {departmentFilter.length === 0 && (
      <span className="text-gray-400 text-sm">Select Departments...</span>
    )}

    {/* Selected Departments as tags */}
    {departmentFilter.map((dep) => (
      <span
        key={dep}
        className="bg-purple-200 text-purple-900 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
      >
        {dep}
        <button
          onClick={() =>
            setDepartmentFilter(departmentFilter.filter((d) => d !== dep))
          }
          className="ml-1 hover:text-red-600"
        >
          &times;
        </button>
      </span>
    ))}

    {/* Dropdown */}
    <select
      className="ml-1 flex-grow outline-none bg-white text-sm"
      value=""
      onChange={(e) => {
        const val = e.target.value;
        if (val && !departmentFilter.includes(val)) {
          setDepartmentFilter([...departmentFilter, val]);
        }
      }}
    >
      <option value="" disabled hidden>
        Select...
      </option>
      {["ICU", "ER", "General"].map((dep) => (
        <option key={dep} value={dep}>
          {dep}
        </option>
      ))}
    </select>
  </div>

  <p className="text-sm text-gray-500 mt-1">
    Click on a department to add. Click “×” to remove.
  </p>
</div>
        </div>

        {/* Prediction & Alerts */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-2 flex items-center justify-center gap-2">
              <FaUserMd /> Next Day Prediction
            </h2>
            <p className="text-5xl font-extrabold text-indigo-600">{predictedPatients} Patients</p>
          </div>

         {/* ===== AI Suggestions (Dynamic & Modern UI) ===== */}
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
  {filteredData.length > 0 ? (
    filteredData.map((d, idx) => {
      const isLowBeds = (d.icuBeds ?? 0) < 2;
      const isSafe = !isLowBeds;
      return (
        <div
          key={idx}
          className={`flex flex-col justify-between p-4 rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105
            ${isLowBeds ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg">{d.department}</h4>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold 
              ${isLowBeds ? "bg-red-200" : "bg-green-200"}`}
            >
              {isLowBeds ? "Critical" : "Stable"}
            </span>
          </div>
          <div className="text-sm mb-2">
            <p>
              <FaHospital className="inline mr-1" /> ICU Beds Available:{" "}
              <span className="font-semibold">{d.icuBeds ?? 0}</span>
            </p>
            <p>
              <FaUserMd className="inline mr-1" /> Doctors Available:{" "}
              <span className="font-semibold">{d.doctorsAvailable ?? 0}</span>
            </p>
            <p>
              <FaExclamationTriangle className="inline mr-1" /> Patients:{" "}
              <span className="font-semibold">{d.patients}</span>
            </p>
          </div>
          <div className="text-sm font-medium">
            {isLowBeds
              ? "⚠️ ICU beds are low! Consider reallocation."
              : "✅ Capacity sufficient."}
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-gray-500 col-span-full text-center">No department data to suggest from.</p>
  )}
</div>
        </div>

        {/* Combined Graph */}
        {filteredData.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl mb-10 hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
              Patients, ICU Beds & Doctors Availability
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date">
                  <Label value="Date" offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="patients" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="icuBeds" stroke="#f43f5e" strokeWidth={3} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="doctorsAvailable" stroke="#10b981" strokeWidth={3} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 7-Day Predicted Trend */}
        {sevenDayTrend.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl mb-10 hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">7-Day Predicted Trend</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={sevenDayTrend}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="date">
                  <Label value="Day" offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value}`, "Predicted Patients"]}
                  contentStyle={{ backgroundColor: "#f0f4f8", borderRadius: "8px" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-3 text-center font-semibold text-red-600">
              Critical days (patients &gt; 80) highlighted for attention
            </p>
          </div>
        )}

        {/* Export CSV */}
        {filteredData.length > 0 && (
          <div className="text-center mb-10">
            <button
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl font-bold shadow-lg hover:scale-105 hover:from-purple-700 hover:to-indigo-600 transition duration-300"
              onClick={() => exportToCSV(filteredData, selectedHospital)}
            >
              <FaDownload /> Export Filtered Data
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PredictiveDemand;