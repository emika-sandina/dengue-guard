import { getDashboardSummaryByUserId } from "../services/dashboard.service.js";

// This function handles the incoming HTTP request for the user's dashboard data
export const getDashboardSummary = async (req, res) => {
  try {
    // Extract the userId from the request parameters (the dynamic part of the URL)
    const { userId } = req.params;

    // Verify that a userId was actually provided.
    // If it's missing, send back a 400 (Bad Request) error to let the frontend know the request was invalid.
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Pass the userId to our service function, which handles the actual database communication
    // and calculates the total case and site counts.
    const summary = await getDashboardSummaryByUserId(userId);

    // If the data was successfully retrieved, send it back to the client with a 200 (OK) status code.
    return res.status(200).json(summary);
    
  } catch (error) {
    // If anything goes wrong (like a database connection issue or a missing column),
    // catch the error here and return a 500 (Internal Server Error) with a descriptive message.
    return res
      .status(500)
      .json({ error: `Failed to load dashboard data: ${error.message}` });
  }
};