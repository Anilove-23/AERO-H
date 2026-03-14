import { Hospital } from "lucide-react";

const HospitalCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-gray-900">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Hospital className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-extrabold tracking-wide">
          Hospitals
        </h2>
      </div>

      {/* Hospital List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span className="text-base font-semibold">
            Central Hospital
          </span>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-200 text-purple-800">
            ICU: 4
          </span>
        </div>

        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span className="text-base font-semibold">
            City Hospital
          </span>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-200 text-purple-800">
            ICU: 1
          </span>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;