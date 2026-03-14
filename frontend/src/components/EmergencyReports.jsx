import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

const EmergencyReport = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    symptoms: "",
    patients: 1,
    location: "",
    file: null,
  });
  const [aiResult, setAIResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      let severity = "Medium";
      let specialization = "General Practitioner";

      if (form.symptoms.toLowerCase().includes("heart")) {
        severity = "Critical";
        specialization = "Cardiologist";
      } else if (form.symptoms.toLowerCase().includes("bone")) {
        severity = "Medium";
        specialization = "Orthopedics";
      }

      setAIResult({ severity, specialization });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            📝 Report Emergency
          </h1>
          <p className="text-gray-600 md:text-lg">
            Describe your emergency and our AI will suggest the best medical response.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 border-t-8 border-blue-600"
        >
          {/* Name + Location */}
          <div className="flex flex-col md:flex-row md:gap-6">
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="flex-1 border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            />

            <input
              type="text"
              placeholder="Location (optional)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="flex-1 border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate mt-4 md:mt-0"
            />
          </div>

          {/* Symptoms */}
          <textarea
            placeholder="Describe the emergency / symptoms"
            value={form.symptoms}
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            required
          />

          {/* Patients + File */}
          <div className="flex flex-col md:flex-row md:gap-6 items-center">
  {/* Number of Patients */}
  <div className="flex-1">
    <label className="block mb-1 text-gray-600 font-medium">Number of Patients</label>
    <input
      type="number"
      min={1}
      value={form.patients}
      onChange={(e) => setForm({ ...form, patients: e.target.value })}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* File Upload */}
  <div className="flex-1 mt-4 md:mt-0">
    <label className="block mb-1 text-gray-600 font-medium">Attach Photo / Voice (optional)</label>
    <input
      type="file"
      onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
      className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {form.file && (
      <p className="text-sm text-gray-500 mt-1 truncate">
        Selected file: {form.file.name}
      </p>
    )}
  </div>
</div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:scale-105 transform transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Submit Emergency"}
          </button>
        </form>

        {/* AI Result Card */}
        {aiResult && (
          <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-3xl shadow-2xl border-l-8 border-red-600 space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">AI Suggestion</h2>
            <p>
              Severity:{" "}
              <span
                className={`font-bold ${
                  aiResult.severity === "Critical"
                    ? "text-red-600"
                    : aiResult.severity === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {aiResult.severity}
              </span>
            </p>
            <p>
              Required Specialist:{" "}
              <span className="font-bold text-blue-600">{aiResult.specialization}</span>
            </p>

            <div className="flex gap-4 flex-wrap mt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition shadow-lg"
              >
                View Live Map
              </button>
              <button
                onClick={() => navigate("/doctor")}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition shadow-lg"
              >
                View Available Doctors
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EmergencyReport;