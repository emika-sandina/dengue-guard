import { supabase } from '../supabase.js';
import dotenv from 'dotenv';
//Load Variables
dotenv.config();

//function to insert data into the tabl
export const insertReportCases = async (data) => {

  //Map frontend data to column names
  const payload = {
    reporting_for: data.reportingFor,
    symptoms_start_date: data.symptomsStartDate, 
    symptoms: Array.isArray(data.symptoms) ? data.symptoms : [data.symptoms],
    location: data.location,
    doctor_status: data.doctorStatus,
    dengue_diagnosis: data.dengueDiagnosis,
    moh_area: typeof data.mohArea === 'object' && data.mohArea !== null ? data.mohArea.value : data.mohArea,
  };

  // Insert the data to table
  const { data: insertedData, error } = await supabase
    .from("dengue_cases")
    .insert([payload])
    .select(); // CRITICAL: Added select() to return the inserted row

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw error;
  }

  return insertedData;
};



