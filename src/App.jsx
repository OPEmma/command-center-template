import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
import Dashboard from "./Dashboard.jsx";
import { supabase } from "./supabaseClient";

const RESERVED_SUBDOMAINS = [
  "www",
  "admin",
  "api",
  "blog",
  "status",
  "support",
  "dashboard",
  "config",
  "assets",
];

function App() {
  const [subdomain, setSubdomain] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [projectData, setProjectData] = useState(null); // null = not configured yet, falls back to defaults in Hero
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Initialize Supabase Auth Listener FIRST
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("User signed in via magic link:", session.user.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log("Auth state changed — signed in:", session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const host = window.location.hostname.toLowerCase().trim();

    // 1. Explicitly check for our main root platforms and local environments
    if (
      host === "devhub.ng" ||
      host === "www.devhub.ng" ||
      host === "localhost" ||
      host === "127.0.0.1"
    ) {
      setSubdomain(null);
      setLoading(false);
      return;
    }

    // 2. Handle active user subdomains (e.g., username.devhub.ng)
    if (host.endsWith(".devhub.ng")) {
      const extracted = host
        .replace(/^www\./, "")
        .replace(".devhub.ng", "")
        .toLowerCase()
        .trim();

      if (RESERVED_SUBDOMAINS.includes(extracted)) {
        setSubdomain(null);
      } else {
        setSubdomain(extracted);
      }
      setLoading(false);
    } else {
      // 3. Fallback: If it's any other custom domain string, it is NOT a platform user subdomain
      setSubdomain(null);
      setLoading(false);
    }
  }, []);

  // 3. Fetch profile and its saved project config from the profiles table
  useEffect(() => {
    if (!subdomain) return;

    async function fetchUserProfileAndProjects() {
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, username, developer_name, bio, whatsapp_number, telegram_handle, selected_projects",
          )
          .eq("username", subdomain)
          .maybeSingle(); // Prevents throwing hard unhandled errors if profile doesn't exist

        if (profileError) throw profileError;

        if (profile) {
          setProfileData(profile);

          // Distinguish "never configured" (null/undefined) from
          // "intentionally emptied" ([]) so Hero knows whether to fall
          // back to platform defaults or show a genuinely empty state
          if (
            profile.selected_projects === null ||
            profile.selected_projects === undefined
          ) {
            setProjectData(null);
          } else {
            try {
              const parsed =
                typeof profile.selected_projects === "string"
                  ? JSON.parse(profile.selected_projects)
                  : profile.selected_projects;
              setProjectData(Array.isArray(parsed) ? parsed : null);
            } catch {
              setProjectData(null);
            }
          }
        }
      } catch (err) {
        console.error("Error loading profile setup environment:", err);
        setError("Failed to load profile settings.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfileAndProjects();
  }, [subdomain]);

  // Loading state container configuration
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Loading custom platform environment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  // ROUTE A: Public subdomain customized portfolio pipeline view
  if (subdomain) {
    if (!profileData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="text-center">
            <h1 className="text-6xl font-black text-purple-600 dark:text-purple-500">
              404
            </h1>
            <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
              Workspace Not Found
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The developer path configuration requested hasn't been claimed.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative min-h-screen overflow-x-hidden bg-white dark:bg-gray-950">
        {/* We pass down database values right into your custom view templates */}
        <Header profile={profileData} />
        <Hero
          profile={profileData}
          customProjects={projectData}
          isSubdomain={true}
        />
      </div>
    );
  }

  // ROUTE B: Main registration root app landing environment with React Router
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/"
          element={
            <div className="relative min-h-screen bg-white dark:bg-gray-950">
              <Header profile={null} />
              <Hero profile={null} customProjects={null} isSubdomain={false} />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
