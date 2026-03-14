import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Blood Donors", path: "/blood-donor" },
    
    { name: "Doctors", path: "/doctor" },
    { name: "Predict Demand", path: "/predictive-demand" },
  ];

  return (
    <nav
      className="sticky top-0 z-50
      bg-gradient-to-r from-blue-50 via-white to-blue-100
      backdrop-blur-xl
      shadow-sm
      border-b border-blue-100/50"
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800
              flex items-center justify-center shadow-lg shadow-blue-300"
            >
              {/* Medical Cross */}
              <div className="absolute w-5 h-1.5 bg-white rounded"></div>
              <div className="absolute w-1.5 h-5 bg-white rounded"></div>

              {/* Inner ring */}
              <div className="absolute inset-1.5 border border-white/30 rounded-xl"></div>
            </div>
          </div>

          <div className="leading-tight">
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-blue-600">AERO</span>
              <span className="text-blue-900">-H</span>
            </h1>
            
          </div>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-9">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="relative text-[15px] font-semibold text-slate-600
                         transition-all duration-300 hover:text-blue-600 group"
            >
              {link.name}
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0
                bg-gradient-to-r from-blue-500 to-blue-700
                transition-all duration-300 group-hover:w-full"
              />
            </a>
          ))}
        </div>

        {/* CTA + MOBILE TOGGLE */}
        <div className="flex items-center gap-4">
          <a
            href="/emergency"
            className="hidden sm:block px-7 py-2.5 text-sm font-bold text-white rounded-xl
            bg-gradient-to-r from-blue-600 to-blue-800
            shadow-lg shadow-blue-200
            hover:scale-105 hover:shadow-blue-300
            active:scale-95 transition-all"
          >
            Emergency Report
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-blue-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div
          className="md:hidden
          bg-gradient-to-b from-blue-50 to-white
          backdrop-blur-xl
          border-t border-blue-100/50
          px-6 py-6 space-y-5"
        >
          {links.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="block text-blue-800 font-semibold text-sm
                         hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}

          <a
            href="/profile"
            className="block w-full text-center py-3 rounded-xl text-white font-bold
            bg-gradient-to-r from-blue-600 to-blue-800 shadow-md"
          >
            Book Appointment
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;