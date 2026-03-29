import { supabase } from "../supabase.js";

//Cleans MOH Area text 
const normalizeMohArea = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }
  //Removes unneccesary values, blanks and converts values like MOH Colombo - Colombo
  return value
    .replace(/^\s*moh\s*[-:]?\s*/i, "")
    .trim()
    .toLowerCase();
};
//count reports in a table but for only data belongs to the given moharea
const countReportsByMohArea = async (tableName, normalizedMohArea) => {
  //If its unable to retreive the user's MOH area, the total report counts for all moh area will be sent
  if (!normalizedMohArea) {
    const totalResponse = await supabase
      .from(tableName)
      .select("id", { count: "exact", head: true }); //head:true means dont fetch rows

    if (totalResponse.error) {
      throw new Error(
        `Failed to fetch ${tableName} total count: ${totalResponse.error.message}`
      );
    }
    //If null, return 0
    return totalResponse.count ?? 0;
  }
  //Select the MOH Area only from the required table
  const areaResponse = await supabase.from(tableName).select("moh_area");

  //If database fails, stop everything and send error to controller
  if (areaResponse.error) {
    throw new Error(
      `Failed to fetch ${tableName} MOH areas: ${areaResponse.error.message}`
    );
  }
  //Loop thru each row, safely access moh area, and clean it eg-MOH-CMB to just CMB
  return (areaResponse.data ?? []).filter(
    (row) => normalizeMohArea(row?.moh_area) === normalizedMohArea
  ).length;
};
//Main function called by the controller
export const getDashboardSummaryByUserId = async (userId) => {
  let resolvedMohArea = null;

  try {
    // Try to find the user's MOH Area from their database profile first.
    // We look up the 'profiles' table for a row matching this user's ID.
    const profileResponse = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()
      .throwOnError();

    const profile = profileResponse.data;

    // The area might be saved under different names, so we check a few possibilities.
    resolvedMohArea =
      profile?.moh_area || profile?.mohArea || profile?.area || null;
  } catch (error) {
    // If something goes wrong fetching the profile, we log it but keep going.
    console.warn("Failed to fetch profile for MOH Area:", error.message);
  }

  // If we didn't find the MOH Area in the profile, we are going to check their Auth account.
  if (!resolvedMohArea) {
    try {
      // Fetch the user's core account details using Supabase Admin tools.
      const authResponse = await supabase.auth.admin.getUserById(userId);

      // If successful, look inside their user metadata for the MOH Area.
      if (authResponse.error) {
         console.warn(`Auth admin fetch error: ${authResponse.error.message}`);
      } else {
        const metadata = authResponse.data?.user?.user_metadata || {};
        resolvedMohArea =
          metadata?.moh_area || metadata?.mohArea || metadata?.area || null;
      }
    } catch (err) {
      console.warn("Could not fetch user via admin API (possibly due to missing service_role key):", err.message);
    }
  }

  // Prepare variables to hold our final counts
  let caseCount = 0;
  let siteCount = 0;
  const normalizedMohArea = normalizeMohArea(resolvedMohArea);

  // If we successfully found the user's MOH Area, count their reports.
  caseCount = await countReportsByMohArea("dengue_cases", normalizedMohArea);
  siteCount = await countReportsByMohArea("breeding_sites", normalizedMohArea);

  // Return the final summary data back to the dashboard frontend.
  return {
    mohArea: resolvedMohArea || "Not set",
    caseCount,
    siteCount,
  };
};