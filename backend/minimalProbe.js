import { supabase } from './src/supabase.js';

async function verify() {
  try {
    const testPayload = {
      reporting_for: "AI Minimal Probe",
      location: "Minimal Street"
    };

    const { data: ins, error: errIns } = await supabase
      .from('dengue_cases')
      .insert([testPayload])
      .select();

    if (errIns) {
      console.log("INSERT_ERROR:" + JSON.stringify(errIns));
    } else {
      console.log("INSERT_SUCCESS:" + JSON.stringify(ins));
      console.log("COLS:" + Object.keys(ins[0]).join(','));
    }

  } catch (e) {
    console.log("CATCH_ERROR:" + e.message);
  }
  process.exit(0);
}

verify();
