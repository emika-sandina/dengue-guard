import { getDashboardSummaryByUserId } from "../services/dashboard.service.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const summary = await getDashboardSummaryByUserId(userId);

    return res.status(200).json(summary);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to load dashboard data: ${error.message}` });
  }
};
