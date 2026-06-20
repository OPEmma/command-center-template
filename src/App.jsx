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

  // 2. Check subdomain
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

  // 3. Fetch profile if subdomain
  useEffect(() => {
    if (!subdomain) return;

    async function fetchUserProfile() {
      try {
        const { data, error: supabaseError } = await supabase
          .from("profiles")
          .select(
            "id, username, full_name, bio, whatsapp_number, telegram_handle, selected_projects",
          )
          .eq("username", subdomain)
          .single();

        if (supabaseError) throw supabaseError;
        setProfileData(data);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile settings.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [subdomain]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Loading layout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ROUTE A: Public subdomain view
  if (subdomain) {
    if (!profileData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              404
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Developer Profile Not Found!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="profile-template min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="p-8 bg-gray-900 text-white">
          <h1 className="text-3xl font-bold">
            {profileData.full_name || subdomain}'s Live Site
          </h1>
          <p className="mt-2 text-gray-400">
            {profileData.bio || "Welcome to my space."}
          </p>
          {profileData.whatsapp_number && (
            <p className="mt-4 text-green-400">
              Contact: {profileData.whatsapp_number}
            </p>
          )}
        </header>
      </div>
    );
  }

  // ROUTE B: Main app with React Router
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/"
          element={
            <div className="relative min-h-screen bg-white dark:bg-gray-950">
              <Header profile={profileData} />
              <Hero profile={profileData} />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
