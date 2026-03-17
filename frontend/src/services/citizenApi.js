export const fetchDashboardSummary = async (userId) => {
  const response = await fetch(
    `http://localhost:5000/api/dashboard-summary/${userId}`,
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to fetch dashboard summary");
  }

  return response.json();
};
