import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Auth flows (signInWithPassword) should use the anon/public key.
// Admin/database reads can use the service role key.
const supabaseAuthKey = supabaseAnonKey || supabaseServiceRoleKey;

if (!supabaseUrl) {
  console.error("Supabase config error: SUPABASE_URL is missing.");
}
if (!supabaseServiceRoleKey && !supabaseAnonKey) {
  console.error(
    "Supabase config error: neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_ANON_KEY is set."
  );
}

// Log to verify it's reading the .env correctly (you can remove this later)
console.log("Connecting to Supabase at:", supabaseUrl);
console.log("Using service role key:", !!supabaseServiceRoleKey);
console.log("Using anon key:", !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
export const supabaseAuth = createClient(supabaseUrl, supabaseAuthKey);
