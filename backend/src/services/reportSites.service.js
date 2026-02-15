import { supabase } from "../supabase.js";
import dotenv from 'dotenv';
//Load Variables
dotenv.config();

export const insertSiteReports = async (reportData) => {
  //Match frontend data to the column names in the table
  const payload = {
    location: reportData.location,
    description: reportData.description,
    issue_type: reportData.issueType,
    urgency: reportData.urgency,
    moh_area: reportData.mohArea,
    photo_url: reportData.photoUrl,
  };

  //Uses the supabase client to access the breeding_sites table
  const { data: insertedData, error } = await supabase
    .from("breeding_sites")
    .insert([payload]);
  //returns an error to the controller if any error occurs
  if (error) throw error;
  //returns the newly created data back to the controller
  return insertedData;
};

