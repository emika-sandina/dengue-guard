import express from 'express';
const router = express.Router();

import { getDengueCases, updateStatus, assignPHI, deleteCase } from "../controllers/manageCases.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

// Step 3: Define route for getting all reports
router.get("/report-cases", authMiddleware, getDengueCases);

// Step 6: Define route for updating report status
router.patch("/report-cases/:id/status", authMiddleware, updateStatus);

// Step 9: Define route for assigning PHI to a report
router.patch("/report-cases/:id/assign", authMiddleware, assignPHI);

// Step 10: Define route for deleting a report
router.delete("/report-cases/:id", authMiddleware, deleteCase);

export default router;
