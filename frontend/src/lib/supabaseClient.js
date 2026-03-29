// import Supabase factory function
import { createClient } from '@supabase/supabase-js';

// read API keys securely from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// instantiate and export globally reusable Supabase client connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey);