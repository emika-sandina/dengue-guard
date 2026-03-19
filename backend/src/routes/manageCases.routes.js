import express from 'express';
const router = express.Router();

import { getDengueCases, updateStatus, assignPHI, deleteCase } from "../controllers/manageCases.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

// Authorization middleware to restrict access to MOH users only
const mohOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'moh') {
        return res.status(403).json({ message: 'Forbidden: MOH access only' });
    }
    next();
};

// Step 3: Define route for getting all reports
router.get("/report-cases", authMiddleware, mohOnly, getDengueCases);

// Step 6: Define route for updating report status
router.patch("/report-cases/:id/status", authMiddleware, mohOnly, updateStatus);

// Step 9: Define route for assigning PHI to a report
router.patch("/report-cases/:id/assign", authMiddleware, mohOnly, assignPHI);

// Step 10: Define route for deleting a report
router.delete("/report-cases/:id", authMiddleware, mohOnly, deleteCase);

export default router;
