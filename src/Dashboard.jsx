import { useState } from "react";
import { supabase } from "./supabaseClient.js";
import {
  Copy,
  ArrowRight,
  Globe,
  Settings,
  Sparkles,
  Layers,
  Sun,
  Moon,
} from "lucide-react";

const EXCLUSIVE_THEMES = {
  cyberPurple: {
    name: "Cyber Purple",
    bg: "from-purple-950/90 to-slate-950/95",
    border: "border-purple-500/30",
    accent: "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20 text-white",
    text: "text-purple-400",
    pill: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
  neonMatrix: {
    name: "Emerald Matrix",
    bg: "from-emerald-950/90 to-zinc-950/95",
    border: "border-emerald-500/30",
    accent:
      "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-white",
    text: "text-emerald-400",
    pill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  solarFlare: {
    name: "Solar Flare",
    bg: "from-amber-950/90 to-stone-950/95",
    border: "border-amber-500/30",
    accent: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20 text-white",
    text: "text-amber-400",
    pill: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  deepOcean: {
    name: "Abyssal Blue",
    bg: "from-blue-950/90 to-gray-950/95",
    border: "border-blue-500/30",
    accent: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 text-white",
    text: "text-blue-400",
    pill: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
};

function Dashboard() {
  const [session, setSession] = useState(null);
  const [copyStep, setCopyStep] = useState("selection");
  const [selectedTheme, setSelectedTheme] = useState("cyberPurple");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [customWorkspace, setCustomWorkspace] = useState({
    siteName: "",
    developerTitle: "",
    repoUrl: "",
  });
  const [integrationData, setIntegrationData] = useState({
    whatsappHandle: "",
    telegramHandle: "",
    customSites: "",
  });

  const currentActiveTheme = EXCLUSIVE_THEMES[selectedTheme];

  // Check session
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        window.location.href = "/";
      }
    });
  }, []);

  const handleWorkspaceChange = (e) => {
    setCustomWorkspace({ ...customWorkspace, [e.target.name]: e.target.value });
  };

  const handleIntegrationChange = (e) => {
    setIntegrationData({ ...integrationData, [e.target.name]: e.target.value });
  };

  const handlePublishWorkspace = async (e) => {
    e.preventDefault();
    if (!subdomain) {
      alert("Please enter a custom username/subdomain!");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("profiles").insert([
        {
          username: subdomain.toLowerCase().trim(),
          full_name: customWorkspace.siteName,
          bio: customWorkspace.developerTitle,
          email: session?.user?.email,
          whatsapp_number: integrationData.whatsappHandle,
          telegram_handle: integrationData.telegramHandle,
          selected_projects: integrationData.customSites,
        },
      ]);
      if (error) {
        if (error.code === "23505") {
          throw new Error(
            "This username/subdomain is already taken! Try another one.",
          );
        }
        throw error;
      }
      alert(
        `Your portfolio is live at https://${subdomain.toLowerCase().trim()}.devhub.ng`,
      );
      setCopyStep("selection");
      setSubdomain("");
      setCustomWorkspace({ siteName: "", developerTitle: "", repoUrl: "" });
      setIntegrationData({
        whatsappHandle: "",
        telegramHandle: "",
        customSites: "",
      });
    } catch (error) {
      alert(error.message || "Error saving profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 px-6 pb-12">
      <div className="max-w-2xl mx-auto">
        <a
          href="/"
          className="text-sm text-purple-600 hover:underline mb-4 inline-block"
        >
          &larr; Back to Home
        </a>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Workspace Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Configure your portfolio and claim your subdomain.
        </p>

        {/* THEME PICKER */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Theme Palette
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(EXCLUSIVE_THEMES).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedTheme(key)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all ${
                  selectedTheme === key
                    ? `${currentActiveTheme.border} ${currentActiveTheme.pill}`
                    : "border-transparent bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <span>{item.name}</span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${item.accent.split(" ")[0]}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* FLOW STEPS */}
        {copyStep === "selection" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                Package Manifest Bundle Contents:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <li>
                  Fully Configured Recharts Month-over-Month Line Flowcharts
                </li>
                <li>Adaptive 4-Column Statcard Grid UI Containers</li>
                <li>
                  No-Code Dynamic JSON State Mutators for Sprints & Images
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  window.open(
                    "https://github.com/OPEmma/command-center-template",
                    "_blank",
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <Copy size={14} /> Visit Repository
              </button>
              <button
                onClick={() => setCopyStep("manualForm")}
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 transition py-3"
              >
                Type Parameters <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {copyStep === "manualForm" && (
          <div className="space-y-4 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={customWorkspace.siteName}
                  onChange={handleWorkspaceChange}
                  placeholder="Nexus Core"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Developer Title
                </label>
                <input
                  type="text"
                  name="developerTitle"
                  value={customWorkspace.developerTitle}
                  onChange={handleWorkspaceChange}
                  placeholder="Lead Architect"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Repo URL (Optional)
              </label>
              <input
                type="url"
                name="repoUrl"
                value={customWorkspace.repoUrl}
                onChange={handleWorkspaceChange}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCopyStep("selection")}
                className="w-1/3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 py-2.5"
              >
                Back
              </button>
              <button
                onClick={() => setCopyStep("domainPopup")}
                disabled={
                  !customWorkspace.siteName || !customWorkspace.developerTitle
                }
                className="w-2/3 rounded-lg bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 py-2.5 disabled:opacity-40"
              >
                Allocate Domain
              </button>
            </div>
          </div>
        )}

        {copyStep === "domainPopup" && (
          <div className="space-y-4 text-center bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Globe size={20} className="text-purple-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Claim Your Subdomain
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose your unique subdomain prefix.
            </p>
            <div className="max-w-xs mx-auto flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="your-workspace"
                className="w-full bg-transparent px-3 py-2 text-sm text-right focus:outline-none dark:text-white"
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  )
                }
              />
              <span className="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700">
                .devhub.ng
              </span>
            </div>
            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={() => setCopyStep("manualForm")}
                className="px-5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Back
              </button>
              <button
                disabled={!subdomain}
                onClick={() => setCopyStep("integrations")}
                className="px-5 py-2 text-xs font-semibold bg-purple-600 text-white rounded-lg disabled:opacity-40"
              >
                Configure Contacts
              </button>
            </div>
          </div>
        )}

        {copyStep === "integrations" && (
          <form
            onSubmit={handlePublishWorkspace}
            className="space-y-4 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsappHandle"
                  value={integrationData.whatsappHandle}
                  onChange={handleIntegrationChange}
                  placeholder="+234..."
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Telegram
                </label>
                <input
                  type="text"
                  name="telegramHandle"
                  value={integrationData.telegramHandle}
                  onChange={handleIntegrationChange}
                  placeholder="@username"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Sites / Collabs (Optional)
              </label>
              <textarea
                name="customSites"
                value={integrationData.customSites}
                onChange={handleIntegrationChange}
                rows={2}
                placeholder="Leave blank for defaults..."
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-xs focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCopyStep("domainPopup")}
                className="w-1/3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 py-2.5"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 rounded-lg bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 py-2.5 disabled:opacity-40"
              >
                {isSubmitting ? "Publishing..." : "Upload & Publish Core"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
