import { supabase } from '../supabase.js';
import dotenv from 'dotenv';
//Load Variables
dotenv.config();

//function to insert data into the tabl
export const insertReportCases = async (data) => {

  const payload = {
    reporting_for: data.reportingFor,
    symptoms_start_date: data.symptomsStartDate,
    symptoms: Array.isArray(data.symptoms) ? data.symptoms : [data.symptoms],
    location: data.location,
    doctor_status: data.doctorStatus,
    dengue_diagnosis: data.dengueDiagnosis,

    // mohArea handling (supports both string and object)
    moh_area:
      typeof data.mohArea === "object" && data.mohArea !== null
        ? data.mohArea.value
        : data.mohArea,

    // coordinates handling
    latitude: data.coordinates?.lat ?? data.latitude ?? null,
    longtitude: data.coordinates?.lng ?? data.longitude ?? data.longtitude ?? null,
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

};