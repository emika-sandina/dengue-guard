const express = require('express');
const router = express.Router();

// import controller
const { submitReportCases } = require("../controllers/reportCases.controller");

// Health-check 
router.get("/report-case", (req, res) => {
  res.json({ status: "ok", message: "report-case endpoint is reachable" });
});

// Define route for creating a report
router.post("/report-case", submitReportCases);

// export router to app.js
module.exports = router;
