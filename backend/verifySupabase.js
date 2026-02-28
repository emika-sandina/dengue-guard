import { supabase } from './src/supabase.js';
import fs from 'fs';

async function verify() {
  const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('verify_log.txt', msg + '\n');
  };

  fs.writeFileSync('verify_log.txt', '--- VERIFY START ---\n');
  
  try {
    log("1. Checking connection...");
    const { data: fetch1, error: err1 } = await supabase.from('dengue_cases').select('*').limit(1);
    
    if (err1) {
      log("FETCH ERROR: " + JSON.stringify(err1));
    } else {
      log("FETCH SUCCESS. Found " + fetch1.length + " rows.");
    }

    log("2. Attempting manual insert...");
    const testPayload = {
      reporting_for: "AI Verification",
      location: "Verification Street",
      symptoms: ["Test Fever"],
      status: "pending"
    };

    const { data: ins, error: errIns } = await supabase
      .from('dengue_cases')
      .insert([testPayload])
      .select();

    if (errIns) {
      log("INSERT ERROR: " + JSON.stringify(errIns));
    } else {
      log("INSERT SUCCESS: " + JSON.stringify(ins));
    }

    log("3. Fetching again...");
    const { data: fetch2, error: err2 } = await supabase.from('dengue_cases').select('*');
    if (err2) {
      log("FETCH 2 ERROR: " + JSON.stringify(err2));
    } else {
      log("FETCH 2 SUCCESS. Total rows: " + fetch2.length);
      log("Rows: " + JSON.stringify(fetch2, null, 2));
    }

  } catch (e) {
    log("CATCH ERROR: " + e.message);
  }
  
  log("--- VERIFY END ---");
  process.exit(0);
}

verify();
