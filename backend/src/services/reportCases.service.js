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
    symptoms: data.symptoms,
    location: data.location,
    doctor_status: data.doctorStatus,
    dengue_diagnosis: data.dengueDiagnosis,
    moh_area: data.mohArea,
    latitude: data.coordinates?.lat ?? data.latitude ?? null,
    longtitude: data.coordinates?.lng ?? data.longtitude ?? data.longitude ?? null,
  };

  //Inser the data to table
  const { data: insertedData, error } = await supabase
    .from("dengue_cases")
    .insert([payload]);

  if (error) throw error;

  return insertedData;
};

export const fetchReportCaseLocations = async () => {
  const { data, error } = await supabase
    .from("dengue_cases")
    .select("id, reporting_for, location, latitude, longtitude, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    coordinates:
      row.latitude != null && row.longtitude != null
        ? { lat: row.latitude, lng: row.longtitude }
        : null,
  }));
}