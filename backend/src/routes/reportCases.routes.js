import express from 'express'
const router = express.Router();

// import controller
import { submitReportCases, getDengueCases, updateStatus } from "../controllers/reportCases.controller.js";

// Health-check 
router.get("/report-case", (req, res) => {
  res.json({ status: "ok", message: "report-case endpoint is reachable" });
});

// Step 3: Define route for getting all reports
router.get("/report-cases", getDengueCases);

// Step 6: Define route for updating report status
router.patch("/report-cases/:id/status", updateStatus);

// Define route for creating a report
router.post("/report-case", submitReportCases);

// export router to app.js
export default router;
