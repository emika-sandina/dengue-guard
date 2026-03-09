import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Log to verify it's reading the .env correctly
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log("Using SUPABASE_SERVICE_ROLE_KEY for initialization.");
} else if (process.env.SUPABASE_ANON_KEY) {
  console.log("SUPABASE_SERVICE_ROLE_KEY not found. Using SUPABASE_ANON_KEY for initialization.");
} else {
  console.error("CRITICAL ERROR: Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_ANON_KEY was found in environment variables.");
}

console.log("Connecting to Supabase at:", supabaseUrl);

if (!supabaseKey || !supabaseKey.startsWith("eyJ")) {
  console.warn("WARNING: The provided Supabase key does not look like a standard Supabase JWT key. Please check your .env file!");
} else {
  console.log("Supabase key format looks valid (starts with eyJ).");
}


export const supabase = createClient(supabaseUrl, supabaseKey);
