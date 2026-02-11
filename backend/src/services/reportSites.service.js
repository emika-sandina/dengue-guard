const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
//Load Variables
dotenv.config();

//Intialize database using variables
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const insertSiteReports = async (reportData) => {

  //Match frontend data to the column names in the table
  const payload = {
    location: reportData.location,
    description: reportData.description,
    issue_type: reportData.issueType,
    urgency: reportData.urgency,
    moh_area: reportData.mohArea,
    photo_url: reportData.photoUrl
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

//Export the function to be used in the controller
module.exports = { insertSiteReports };