import api from "./axios";

export const registerUser = (payload) => api.post("/api/auth/register/", payload);
export const loginUser = (payload) => api.post("/api/auth/login/", payload);
export const refreshToken = (payload) => api.post("/api/auth/refresh/", payload);

export const fetchWeather = (params, token) =>
  api.get("/api/weather/", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const createPrediction = (payload, token) =>
  api.post("/api/predictions/", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getPredictions = (token) =>
  api.get("/api/predictions/", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getPredictionStats = (token) =>
  api.get("/api/predictions/stats/", {
    headers: { Authorization: `Bearer ${token}` },
  });
