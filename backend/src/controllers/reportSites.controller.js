import * as breedingService from "../services/reportSites.service.js";

export const submitSiteReports = async (req, res) => {
  try {
    //Get the form body and the uploaded image from the client
    const reportData = req.body;
    const file = req.file;

    // convert coordinates to numbers
    reportData.latitude = parseFloat(reportData.latitude);
    reportData.longtitude = parseFloat(reportData.longtitude);
    
    // Optional safety check
    if (
      !Number.isFinite(reportData.latitude) ||
      !Number.isFinite(reportData.longtitude)
    ) {
      return res.status(400).json({
        error: "Valid coordinates are required",
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

export const getBreedingSitesLocations = async (req, res) => {
  try {
    const data = await breedingService.fetchBreedingSitesLocations();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch breeding sites",
    });
  }
};