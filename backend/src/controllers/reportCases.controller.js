import { insertReportCases } from "../services/reportCases.service.js";

// Controller function to handle submission of dengue report cases
export const submitReportCases = async (req, res) => {
  try {
    // Get form data sent from frontend
    const reportData = req.body;

    const requiredFields = [
      "reportingFor",
      "symptoms",
      "doctorStatus",
      "dengueDiagnosis",
      "mohArea",
      "location",
      "symptomsStartDate",
    ];

    //Check if all the inputs are present
    for (const field of requiredFields) {
      if (!reportData[field]) {
        return res.status(400).json({ error: `${field} is reqired` });
      }
    }
    // Call the service layer function to insert data into Supabase
    const result = await insertReportCases(reportData);
    return res
      .status(200)
      .json({ message: "Report submitted successfully", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit report" });
  }
};

// Export the controller function to use in route

// Step 2: Controller to fetch all dengue cases
export const getDengueCases = async (req, res) => {
  try {
    // We import this directly into the function to avoid circular dependencies if any crop up
    const { getAllDengueCases } = await import("../services/reportCases.service.js");
    
    const cases = await getAllDengueCases();
    return res.status(200).json({ cases });
  } catch (error) {
    console.error("Error fetching dengue cases:", error);
    return res.status(500).json({ error: "Failed to fetch dengue cases" });
  }
};
