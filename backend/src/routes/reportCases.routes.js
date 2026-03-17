import express from 'express'
const router = express.Router();

// import controller
import { submitReportCases } from "../controllers/reportCases.controller.js";
// Health-check 
router.get("/report-case", (req, res) => {
  res.json({ status: "ok", message: "report-case endpoint is reachable" });
});

// Define route for creating a report
router.post("/report-case", submitReportCases);

// export router to app.js
export default router;
