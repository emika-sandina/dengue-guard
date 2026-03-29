import express from "express";
//import the controller function
import { getDashboardSummary } from "../controllers/dashboard.controller.js";

// Create a new Express router to handle dashboard-specific requests
const router = express.Router();

// Define a GET endpoint to fetch the dashboard data.
// The ':userId' in the URL is a dynamic parameter that captures the ID of the logged-in user.
// When the frontend makes a request to this URL, it passes control to the getDashboardSummary controller.
router.get("/dashboard-summary/:userId", getDashboardSummary);

// Export the router so it can be imported and used in the main server setup
export default router;