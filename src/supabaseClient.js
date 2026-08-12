import { createClient } from "@supabase/supabase-js";

// Hardcoded string guarantees Vite compiles a valid HTTP URL into the build bundle
const supabaseUrl = "https://umiauevfaxqlfbuujskl.supabase.co";

// Replace with your actual anon key string
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaWF1ZXZmYXhxbGZidXVqc2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTA2NjYsImV4cCI6MjA5NzIyNjY2Nn0.PQ2pGl3UFBIbMYJn0rhX6d9S_fbhEZluvrYG3iiY6I0"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);