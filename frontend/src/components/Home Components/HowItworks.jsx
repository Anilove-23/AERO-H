const steps = [
  {
    emoji: "📱",
    title: "1️⃣ Emergency Reported",
    desc: "User shares location and symptoms via app.",
  },
  {
    emoji: "🧠",
    title: "2️⃣ AI Triage",
    desc: "Gemini AI evaluates severity and required specialization.",
  },
  {
    emoji: "🚑",
    title: "3️⃣ Optimization",
    desc: "System selects nearest hospital and best resources.",
  },
  {
    emoji: "📊",
    title: "4️⃣ Live Monitoring",
    desc: "Track ambulances, hospitals, and doctor allocation in real-time.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 flex-1 shadow-lg hover:shadow-indigo-400/30 transition transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-3xl mb-4">
                {step.emoji}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;