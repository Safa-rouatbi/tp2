import api, { API_BASE_URL } from "./api";

export const createProject = async (projectData) => {
  const res = await api.post(`${API_BASE_URL}/projects`, projectData);
  return res.data;
};

export const getMyProjects = async () => {
  const res = await api.get(`${API_BASE_URL}/projects`);
  return res.data;
};

export const updateProject = async (id, projectData) => {
  const res = await api.put(`${API_BASE_URL}/projects/${id}`, projectData);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`${API_BASE_URL}/projects/${id}`);
  return res.data;
};
