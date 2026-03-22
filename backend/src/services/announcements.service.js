import { supabase } from "../supabase.js";

export const insertAnnouncement = async (announcementData) => {
  // Insert the announcement into the announcements table
  const data = await supabase
    .from("announcements")
    .insert([
      {
        title: announcementData.title,
        target_area: announcementData.targetArea,
        type: announcementData.type,
        description: announcementData.description,
      },
    ])
    .select();

  // Check if there was an error during insert
  if (data.error) {
    console.log(data.error);
    throw new Error("Failed to send announcement!");
  }

  return data;
};

export const getAllAnnouncements = async () => {
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, description, type, target_area, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    throw new Error("Failed to fetch announcements!");
  }
  return data;
};
