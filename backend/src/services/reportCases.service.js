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
  };

  //Inser the data to table
  const { data: insertedData, error } = await supabase
    .from("dengue_cases")
    .insert([payload]);

  if (error) throw error;

  return insertedData;
};

// Step 1: Fetch all dengue cases from the database
export const getAllDengueCases = async () => {
  const { data, error } = await supabase
    .from("dengue_cases")
    .select("*")
    .order("created_at", { ascending: false }); // Show newest cases first

  if (error) throw error;

  return data;
};

// Step 4: Update status of a dengue case (e.g. Verify or Resolve)
export const updateCaseStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("dengue_cases")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};

// Step 7: Assign PHI to a dengue case
export const assignPHIToCase = async (id, assignee) => {
  const { data, error } = await supabase
    .from("dengue_cases")
    .update({ assignee })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};

// Step 10: Remove/Delete a dengue case
export const removeCase = async (id) => {
  const { data, error } = await supabase
    .from("dengue_cases")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};



