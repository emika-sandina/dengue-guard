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
    console.log("SUCCESS: Case inserted into Supabase:", result);
    return res
      .status(200)
      .json({ message: "Report submitted successfully", result });
  } catch (error) {
    console.error("Error in submitReportCases:", error);
    return res.status(500).json({ 
      error: "Failed to submit report", 
      details: error.message || error 
    });
  }
};

// Export the controller function to use in route

// Step 2: Controller to fetch dengue cases, optionally filtered by MOH area
export const getDengueCases = async (req, res) => {
  try {
    // We import this directly into the function to avoid circular dependencies if any crop up
    const { getAllDengueCases } = await import("../services/reportCases.service.js");

    // Read the optional mohArea query param (e.g. GET /api/report-cases?mohArea=Colombo)
    const mohArea = req.query.mohArea || null;

    const cases = await getAllDengueCases(mohArea);
    console.log(
      `FETCH SUCCESS: Found ${cases?.length || 0} cases${mohArea ? ` for MOH area "${mohArea}"` : " (all areas)"} in Supabase.`
    );
    return res.status(200).json({ cases });
  } catch (error) {
    console.error("Error fetching dengue cases:", error);
    return res.status(500).json({ error: "Failed to fetch dengue cases" });
  }
};

// Step 5: Controller to update dengue case status (e.g. Verify or Resolve)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["verified", "resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status provided. Must be 'verified' or 'resolved'." });
    }

    const { updateCaseStatus } = await import("../services/reportCases.service.js");
    const result = await updateCaseStatus(id, status);
    
    return res.status(200).json({ message: "Case status updated successfully", result });
  } catch (error) {
    console.error("Error updating dengue case status:", error);
    return res.status(500).json({ error: "Failed to update dengue case status" });
  }
};

// Step 8: Controller to assign PHI to a dengue case
export const assignPHI = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignee } = req.body;

    if (!assignee) {
      return res.status(400).json({ error: "Assignee name is required." });
    }

    const { assignPHIToCase } = await import("../services/reportCases.service.js");
    const result = await assignPHIToCase(id, assignee);
    
    return res.status(200).json({ message: "PHI assigned successfully", result });
  } catch (error) {
    console.error("Error assigning PHI to dengue case:", error);
    return res.status(500).json({ error: "Failed to assign PHI to dengue case" });
  }
};

// Step 10: Controller to delete/remove a dengue case
export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    const { removeCase } = await import("../services/reportCases.service.js");
    const result = await removeCase(id);
    
    // Supabase returns an empty array if no rows were deleted (e.g., ID not found)
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Case not found or already deleted" });
    }

    return res.status(200).json({ message: "Dengue case deleted successfully", result });
  } catch (error) {
    console.error("Error deleting dengue case:", error);
    return res.status(500).json({ error: "Failed to delete dengue case" });
  }
};
