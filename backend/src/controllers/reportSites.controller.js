import * as breedingService from "../services/reportSites.service.js";

export const submitSiteReports = async (req, res) => {
  try {
    //Get the form body and the uploaded image from the client
    const reportData = req.body;
    const file = req.file;

    // ✅ FIX: convert coordinates to numbers
    reportData.latitude = parseFloat(reportData.latitude);
    reportData.longitude = parseFloat(reportData.longitude);
    
    // Optional safety check
    if (!reportData.latitude || !reportData.longitude) {
      return res.status(400).json({
        error: "Coordinates are required",
      });
      }
    //Sending both the data and the image of the report back to the service.
    const data = await breedingService.insertSiteReports(
      reportData,
      file
    );

    //If the report upload is successful
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