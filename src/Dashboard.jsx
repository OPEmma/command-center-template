import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient.js";
import ProjectManager from "./ProjectManager.jsx"; // Importing your custom manager component
import {
  Copy,
  ArrowRight,
  Globe,
  Palette,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  Cat,
  Code2,
  Trash2,
} from "lucide-react";

const THEME_PALETTE = [
  // Dark themes
  {
    name: "Cyber Purple",
    colors: ["#7c3aed", "#6366f1", "#1e1b4b"],
    category: "Dark",
  },
  {
    name: "Emerald Matrix",
    colors: ["#059669", "#10b981", "#022c22"],
    category: "Dark",
  },
  {
    name: "Solar Flare",
    colors: ["#d97706", "#f59e0b", "#451a03"],
    category: "Dark",
  },
  {
    name: "Abyssal Blue",
    colors: ["#2563eb", "#3b82f6", "#172554"],
    category: "Dark",
  },
  {
    name: "Rose Gold",
    colors: ["#e11d48", "#f43f5e", "#4c0519"],
    category: "Dark",
  },
  {
    name: "Arctic Frost",
    colors: ["#0891b2", "#22d3ee", "#083344"],
    category: "Dark",
  },
  {
    name: "Sunset Boulevard",
    colors: ["#ea580c", "#f97316", "#431407"],
    category: "Dark",
  },
  {
    name: "Midnight Moss",
    colors: ["#4d7c0f", "#84cc16", "#1a2e05"],
    category: "Dark",
  },
  {
    name: "Velvet Noir",
    colors: ["#a21caf", "#d946ef", "#3b0764"],
    category: "Dark",
  },
  {
    name: "Ocean Depth",
    colors: ["#0369a1", "#0ea5e9", "#0c1929"],
    category: "Dark",
  },
  // Light themes
  {
    name: "Lavender Dream",
    colors: ["#7c3aed", "#a78bfa", "#f5f3ff"],
    category: "Light",
  },
  {
    name: "Mint Fresh",
    colors: ["#059669", "#34d399", "#ecfdf5"],
    category: "Light",
  },
  {
    name: "Peach Cream",
    colors: ["#ea580c", "#fb923c", "#fff7ed"],
    category: "Light",
  },
  {
    name: "Skyline",
    colors: ["#0284c7", "#38bdf8", "#f0f9ff"],
    category: "Light",
  },
  {
    name: "Cherry Blossom",
    colors: ["#e11d48", "#fb7185", "#fff1f2"],
    category: "Light",
  },
  {
    name: "Honeycomb",
    colors: ["#d97706", "#fbbf24", "#fefce8"],
    category: "Light",
  },
];

const RESERVED_SUBDOMAINS = [
  "www",
  "api",
  "admin",
  "app",
  "dashboard",
  "auth",
  "blog",
  "devhub",
  "status",
  "test",
];

function Dashboard() {
  const [session, setSession] = useState(null);
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [hasLiveSite, setHasLiveSite] = useState(false);
  const [copyStep, setCopyStep] = useState("selection"); // 'selection', 'manualForm', 'domainPopup', 'integrations', 'success'
  const [selectedTheme, setSelectedTheme] = useState("Cyber Purple");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [publishedUrl, setPublishedUrl] = useState("");
  const [customProjectsList, setCustomProjectsList] = useState([]);

  const [customWorkspace, setCustomWorkspace] = useState({
    siteName: "",
    developerTitle: "",
    repoUrl: "",
    sitePictureUrl: "", // Added support for custom site profile image state mapping
  });
  const [integrationData, setIntegrationData] = useState({
    whatsappHandle: "",
    telegramHandle: "",
  });

  const filteredThemes =
    activeCategory === "All"
      ? THEME_PALETTE
      : THEME_PALETTE.filter((t) => t.category === activeCategory);

  const displayedThemes = showAllThemes
    ? filteredThemes
    : filteredThemes.slice(0, 6);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (!session) {
        window.location.href = "/";
      } else {
        // Safe selection query: removing potential missing columns for stability
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "github_repo_url, username, developer_name, bio, whatsapp_number, telegram_handle, selected_projects",
          )
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Supabase fetch error:", error.message);
        }

        if (data) {
          if (data.github_repo_url) setGithubRepoUrl(data.github_repo_url);

          // This is the core check that triggers the "Update Live Site" view!
          if (data.username && data.username.trim() !== "") {
            setSubdomain(data.username);
            setPublishedUrl(`https://${data.username}.devhub.ng`);
            setHasLiveSite(true);
          }

          setCustomWorkspace({
            siteName: data.developer_name || "",
            developerTitle: data.bio || "",
            repoUrl: data.github_repo_url || "",
            sitePictureUrl: data.avatar_url || "", // safely fallbacks to blank if missing
          });

          setIntegrationData({
            whatsappHandle: data.whatsapp_number || "",
            telegramHandle: data.telegram_handle || "",
          });

          if (data.selected_projects) {
            try {
              // Safe JSON evaluation handles stringified arrays or direct objects
              const parsed =
                typeof data.selected_projects === "string"
                  ? JSON.parse(data.selected_projects)
                  : data.selected_projects;
              setCustomProjectsList(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              setCustomProjectsList([]);
            }
          }
        }
      }
    });
  }, []);

  const handleConnectGitHub = () => {
    if (!session?.user?.id) {
      alert("Please log in before connecting your GitHub account.");
      return;
    }
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri =
      "https://umiauevfaxqlfbuujskl.supabase.co/functions/v1/github-callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&state=${session.user.id}`;
  };

  const handleWorkspaceChange = (e) => {
    setCustomWorkspace({ ...customWorkspace, [e.target.name]: e.target.value });
  };

  const handleIntegrationChange = (e) => {
    setIntegrationData({ ...integrationData, [e.target.name]: e.target.value });
  };

  const handleDeleteCard = () => {
    if (
      confirm(
        "Are you absolute sure you want to completely clear out your workspace dynamic configurations? This will reset form fields.",
      )
    ) {
      setCustomWorkspace({
        siteName: "",
        developerTitle: "",
        repoUrl: "",
        sitePictureUrl: "",
      });
      setIntegrationData({ whatsappHandle: "", telegramHandle: "" });
      setCustomProjectsList([]);
    }
  };

  const handlePublishWorkspace = async (e) => {
    if (e) e.preventDefault();
    const cleanSubdomain = subdomain.toLowerCase().trim();

    if (!cleanSubdomain) {
      alert("Please enter a custom username/subdomain!");
      return;
    }

    if (!hasLiveSite && RESERVED_SUBDOMAINS.includes(cleanSubdomain)) {
      alert(
        `"${cleanSubdomain}" is a protected system domain configuration phrase. Please pick another name.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("profiles").upsert([
        {
          id: session?.user?.id,
          username: cleanSubdomain,
          developer_name: customWorkspace.siteName,
          bio: customWorkspace.developerTitle,
          email: session?.user?.email,
          whatsapp_number: integrationData.whatsappHandle,
          telegram_handle: integrationData.telegramHandle,
          selected_projects: JSON.stringify(customProjectsList),
          theme_preference: selectedTheme,
          avatar_url: customWorkspace.sitePictureUrl,
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

      setPublishedUrl(`https://${cleanSubdomain}.devhub.ng`);
      setHasLiveSite(true);
      setCopyStep("success");
    } catch (error) {
      alert(error.message || "Error saving profile configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 px-6 pb-12">
      <div className="max-w-3xl mx-auto">
        {copyStep !== "success" && (
          <>
            <Link
              to="/"
              className="text-sm text-purple-600 hover:underline mb-4 inline-block"
            >
              &larr; Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Workspace Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {hasLiveSite
                ? "Manage your production engine properties."
                : "Configure your site and claim your subdomain."}
            </p>

            {/* EXPANDABLE THEME PALETTE */}
            <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-purple-600" />
                  <label className="text-sm font-bold text-gray-900 dark:text-white">
                    Choose Your Theme
                  </label>
                </div>
                <span className="text-xs text-gray-400">
                  {THEME_PALETTE.length} themes
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 flex-wrap mb-4">
                {["All", "Dark", "Light"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      activeCategory === cat
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Theme Grid */}
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                {displayedThemes.map((theme, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTheme(theme.name)}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:-translate-y-0.5 ${
                      selectedTheme === theme.name
                        ? "border-purple-500 shadow-md shadow-purple-500/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <div className="h-16 flex">
                      {theme.colors.map((color, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex-1 h-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="p-2.5 bg-white dark:bg-gray-900">
                      <p className="text-[11px] font-semibold text-gray-900 dark:text-white truncate">
                        {theme.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {theme.category}
                      </p>
                    </div>
                    {selectedTheme === theme.name && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Expand/Collapse */}
              {filteredThemes.length > 6 && (
                <div className="text-center pt-3">
                  <button
                    onClick={() => setShowAllThemes(!showAllThemes)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    {showAllThemes ? (
                      <>
                        Show Less <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        Show All {filteredThemes.length} Themes{" "}
                        <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* FLOW STEPS */}
        {copyStep === "selection" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <p className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <Code2 size={16} className="text-purple-500" /> Package Manifest
                Bundle Contents:
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
                onClick={
                  githubRepoUrl
                    ? () => window.open(githubRepoUrl, "_blank")
                    : handleConnectGitHub
                }
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  githubRepoUrl
                    ? "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Copy size={14} />{" "}
                {githubRepoUrl ? "Open Custom Repo" : "Connect GitHub"}
              </button>

              {/* DYNAMIC PARAMETER CONFIGURATION TABS FOR LIVE SITES */}
              <button
                onClick={() => setCopyStep("manualForm")}
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 transition py-3"
              >
                {hasLiveSite ? "Update Live Site" : "Type Parameters"}{" "}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {copyStep === "manualForm" && (
          <div className="space-y-4 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Workspace Configuration Core Parameters
              </h3>
              <button
                type="button"
                onClick={handleDeleteCard}
                className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                title="Reset Form Data"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Professional's/Dev Name
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="siteName"
                    value={customWorkspace.siteName}
                    onChange={handleWorkspaceChange}
                    placeholder="OP Emma"
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white pl-3 pr-9 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  />
                  <Cat
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Bio / Professional Title
                </label>
                <input
                  type="text"
                  name="developerTitle"
                  value={customWorkspace.developerTitle}
                  onChange={handleWorkspaceChange}
                  placeholder="Lead Engineer"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* EXPANDED FIELDS FOR CMS CONTROLS */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Site Profile Picture URL
              </label>
              <input
                type="url"
                name="sitePictureUrl"
                value={customWorkspace.sitePictureUrl}
                onChange={handleWorkspaceChange}
                placeholder="https://images.unsplash.com/... or github avatar link"
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
                onClick={() =>
                  hasLiveSite
                    ? setCopyStep("integrations")
                    : setCopyStep("domainPopup")
                }
                disabled={
                  !customWorkspace.siteName || !customWorkspace.developerTitle
                }
                className="w-2/3 rounded-lg bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 py-2.5 disabled:opacity-40"
              >
                {hasLiveSite ? "Configure Core Extensions" : "Allocate Domain"}
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
                placeholder="your-subdomain"
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
          <div className="space-y-6">
            <ProjectManager
              initialProjects={customProjectsList}
              onProjectsChange={(list) => setCustomProjectsList(list)}
            />

            <form
              onSubmit={handlePublishWorkspace}
              className="space-y-4 bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Link / Number
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
                    Telegram Handle
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

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCopyStep("manualForm")}
                  className="w-1/3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 py-2.5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 rounded-lg bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 py-2.5 disabled:opacity-40"
                >
                  {isSubmitting
                    ? "Syncing..."
                    : hasLiveSite
                      ? "Sync Structural Updates"
                      : "Upload & Publish Core"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* NATIVE SUCCESS PANEL */}
        {copyStep === "success" && (
          <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-5 animate-fade-in">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
              <CheckCircle size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Portfolio Synced!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Your deployment core engine has systematically updated and
                pushed changes out live to your mapped domain destination space.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-900 max-w-md mx-auto flex items-center justify-between gap-4">
              <span className="text-sm font-mono text-purple-600 dark:text-purple-400 select-all truncate">
                {publishedUrl}
              </span>
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-sm whitespace-nowrap"
              >
                Launch <ExternalLink size={12} />
              </a>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setCopyStep("selection")}
                className="text-xs text-gray-400 hover:text-purple-600 underline"
              >
                Return to Workspace Root
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
