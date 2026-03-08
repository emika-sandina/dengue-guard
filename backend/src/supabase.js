import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log to verify it's reading the .env correctly (you can remove this later)
console.log("Connecting to Supabase at:", supabaseUrl);
console.log("Using key:", process.env.SUPABASE_SERVICE_ROLE_KEY);

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getUserSupabase = (token) =>
    // using the token from the frontend, configuers the specific user to act like a exsiting user
  createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` }
    }
  });