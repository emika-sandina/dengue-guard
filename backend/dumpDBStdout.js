import { supabase } from './src/supabase.js';

async function check() {
  const { data, error } = await supabase.from('dengue_cases').select('*').order('created_at', { ascending: false }).limit(5);
  if (error) {
    console.log("CHECK_RESULT:ERROR:" + JSON.stringify(error));
  } else {
    console.log("CHECK_RESULT:SUCCESS:COUNT:" + data.length);
    console.log("DATA_JSON:" + JSON.stringify(data));
  }
  process.exit(0);
}
check();
