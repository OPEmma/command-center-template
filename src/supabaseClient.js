import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof window !== "undefined" && window.__ENV__?.VITE_SUPABASE_URL) ||
  "https://umiauevfaxqlfbuujskl.supabase.co";

const supabaseAnonKey =
  (typeof window !== "undefined" && window.__ENV__?.VITE_SUPABASE_ANON_KEY) ||
  import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaWF1ZXZmYXhxbGZidXVqc2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTA2NjYsImV4cCI6MjA5NzIyNjY2Nn0.PQ2pGl3UFBIbMYJn0rhX6d9S_fbhEZluvrYG3iiY6I0;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Supabase credentials missing. url=${supabaseUrl ? "present" : "MISSING"} key=${supabaseAnonKey ? "present" : "MISSING"}`,
  );
}

console.error("RAW supabaseUrl:", JSON.stringify(supabaseUrl));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);