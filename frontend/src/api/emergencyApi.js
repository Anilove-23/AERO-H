import api from "./api";

export const reportEmergency = async (data, token) => {

  const res = await api.post(
    "/emergencies",
    data,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  return res.data;
};