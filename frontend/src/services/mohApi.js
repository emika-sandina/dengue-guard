// frontend/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchDashboardSummary = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard-summary/${userId}`
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to fetch dashboard summary");
  }

  return response.json();
};
