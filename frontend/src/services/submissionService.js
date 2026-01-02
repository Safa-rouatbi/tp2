import api, { API_BASE_URL } from "./api";

export const createSubmission = async (data) => {
  const res = await api.post(`${API_BASE_URL}/submissions`, data);
  return res.data;
};

export const getProjectSubmissions = async (projectId) => {
  const res = await api.get(`${API_BASE_URL}/submissions/project/${projectId}`);
  return res.data;
};

export const getSubmissionById = async (id) => {
  const res = await api.get(`${API_BASE_URL}/submissions/${id}`);
  return res.data;
};
