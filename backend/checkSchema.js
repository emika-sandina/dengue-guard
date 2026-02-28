import { supabase } from './src/supabase.js';
import fs from 'fs';

async function checkSchema() {
  const log = (msg) => fs.appendFileSync('schema_log.txt', msg + '\n');
  fs.writeFileSync('schema_log.txt', '--- SCHEMA CHECK ---\n');
  
  try {
    log("Attempting to fetch a single row to see column names...");
    const { data, error } = await supabase.from('dengue_cases').select('*').limit(1);
    
    if (error) {
      log("Error fetching: " + JSON.stringify(error));
    } else {
      log("Columns found: " + (data && data.length > 0 ? Object.keys(data[0]).join(', ') : "No rows data"));
    }

    log("Attempting to insert a blank record to see required fields error...");
    const { error: insErr } = await supabase.from('dengue_cases').insert([{}]).select();
    log("Insert error: " + JSON.stringify(insErr));

  } catch (e) {
    log("Catch Error: " + e.message);
  }
  process.exit(0);
}

checkSchema();
