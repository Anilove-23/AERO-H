const features = [
  {
    emoji: "🚑",
    title: "Real-Time Ambulance Tracking",
    desc: "Locate and monitor ambulances instantly with live updates.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    emoji: "🏥",
    title: "Hospital Load Balancing",
    desc: "Distribute patients intelligently across hospitals to avoid overcrowding.",
    color: "from-red-400 to-pink-500",
  },
  {
    emoji: "🧠",
    title: "AI Doctor Allocation",
    desc: "Assign the right specialist automatically using Gemini AI.",
    color: "from-green-400 to-teal-500",
  },
  {
    emoji: "📊",
    title: "Predictive Healthcare Forecasting",
    desc: "Plan resources ahead using event and demand predictions.",
    color: "from-blue-400 to-indigo-500",
  },
];

const Features = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-gray-800">
          Key Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-indigo-400/50 transition transform hover:-translate-y-3 cursor-pointer"
            >
              {/* Gradient Circle with Emoji */}
              <div
                className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br ${f.color} text-white text-3xl mb-6`}
              >
                {f.emoji}
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-800">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>

              {/* Optional “Learn More” hover effect */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-blue-600 font-medium text-sm">
                Learn More →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;