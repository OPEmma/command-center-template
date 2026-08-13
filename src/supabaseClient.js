import { createClient } from "@supabase/supabase-js";

// Read environment variables with safe string fallbacks
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://umiauevfaxqlfbuujskl.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaWF1ZXZmYXhxbGZidXVqc2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTA2NjYsImV4cCI6MjA5NzIyNjY2Nn0.PQ2pGl3UFBIbMYJn0rhX6d9S_fbhEZluvrYG3iiY6I0";

// Guard check to ensure createClient receives a valid HTTP URL string
if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
  console.error("Invalid Supabase URL detected:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);