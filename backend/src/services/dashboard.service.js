import { supabase } from "../supabase.js";

export const getDashboardSummaryByUserId = async (userId) => {
  let resolvedMohArea = null;

  try {
    // Try to find the user's MOH Area from their database profile first.
    // We look up the 'profiles' table for a row matching this user's ID.
    const profileResponse = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

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
         resolvedMohArea = authResponse.data?.user?.user_metadata?.moh_area || null;
      }
    } catch (err) {
      console.warn("Could not fetch user via admin API (possibly due to missing service_role key):", err.message);
    }
  }

  // Prepare variables to hold our final counts
  let caseCount = 0;
  let siteCount = 0;

  // If we successfully found the user's MOH Area, count their reports.
  if (resolvedMohArea) {

    const baseAreaName = resolvedMohArea;

    // Count Dengue Cases for this specific area.
    // .ilike() is a case-insensitive search. 
    // The '%' symbols act as wildcards, meaning it will match anything containing our baseAreaName.
    // This catches "Homagama", "HOMAGAMA", or even "MOH Homagama" safely.
    const caseResponse = await supabase
      .from("dengue_cases")
      .select("id", { count: "exact", head: true })
      .ilike("moh_area", `%${baseAreaName}%`);
      
    if (caseResponse.error) {
      throw new Error(`Failed to fetch case count: ${caseResponse.error.message}`);
    }
    // Save the result, or default to 0 if nothing was found
    caseCount = caseResponse.count ?? 0;

    // Count Breeding Sites for this specific area.
    // We use the exact same flexible search (.ilike) here.
    const siteResponse = await supabase
      .from("breeding_sites")
      .select("id", { count: "exact", head: true })
      .ilike("moh_area", `%${baseAreaName}%`);
      
    if (siteResponse.error) {
      throw new Error(`Failed to fetch site count: ${siteResponse.error.message}`);
    }
    // Save the result, or default to 0 if nothing was found
    siteCount = siteResponse.count ?? 0;

  } else {
    // If we couldn't figure out the user's MOH Area at all, 
    // we just fetch the total count of EVERYTHING in the database.
    
    const caseResponse = await supabase
      .from("dengue_cases")
      .select("id", { count: "exact", head: true });

    if (caseResponse.error) {
      throw new Error(`Failed to fetch case count: ${caseResponse.error.message}`);
    }
    caseCount = caseResponse.count ?? 0;

    const siteResponse = await supabase
      .from("breeding_sites")
      .select("id", { count: "exact", head: true });

    if (siteResponse.error) {
      throw new Error(`Failed to fetch site count: ${siteResponse.error.message}`);
    }
    siteCount = siteResponse.count ?? 0;
  }

  // Return the final summary data back to the dashboard frontend.
  return {
    mohArea: resolvedMohArea || "Not set",
    caseCount,
    siteCount,
  };
};