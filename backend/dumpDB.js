import { supabase } from './src/supabase.js';
import fs from 'fs';

async function check() {
  const { data, error } = await supabase.from('dengue_cases').select('*').order('created_at', { ascending: false }).limit(5);
  if (error) {
    fs.writeFileSync('check_results.txt', "ERROR: " + JSON.stringify(error));
  } else {
    fs.writeFileSync('check_results.txt', "SUCCESS: Found " + data.length + " rows.\n" + JSON.stringify(data, null, 2));
  }
  process.exit(0);
}
check();
