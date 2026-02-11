// backend/src/controllers/breedingSites.controller.js
import * as breedingService from '../services/reportSites.service.js';

export const submitSiteReports = async (req, res) => {
  try {
    //Passing the body from the react form to the function in the service file
    const data = await breedingService.insertSiteReports(req.body);

    //If successful,send a 201 (Created) status and the data back to React

    res.status(201).json({ 
      message: "Breeding site report uploaded successfully!", 
      data 
    });
  } 
  
  catch (error) {
    //If the database or service fails,send a 500 (Server Error) status
    res.status(500).json({ 
      error: "Failed to save report: " + error.message 
    });
  }
};