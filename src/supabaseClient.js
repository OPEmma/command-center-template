import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof window !== "undefined" && window.__ENV__?.VITE_SUPABASE_URL) ||
  import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  (typeof window !== "undefined" && window.__ENV__?.VITE_SUPABASE_ANON_KEY) ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Supabase credentials missing. url=${supabaseUrl ? "present" : "MISSING"} key=${supabaseAnonKey ? "present" : "MISSING"}`,
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);