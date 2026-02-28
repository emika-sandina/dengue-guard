import { supabase } from './src/supabase.js';
import fs from 'fs';

async function verify() {
  const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('probe_log.txt', msg + '\n');
  };

  fs.writeFileSync('probe_log.txt', '--- PROBE START ---\n');
  
  try {
    log("1. Attempting insert WITHOUT status column...");
    const testPayload = {
      reporting_for: "AI Probe",
      location: "Probe Street",
      symptoms: ["Probe Symptom"],
      symptoms_start_date: "2025-01-01",
      doctor_status: "Yes",
      dengue_diagnosis: "Yes",
      moh_area: "Test Area"
    };

    const { data: ins, error: errIns } = await supabase
      .from('dengue_cases')
      .insert([testPayload])
      .select();

    if (errIns) {
      log("INSERT ERROR: " + JSON.stringify(errIns));
    } else {
      log("INSERT SUCCESS: " + JSON.stringify(ins));
      log("SUCCESS COLS: " + Object.keys(ins[0]).join(', '));
    }

  } catch (e) {
    log("CATCH ERROR: " + e.message);
  }
  process.exit(0);
}

verify();
