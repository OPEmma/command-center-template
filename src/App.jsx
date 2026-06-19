import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
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

  // --- AUTHENTICATION STATES ---
  const [currentUser, setCurrentUser] = useState(null); // Keeps track of logged-in email
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // 1. Check Subdomain and Local Storage Session on Mount
  useEffect(() => {
    const host = window.location.hostname.toLowerCase().trim();

    // Check if a user is already remembered locally on this browser
    const savedUserEmail = localStorage.getItem("devhub_user_email");
    if (savedUserEmail) {
      setCurrentUser(savedUserEmail);
    }

    // Main domain & local development environments — show landing page
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

    // Subdomain routing
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

  // 2. Fetch data from Supabase if a public subdomain is visited
  useEffect(() => {
    if (!subdomain) return;

    async function fetchUserProfile() {
      try {
        const { data, error: supabaseError } = await supabase
          .from("profiles")
          .select(
            "id, username, full_name, bio, whatsapp_number, telegram_handle, selected_projects",
          ) // 🔒 PRIVACY FIX: Excluded email entirely from public view queries
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

  // --- PASSWORDLESS SIGNUP / LOGIN RECOGNITION FLOW ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setAuthLoading(true);
    const sanitizedEmail = emailInput.toLowerCase().trim();

    try {
      // Step A: Check if this email already exists in the database
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", sanitizedEmail)
        .maybeSingle(); // Safely returns null if not found instead of throwing an error

      if (existingProfile) {
        // RETURNING USER: Log them right in
        console.log("Welcome back, recognized user!");
        setCurrentUser(sanitizedEmail);
        localStorage.setItem("devhub_user_email", sanitizedEmail);
        setShowAuthModal(false);
      } else {
        // BRAND NEW USER: Initialize their basic profile row
        console.log("New registration detected, creating profile...");
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ email: sanitizedEmail }]);

        if (insertError) throw insertError;

        setCurrentUser(sanitizedEmail);
        localStorage.setItem("devhub_user_email", sanitizedEmail);
        setShowAuthModal(false);
      }
    } catch (err) {
      console.error("Authentication process failed:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("devhub_user_email");
    setCurrentUser(null);
  };

  // Global State Handlers
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

  // --- ROUTE A: PUBLIC USER SUBDOMAIN MIRROR VIEW ---
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
        {/* Your matching mirrored template layout drops here */}
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

  // --- ROUTE B: ROOT LANDING SITE (`devhub.ng`) ---
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950">
      {/* Global Header */}
      <Header
        currentUser={currentUser}
        onGetStartedClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Render the Dashboard Configurator or the Main Landing Hero based on session state */}
      {currentUser ? (
        <div className="max-w-4xl mx-auto pt-24 px-6 pb-12">
          <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {currentUser}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Configure your profile settings, link your websites, and claim
              your subdomain.
            </p>

            {/* Dashboard configuration forms will sit here */}
            <div className="mt-8 p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center text-gray-400">
              Workspace Dashboard Content (Setup forms pending)
            </div>
          </div>
        </div>
      ) : (
        <Hero
          currentUser={currentUser}
          onGetStartedClick={() => setShowAuthModal(true)}
        />
      )}

      {/* --- REUSABLE STREAMLINED AUTHENTICATION MODAL --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Get Started with DevHub
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  If you already have an account, we'll log you back in
                  immediately.
                </p>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition dynamic-button disabled:opacity-50"
              >
                {authLoading ? "Checking account..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
