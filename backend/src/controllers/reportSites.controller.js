import * as breedingService from "../services/reportSites.service.js";

export const submitSiteReports = async (req, res) => {
  try {
    const reportData = req.body;
    const file = req.file;

    const data = await breedingService.insertSiteReports(
      reportData,
      file
    );

    res.status(201).json({
      message: "Breeding site report uploaded successfully!",
      data,
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to save report: " + error.message,
    });
  }
};