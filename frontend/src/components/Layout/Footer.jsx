import React from "react";

const Footer = () => {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">

        {/* BRAND */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 
                            flex items-center justify-center shadow-lg">
              <span className="text-white font-black italic text-lg">AH</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              AERO<span className="text-blue-300">-H</span>
            </h2>
          </div>

          <p className="text-sm text-blue-100 leading-relaxed max-w-xs">
            Building the future of smarter, connected healthcare.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-bold mb-5">Quick Links</h3>
          <ul className="space-y-3 text-sm text-blue-100">
            <li>
              <a href="/" className="hover:text-white transition underline">
                Home
              </a>
            </li>
            <li>
              <a href="/dashboard" className="hover:text-white transition underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/doctor" className="hover:text-white transition underline">
                Doctors
              </a>
            </li>
            <li>
              <a href="/blood-donor" className="hover:text-white transition underline">
                Blood Donors
              </a>
            </li>
            <li>
              <a href="/pharmacies" className="hover:text-white transition underline">
                Pharmacies
              </a>
            </li>
          </ul>
        </div>

        {/* PLATFORM */}
        <div>
          <h3 className="text-lg font-bold mb-5">Platform</h3>
          <ul className="space-y-3 text-sm text-blue-100">
            <li>
              <a href="/predictive-demand" className="hover:text-white transition underline">
                Predictive Demand
              </a>
            </li>
            <li>
              <a href="/emergency" className="hover:text-white transition underline">
                Emergency Reports
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-white transition underline">
                User Profile
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition underline">
                About Project
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-bold mb-5">Contact</h3>
          <ul className="space-y-4 text-sm text-blue-100">
            <li>
              <span className="block font-semibold text-white">Phone</span>
              <a href="tel:+15551234567" className="hover:text-white transition">
                +1 (555) 123-4567
              </a>
            </li>
            <li>
              <span className="block font-semibold text-white">Email</span>
              <a href="mailto:support@aeroh.com" className="hover:text-white transition">
                support@aeroh.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/10"></div>

      {/* BOTTOM */}
      <div className="relative max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row 
                      items-center justify-between text-xs text-blue-200 gap-4">
        <p>© {new Date().getFullYear()} AERO-H. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/privacy-policy" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white transition">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;