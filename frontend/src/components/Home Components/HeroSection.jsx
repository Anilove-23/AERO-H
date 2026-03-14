import { Link } from "react-router-dom";
import LiveStatus from "./LiveStatus";
const userLocation = { lat: 28.6139, lng: 77.209 };
const hospitals = [
  { id: "H1", name: "Central Hospital", icuBeds: 3, available: true },
  { id: "H2", name: "City Care", icuBeds: 0, available: false },
];
const ambulances = [{ id: "A1" }, { id: "A2" }, { id: "A3" }];
const aiStatus = "Running";
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 min-h-[90vh] flex items-center">
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black opacity-25"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT: Headline + CTA */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              AI-Powered <br />
              <span className="text-yellow-400">Emergency Healthcare</span>
            </h1>

            <p className="text-gray-200 text-lg md:text-xl mb-8">
              Real-time ambulance tracking, nearest hospital detection, and intelligent emergency coordination powered by Gemini AI.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                to="/dashboard"
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transform transition"
              >
                Dashboard
              </Link>

               <a
  href="#how-it-works"
  className="bg-white text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transform transition"
>
  How It Works
</a>
            </div>
          </div>

          {/* RIGHT: Interactive Feature Card */}
          <div className="hidden md:flex justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition duration-500">

              {/* LIVE Badge */}
              <div className="flex items-center mb-6">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse mr-2">
                  LIVE
                </span>
                <span className="font-semibold text-gray-800">Live Updates Preview</span>
              </div>

              <LiveStatus
  userLocation={userLocation}
  hospitals={hospitals}
  ambulances={ambulances}
  aiStatus={aiStatus}
/>

              {/* CTA button inside card */}
              <div className="mt-6 text-center">
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transform transition"
                >
                  Explore Live Updates
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;