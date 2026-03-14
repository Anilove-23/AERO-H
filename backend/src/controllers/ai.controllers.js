import { EmergencyCase } from "../models/emergencyCase.model.js";

export const updateTriage = async (req, res) => {
  const { emergencyId, severityScore, priority, specialization } = req.body;

  const emergency = await EmergencyCase.findByIdAndUpdate(
    emergencyId,
    {
      severityScore,
      priority,
      requiredSpecialization: specialization,
      status: "triaged"
    },
    { new: true }
  );

  res.json({
    success: true,
    emergency
  });
};