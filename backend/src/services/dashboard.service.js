import { supabase } from "../supabase.js";

export const getDashboardSummaryByUserId = async (userId) => {
  let resolvedMohArea = null;

  // Try to read MOH area from profile first.
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  resolvedMohArea =
    profile?.moh_area || profile?.mohArea || profile?.area || null;

  // Fallback to auth metadata if the profile does not store the area.
  if (!resolvedMohArea) {
    const { data: authUserData, error: authUserError } =
      await supabase.auth.admin.getUserById(userId);

    if (authUserError) {
      throw new Error(
        `Failed to fetch user metadata: ${authUserError.message}`,
      );
    }

    resolvedMohArea = authUserData?.user?.user_metadata?.moh_area || null;
  }

  const casesQuery = supabase
    .from("dengue_cases")
    .select("id", { count: "exact", head: true });
  const sitesQuery = supabase
    .from("breeding_sites")
    .select("id", { count: "exact", head: true });

  const { count: caseCount, error: caseCountError } = resolvedMohArea
    ? await casesQuery.eq("moh_area", resolvedMohArea)
    : await casesQuery;

  if (caseCountError) {
    throw new Error(`Failed to fetch case count: ${caseCountError.message}`);
  }

  const { count: siteCount, error: siteCountError } = resolvedMohArea
    ? await sitesQuery.eq("moh_area", resolvedMohArea)
    : await sitesQuery;

  if (siteCountError) {
    throw new Error(`Failed to fetch site count: ${siteCountError.message}`);
  }

  return {
    mohArea: resolvedMohArea || "Not set",
    caseCount: caseCount ?? 0,
    siteCount: siteCount ?? 0,
  };
};
