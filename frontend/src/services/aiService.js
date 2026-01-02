import api, { API_BASE_URL } from "./api";

// Analyze a submission using AI
export const analyzeSubmission = async (submissionId) => {
  const res = await api.post(`${API_BASE_URL}/reviews/ai/${submissionId}`);
  return res.data;
};
