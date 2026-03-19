import { supabase } from '../supabase.js';

// Fetch dengue cases from the database, optionally filtered by MOH area
export const getAllDengueCases = async (mohArea = null) => {
  let query = supabase
    .from("dengue_cases")
    .select("*")
    .order("created_at", { ascending: false }); // Show newest cases first

  // If a specific MOH area is provided, filter to only that division's cases
  if (mohArea) {
    query = query.eq("moh_area", mohArea);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase Fetch Error:", error);
    throw error;
  }

  return data || [];
};

// Update status of a dengue case (e.g. Verify or Resolve)
export const updateCaseStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("dengue_cases")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};

// Assign PHI to a dengue case
export const assignPHIToCase = async (id, assignee) => {
  const { data, error } = await supabase
    .from("dengue_cases")
    .update({ assignee })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};

// Remove/Delete a dengue case
export const removeCase = async (id) => {
  const { data, error } = await supabase
    .from("dengue_cases")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};
