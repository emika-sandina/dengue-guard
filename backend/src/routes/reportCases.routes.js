import express from 'express';
const router = express.Router();

// import controller
import { submitReportCases, getReportCaseLocations } from "../controllers/reportCases.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

// Health-check 
router.get("/report-case", (req, res) => {
  res.json({ status: "ok", message: "report-case endpoint is reachable" });
});


// GET: Fetch all report locations
router.get("/report-case/data", getReportCaseLocations);
router.post("/report-case", authMiddleware, submitReportCases);

// export router to app.js
export default router;