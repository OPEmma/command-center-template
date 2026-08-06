 import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof window !== "undefined" && window.__ENV__?.VITE_SUPABASE_URL) ||
  import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  (typeof window !== "undefined" && window.__ENV__?.VITE_SUPABASE_ANON_KEY) ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials missing. Check window.__ENV__ or local environment configurations.",
  );
}

// Fallback to empty string if missing
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");