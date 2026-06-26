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
  const [projectData, setProjectData] = useState([]); // Replaces selected_projects jsonb string
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

  // 2. Check subdomain parsing logic
  useEffect(() => {
    const host = window.location.hostname.toLowerCase().trim();

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

    if (host.endsWith(".devhub.ng")) {
      const extracted = host
        .replace(/^www\./, "")
        .replace(".devhub.ng", "")
        .toLowerCase()
        .trim();

      if (RESERVED_SUBDOMAINS.includes(extracted)) {
        setSubdomain(null);
        setLoading(false);
      } else {
        setSubdomain(extracted);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // 3. Fetch profile and relational custom projects if subdomain matches
  useEffect(() => {
    if (!subdomain) return;

    async function fetchUserProfileAndProjects() {
      try {
        // Fetch Profile Matrix Details
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, username, developer_name, bio, whatsapp_number, telegram_handle",
          )
          .eq("username", subdomain)
          .maybeSingle(); // Prevents throwing hard unhandled errors if profile doesn't exist

        if (profileError) throw profileError;

        if (profile) {
          setProfileData(profile);

          // Query relational projects via user_id foreign key reference
          const { data: projects, error: projectsError } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false });

          if (projectsError) throw projectsError;
          setProjectData(projects || []);
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
              <Hero profile={null} customProjects={[]} isSubdomain={false} />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
