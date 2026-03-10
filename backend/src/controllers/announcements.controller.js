import {
  insertAnnouncement,
  getAllAnnouncements,
} from "../services/announcements.service.js";

export const sendAnnouncement = async (req, res) => {
  // Get announcement details from the request body
  const { title, targetArea, type, description } = req.body;

  // Check that all required fields are provided
  if (!title || !targetArea || !type || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Save the announcement to the database
    const data = await insertAnnouncement({
      title,
      targetArea,
      type,
      description,
    });

    return res
      .status(201)
      .json({ message: "Announcement sent successfully", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    // Retrieve all announcements from the database
    const data = await getAllAnnouncements();

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
