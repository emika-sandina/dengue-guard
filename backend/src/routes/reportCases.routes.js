import express from 'express'
const router = express.Router();

// import controller
import { submitReportCases, getReportCaseLocations } from "../controllers/reportCases.controller.js";
// Health-check 
router.get("/report-case", (req, res) => {
  res.json({ status: "ok", message: "report-case endpoint is reachable" });
});

// Define route for creating a report
router.post("/report-case", submitReportCases);
// GET: Fetch all report locations
router.get("/report-case/data", getReportCaseLocations);

// export router to app.js
export default router;