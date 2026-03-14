import React from "react";

const NotificationFeed = ({ emergencies }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg h-96 overflow-y-auto space-y-3">
      <h2 className="text-xl font-bold mb-3 text-gray-800">🚨 Emergency Notifications</h2>

      {emergencies.length === 0 && (
        <p className="text-gray-500 text-sm">No emergencies currently.</p>
      )}

      {emergencies.map((e) => {
        const severityColor =
          e.severity === "Critical"
            ? "bg-red-100 text-red-800"
            : e.severity === "Medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800";

        const time = new Date(e.id).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        return (
          <div
            key={e.id}
            className="flex justify-between items-center p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div>
              <p className="font-semibold text-gray-800">🚨 Emergency</p>
              <p className="text-gray-500 text-sm">
                Location: {e.lat.toFixed(3)}, {e.lng.toFixed(3)}
              </p>
              <p className="text-gray-500 text-sm">Time: {time}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColor}`}>
              {e.severity}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationFeed;