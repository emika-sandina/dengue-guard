import { getAllDengueCases, updateCaseStatus, assignPHIToCase, removeCase } from "../services/manageCases.service.js";

// Step 3: Get all reports
export const getDengueCases = async (req, res) => {
  try {
    const mohArea = req.query.mohArea || (req.user && req.user.mohArea) || null;
    const cases = await getAllDengueCases(mohArea);
    res.status(200).json({ cases });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Step 6: Update status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateCaseStatus(id, status);
    res.status(200).json({ message: "Status updated successfully", case: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Step 9: Assign PHI
export const assignPHI = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignee } = req.body;
    const updated = await assignPHIToCase(id, assignee);
    res.status(200).json({ message: "Assigned successfully", case: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Step 10: Delete case
export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await removeCase(id);
    res.status(200).json({ message: "Deleted successfully", case: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
