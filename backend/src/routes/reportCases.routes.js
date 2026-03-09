import express from 'express'
const router = express.Router();

// import controller
import { submitReportCases, getDengueCases, updateStatus, assignPHI, deleteCase } from "../controllers/reportCases.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

// Health-check 
router.get("/report-case", (req, res) => {
  res.json({ status: "ok", message: "report-case endpoint is reachable" });
});

// Step 3: Define route for getting all reports
router.get("/report-cases", authMiddleware, getDengueCases);

// Step 6: Define route for updating report status
router.patch("/report-cases/:id/status", authMiddleware, updateStatus);

// Step 9: Define route for assigning PHI to a report
router.patch("/report-cases/:id/assign", authMiddleware, assignPHI);

// Step 10: Define route for deleting a report
router.delete("/report-cases/:id", authMiddleware, deleteCase);

// Define route for creating a report
router.post("/report-case", authMiddleware, submitReportCases);

// export router to app.js
export default router;
