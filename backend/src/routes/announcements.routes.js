import express from "express";
import {
  sendAnnouncement,
  getAnnouncements,
} from "../controllers/announcements.controller.js";

const router = express.Router();

// POST /api/send-announcement - saves a new announcement to the database
router.post("/send-announcement", sendAnnouncement);

// GET /api/announcements - retrieves all announcements from the database
router.get("/announcements", getAnnouncements);

export default router;
