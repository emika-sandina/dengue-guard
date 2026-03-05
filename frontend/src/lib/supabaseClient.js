import { createClient } from '@supabase/supabase-js';

const supabaseUrl = window.env.VITE_SUPABASE_URL;
const supabaseAnonKey = window.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);