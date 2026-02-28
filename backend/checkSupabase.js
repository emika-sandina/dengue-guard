import { supabase } from './src/supabase.js';

async function checkData() {
  console.log("Checking dengue_cases table...");
  try {
    const { data, error } = await supabase.from('dengue_cases').select('*');
    if (error) {
      console.error("Error from Supabase:", error);
    } else {
      console.log("Data found length:", data?.length);
      console.log("Sample Data:", data && data.length > 0 ? data[0] : "Empty");
    }
  } catch (err) {
    console.error("Execution error:", err);
  }
}

checkData();
