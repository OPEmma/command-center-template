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

  useEffect(() => {
    const host = window.location.hostname.toLowerCase().trim();

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

    // Subdomain route
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

  useEffect(() => {
    if (!subdomain) return;

    async function fetchUserProfile() {
      try {
        const { data, error: supabaseError } = await supabase
          .from("profiles")
          .select("*")
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

  if (subdomain) {
    if (!profileData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
          <h1 className="text-xl">404: Profile Not Found</h1>
        </div>
      );
    }

    return (
      <div className="main-template-wrapper">
        {/* 1. Your actual Header component, using their dynamic contact info */}
        <Header profile={profileData} phone={profileData.phone_number} />

        {/* 2. Your actual Hero / Main Layout */}
        <Hero profile={profileData} />

        {/* 3. Your Portfolio/Projects Section */}
        <section className="p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Websites Built</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profileData.projects?.map((project, index) => (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                key={index}
                className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-white dark:bg-gray-900">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-blue-500 mt-1">Visit Website →</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 4. Your "Connect With Us" Section using their phone number */}
        <footer className="p-8 bg-gray-100 dark:bg-gray-900 text-center">
          <h3 className="text-xl font-semibold">Connect With Us</h3>
          <p className="mt-2 text-lg font-medium text-green-600">
            {profileData.phone_number || "+234 XXX XXX XXXX"}
          </p>
        </footer>
      </div>
    );
  }
  return (
    <div>
      <Header profile={profileData} />
      <Hero profile={profileData} />
    </div>
  );
}

export default App;
