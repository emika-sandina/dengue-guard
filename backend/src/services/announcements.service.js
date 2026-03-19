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
  // Fetch all announcements from the database, newest first
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  // Check if there was an error during fetch
  if (error) {
    console.log(error);
    throw new Error("Failed to fetch announcements!");
  }

  return data;
};
