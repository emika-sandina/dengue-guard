import { supabase } from './src/supabase.js';

async function verify() {
  try {
    const testPayload = {
      reporting_for: "AI Final Test",
      location: "Fix Street",
      symptoms: ["Fever"],
      moh_area: "Test Area",
      doctor_status: "Yes",
      dengue_diagnosis: "Yes",
      symptoms_start_date: "2025-01-01"
    };

    console.log("Attempting insert without status/assignee...");
    const { data, error } = await supabase
      .from('dengue_cases')
      .insert([testPayload])
      .select();

    if (error) {
      console.log("RESULT:FAIL:" + error.message);
    } else {
      console.log("RESULT:SUCCESS:" + JSON.stringify(data));
    }
  } catch (e) {
    console.log("RESULT:ERROR:" + e.message);
  }
  process.exit(0);
}

verify();
