// configure route mapping to keep application modular
import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

// create a router instance to mount endpoints
const router = express.Router();

// attach authMiddleware to secure the GET route before fetching data
router.get("/", authMiddleware, getProfile);

// attach authMiddleware to secure the PUT route before updating data
router.put("/", authMiddleware, updateProfile);

export default router;