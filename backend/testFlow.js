import { supabase } from './src/supabase.js';

async function testFlow() {
  console.log("--- Testing Supabase Flow ---");
  const testData = {
    reporting_for: "Test User",
    symptoms: ["Fever"],
    location: "Test Location",
    status: "pending"
  };

  console.log("Inserting test record...");
  const { data: insertResult, error: insertError } = await supabase
    .from('dengue_cases')
    .insert([testData])
    .select();

  if (insertError) {
    console.error("Insert Error:", insertError);
    return;
  }
  console.log("Insert Success:", insertResult);

  console.log("Fetching all records...");
  const { data: fetchResult, error: fetchError } = await supabase
    .from('dengue_cases')
    .select('*');

  if (fetchError) {
    console.error("Fetch Error:", fetchError);
  } else {
    console.log("Total records found:", fetchResult.length);
    console.log("Records:", JSON.stringify(fetchResult, null, 2));
  }
  process.exit(0);
}

testFlow();
