import { insertReportCases, fetchReportCaseLocations } from "../services/reportCases.service.js";

// Controller function to handle submission of dengue report cases
export const submitReportCases = async (req, res) => {
  try {
    // Get form data sent from frontend
    const reportData = req.body;

    const requiredFields = [
      "reportingFor",
      "symptoms",
      "doctorStatus",
      "mohArea",
      "location",
      "symptomsStartDate",
      "latitude",
      "longtitude"
    ];

    // Check if all the inputs are present
    for (const field of requiredFields) {
      if (!reportData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    if (reportData.doctorStatus === "Yes" && !reportData.dengueDiagnosis) {
      return res.status(400).json({
        error: "dengueDiagnosis is required when doctor has been consulted",
      });
    }
    
    // Call the service layer function to insert data into Supabase
    const result = await insertReportCases(reportData);
    
    console.log("SUCCESS: Case inserted into Supabase:", result);
    
    return res.status(200).json({
      message: "Report submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Error in submitReportCases:", error);
    const responseBody = {
      error: "Failed to submit report",
    };
    if (process.env.NODE_ENV !== "production") {
      responseBody.details = error.message || String(error);
    }
    return res.status(500).json(responseBody);
  }
};

// Controller function to fetch all dengue report case locations
export const getReportCaseLocations = async (req, res) => {
  try {
    const cases = await fetchReportCaseLocations(); // Make sure this function exists in service
    return res.status(200).json(cases);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch report cases" });
  }
};
