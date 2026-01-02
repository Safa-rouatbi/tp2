import api, { API_BASE_URL } from "./api";

// Login
export const login = async (data) => {
  const response = await api.post(`${API_BASE_URL}/login`, data);
  return response.data;
};

// Register
export const register = async (data) => {
  const response = await api.post(`${API_BASE_URL}/register`, data);
  return response.data;
};
