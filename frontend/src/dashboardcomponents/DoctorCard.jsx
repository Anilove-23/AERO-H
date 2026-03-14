import { Stethoscope } from "lucide-react";

const DoctorCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-gray-900">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Stethoscope className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-extrabold tracking-wide">
          Doctors
        </h2>
      </div>

      {/* Doctor List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span className="text-base font-semibold">Dr. Mehta</span>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-200 text-blue-800">
            Senior
          </span>
        </div>

        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
          <span className="text-base font-semibold">Dr. Reddy</span>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-200 text-gray-800">
            Junior
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;