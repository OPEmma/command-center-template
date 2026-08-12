import { createClient } from "@supabase/supabase-js";

// Helper to ensure a non-empty, valid URL string
const getSupabaseUrl = () => {
  const envUrl =
    (typeof window !== "undefined" && window.__ENV__?.VITE_SUPABASE_URL) ||
    import.meta.env.VITE_SUPABASE_URL;

  if (envUrl && typeof envUrl === "string" && envUrl.startsWith("http")) {
    return envUrl;
  }
  return "https://umiauevfaxqlfbuujskl.supabase.co";
};

const getSupabaseAnonKey = () => {
  const envKey =
    (typeof window !== "undefined" && window.__ENV__?.VITE_SUPABASE_ANON_KEY) ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envKey && typeof envKey === "string" && envKey.trim() !== "") {
    return envKey;
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaWF1ZXZmYXhxbGZidXVqc2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTA2NjYsImV4cCI6MjA5NzIyNjY2Nn0.PQ2pGl3UFBIbMYJn0rhX6d9S_fbhEZluvrYG3iiY6I0"; // <-- Paste your real anon key here
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);