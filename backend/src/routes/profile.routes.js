import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getProfile);
router.put("/", authenticateToken, updateProfile);

export default router;