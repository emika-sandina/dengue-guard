import express from "express";
import multer from "multer";
import { submitSiteReports } from "../controllers/breedingSites.controller.js";

const router = express.Router();

// Configure multer to store the file temporarily in the RAM
const storage = multer.memoryStorage();

//Creating the multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Compressing and limiting the file size of img to 5MB
  fileFilter: (req, file, cb) => {
    //Should only accept images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
    //Should reject non image files 
      cb(new Error("Only images allowed"));
    }
  },
});

// Attach middleware before controller
router.post(
  "/report-sites",
  upload.single("photo"),
  submitSiteReports
);

export default router;