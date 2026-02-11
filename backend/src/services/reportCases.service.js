const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
//Load Variables
dotenv.config();

//Intialize database using variables
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

//function to insert data into the tabl
const insertReportCases = async (data) => {

  //Map frontend data to column names
  const payload = {
    reporting_for: data.reportingFor,
    symptoms_start_date: data.symptomsStartDate, 
    symptoms: data.symptoms,
    location: data.location,
    doctor_status: data.doctorStatus,
    dengue_diagnosis: data.dengueDiagnosis,
    moh_area: data.mohArea,

  };

  //Inser the data to table
  const { data: insertedData, error } = await supabase
    .from("dengue_cases")
    .insert([payload]);

  if (error) throw error;

  return insertedData;
};

module.exports = { insertReportCases };

