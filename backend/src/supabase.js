import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Log to verify it's reading the .env correctly (you can remove this later)
console.log("Connecting to Supabase at:", supabaseUrl);
console.log("Using key:", process.env.SUPABASE_KEY);

export const supabase = createClient(supabaseUrl, supabaseKey);
