import { Ambulance } from "lucide-react";

const AmbulanceCard = () => {
  return (
    <div className="bg-white bg-opacity-100 rounded-xl shadow-md p-5">
      <div className="flex items-center gap-2 mb-4">
        <Ambulance className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-extrabold text-gray-900">
          Ambulances
        </h2>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between bg-gray-100 p-4 rounded-lg">
          <span className="text-lg font-semibold">A3</span>
          <span className="px-4 py-1 rounded-full bg-green-200 text-green-900 font-medium">
            Available
          </span>
        </div>

        <div className="flex justify-between bg-gray-100 p-4 rounded-lg">
          <span className="text-lg font-semibold">B1</span>
          <span className="px-4 py-1 rounded-full bg-yellow-200 text-yellow-900 font-medium">
            En Route
          </span>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceCard;