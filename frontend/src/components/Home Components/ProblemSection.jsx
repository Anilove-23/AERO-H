const problems = [
  {
    emoji: "🚑",
    title: "Ambulances Delay",
    desc: "Traffic and poor coordination slow response.",
  },
  {
    emoji: "🏥",
    title: "Hospital Overcrowding",
    desc: "ERs and ICUs often full, making allocation hard.",
  },
  {
    emoji: "🧠",
    title: "Doctors Not Assigned",
    desc: "Right specialists may not reach patients in time.",
  },
];

const ProblemSection = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
          The Problems We Solve
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 w-full md:w-1/3"
            >
              <div className="text-4xl mb-3">{p.emoji}</div>
              <h3 className="text-xl font-semibold mb-1 text-gray-800">
                {p.title}
              </h3>
              <p className="text-gray-600 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-gray-800 font-medium text-base md:text-lg">
          Emergencies fail not because of lack of resources — but poor coordination.
        </p>
      </div>
    </section>
  );
};

export default ProblemSection;