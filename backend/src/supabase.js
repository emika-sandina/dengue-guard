import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Auth flows should use anon key, fallback to service role if needed
const supabaseAuthKey = supabaseAnonKey || supabaseServiceRoleKey;

if (!supabaseUrl) {
  console.error("Supabase config error: SUPABASE_URL is missing.");
}

if (!supabaseServiceRoleKey && !supabaseAnonKey) {
  console.error(
    "Supabase config error: neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_ANON_KEY is set."
  );
}

// Log (optional, remove later)
console.log("Connecting to Supabase at:", supabaseUrl);
console.log("Using service role key:", !!supabaseServiceRoleKey);
console.log("Using anon key:", !!supabaseAnonKey);

// Admin / backend client
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Auth / public client
export const supabaseAuth = createClient(supabaseUrl, supabaseAuthKey);