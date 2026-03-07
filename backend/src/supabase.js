import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log to verify it's reading the .env correctly
console.log("Connecting to Supabase at:", supabaseUrl);

if (!supabaseKey || !supabaseKey.startsWith("eyJ")) {
  console.warn("WARNING: SUPABASE_ANON_KEY does not look like a standard Supabase JWT key. Please check your .env file!");
} else {
  console.log("Supabase key format looks valid (starts with eyJ).");
}


export const supabase = createClient(supabaseUrl, supabaseKey);
