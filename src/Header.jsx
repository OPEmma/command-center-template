import { supabase } from "C:\Users\youTube\Documents\New folder\freelance\src\supabaseClient.js";
import { useState } from "react";
import {
  MessageSquare,
  Copy,
  X,
  ArrowRight,
  Layers,
  Sun,
  Moon,
  Globe,
  Settings,
  Sparkles,
} from "lucide-react";

// Curated elite preset themes to prevent awkward custom style mixtures
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

function Header({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState(null); // null | 'build' | 'copy'
  const [copyStep, setCopyStep] = useState("selection"); // 'selection' | 'manualForm' | 'domainPopup' | 'integrations'
  const [selectedTheme, setSelectedTheme] = useState("cyberPurple");

  // Custom Workspace Inputs
  const [subdomain, setSubdomain] = useState("");
  const [customWorkspace, setCustomWorkspace] = useState({
    siteName: "",
    developerTitle: "",
    repoUrl: "",
  });

  // New states for integrations and custom sites step
  const [integrationData, setIntegrationData] = useState({
    whatsappHandle: "",
    telegramHandle: "",
    customSites: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    platform: "whatsapp",
  });

  const YOUR_WHATSAPP_NUMBER = profile?.whatsapp || "2348060110195";
  const YOUR_TELEGRAM_USERNAME = profile?.telegram || "OpEmmaVvy";
  const [theme, setTheme] = useState("light");

  const currentActiveTheme = EXCLUSIVE_THEMES[selectedTheme];

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWorkspaceChange = (e) => {
    setCustomWorkspace({ ...customWorkspace, [e.target.name]: e.target.value });
  };

  const handleIntegrationChange = (e) => {
    setIntegrationData({ ...integrationData, [e.target.name]: e.target.value });
  };

  const handleBuildSubmit = (e) => {
    e.preventDefault();
    const message = `Hi! I'd like to build a website.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nPreferred Platform: ${formData.platform}`;
    const encodedMessage = encodeURIComponent(message);

    if (formData.platform === "whatsapp") {
      window.open(
        `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodedMessage}`,
        "_blank",
      );
    } else {
      window.open(
        `https://t.me/${YOUR_TELEGRAM_USERNAME}?text=${encodedMessage}`,
        "_blank",
      );
    }

    setIsOpen(false);
    setOption(null);
  };

  const handlePublishWorkspace = async (e) => {
    e.preventDefault();

    if (!subdomain) {
      alert("Please enter a custom username/subdomain!");
      return;
    }

    try {
      const { data, error } = await supabase.from("profiles").insert([
        {
          username: subdomain.toLowerCase().trim(),
          full_name: customWorkspace.siteName,
          bio: customWorkspace.developerTitle,
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
        `Your portfolio is launching live at https://${subdomain.toLowerCase().trim()}.devhub.ng`,
      );

      // Reset clean modal state
      setIsOpen(false);
      setOption(null);
      setCopyStep("selection");
      setSubdomain("");
      setCustomWorkspace({
        siteName: "",
        developerTitle: "",
        repoUrl: "",
      });
      setIntegrationData({
        whatsappHandle: "",
        telegramHandle: "",
        customSites: "",
      });
    } catch (error) {
      alert(error.message || "Something went wrong saving your profile.");
    }
  };

  return (
    <>
      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* LOGO AREA */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-600 p-2 text-white">
              <Layers size={20} />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 transition-colors duration-300 dark:text-white">
              Dev<span className="text-purple-600">Hub</span>
            </span>
          </div>

          {/* MIDDLE AREA: THEME TOGGLE CENTERED */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="group relative flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 overflow-hidden rounded-xl border bg-gray-50 px-2.5 sm:px-4 text-gray-600 transition-all duration-300 hover:text-purple-600 hover:border-purple-300 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-purple-400"
              aria-label="Toggle website theme mode"
            >
              <Sun
                size={16}
                className={`relative transition-all duration-500 ${theme === "dark" ? "-rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"}`}
              />
              <Moon
                size={16}
                className={`relative transition-all duration-500 ${theme === "light" ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"}`}
              />
              <span className="hidden sm:block relative overflow-hidden">
                <span
                  className={`block text-xs font-medium transition-all duration-500 ${theme === "dark" ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
                >
                  Light
                </span>
                <span
                  className={`absolute inset-0 text-xs font-medium transition-all duration-500 ${theme === "light" ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
                >
                  Dark
                </span>
              </span>
            </button>
          </div>

          {/* SIGN UP ACTION */}
          <div>
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-xl bg-purple-600 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all duration-200 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 transition-all">
          <div
            className={`relative w-full max-w-xl overflow-hidden rounded-2xl border bg-gradient-to-br ${option === "copy" ? `${currentActiveTheme.bg} ${currentActiveTheme.border}` : "bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800"} p-5 sm:p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95`}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setOption(null);
                setCopyStep("selection");
              }}
              className={`absolute right-3 top-3 sm:right-4 sm:top-4 p-1 rounded-lg transition-colors ${option === "copy" ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              <X size={18} />
            </button>

            {/* STEP 1: CHOOSE AN OPTION */}
            {!option && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Get Started with DevCenter
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Choose how you want to interact with our infrastructure
                  ecosystem.
                </p>

                <div className="grid gap-3 sm:gap-4">
                  <button
                    onClick={() => setOption("build")}
                    className="group flex items-start gap-3 sm:gap-4 rounded-xl border border-purple-100 bg-purple-50/50 p-3 sm:p-4 text-left transition hover:border-purple-300 hover:bg-purple-50 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-gray-800"
                  >
                    <div className="rounded-lg bg-purple-600 p-2.5 sm:p-3 text-white group-hover:scale-105 transition">
                      <MessageSquare size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        Build a Website{" "}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0"
                        />
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Submit your basic contact info and route directly to
                        WhatsApp or Telegram to kickstart your project plan.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOption("copy")}
                    className="group flex items-start gap-3 sm:gap-4 rounded-xl border border-gray-200 p-3 sm:p-4 text-left transition hover:border-purple-400 hover:bg-white dark:border-gray-800 dark:bg-gray-800/20 dark:hover:bg-gray-800"
                  >
                    <div className="rounded-lg bg-gray-100 p-2.5 sm:p-3 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600 dark:bg-gray-800 dark:text-gray-400 transition">
                      <Copy size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        Copy Infrastructure Template{" "}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0"
                        />
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Duplicate this codebase via GitHub or type manual node
                        configurations to deploy directly into your sandbox
                        profile dynamically.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2A: CONTACT FORM SUBMIT */}
            {option === "build" && (
              <form onSubmit={handleBuildSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Project Brief Details
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Provide contact info to link directly to your messenger
                    choice.
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234..."
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Preferred Platform
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <label
                        className={`flex items-center justify-center p-2.5 sm:p-3 rounded-xl border cursor-pointer font-medium text-xs sm:text-sm transition ${formData.platform === "whatsapp" ? "border-purple-600 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50"}`}
                      >
                        <input
                          type="radio"
                          name="platform"
                          value="whatsapp"
                          checked={formData.platform === "whatsapp"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        WhatsApp
                      </label>
                      <label
                        className={`flex items-center justify-center p-2.5 sm:p-3 rounded-xl border cursor-pointer font-medium text-xs sm:text-sm transition ${formData.platform === "telegram" ? "border-purple-600 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50"}`}
                      >
                        <input
                          type="radio"
                          name="platform"
                          value="telegram"
                          checked={formData.platform === "telegram"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        Telegram
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOption(null)}
                    className="w-1/3 rounded-xl border border-gray-200 dark:border-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold text-gray-600 py-2 sm:py-2.5"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 rounded-xl bg-purple-600 text-xs sm:text-sm font-semibold text-white hover:bg-purple-700 py-2 sm:py-2.5"
                  >
                    Connect Messenger
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2B: REBUILT VIBRANT INFRASTRUCTURE ENGINE */}
            {option === "copy" && (
              <div className="text-white space-y-5">
                {/* Header Row */}
                <div>
                  <div className="flex items-center gap-2">
                    <Settings
                      className={`animate-spin [animation-duration:8s] ${currentActiveTheme.text}`}
                      size={18}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${currentActiveTheme.text}`}
                    >
                      Automated Schema Core
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight mt-1">
                    Fork Full Infrastructure
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deploy this responsive app layout wrapper directly into an
                    editable structure.
                  </p>
                </div>

                {/* THEME PRESET PICKER BUTTON GRID */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Curated Node Preset Theme Palette
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(EXCLUSIVE_THEMES).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedTheme(key)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          selectedTheme === key
                            ? `${currentActiveTheme.border} bg-white/10 font-semibold text-white`
                            : "border-transparent bg-slate-950/40 text-slate-400 hover:bg-slate-950/60"
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

                {/* FLOW TRACKER VIEWS */}
                <div className="min-h-[180px]">
                  {/* PATHWAY 1: MAIN SELECTION */}
                  {copyStep === "selection" && (
                    <div className="space-y-3">
                      <div className="rounded-xl bg-white/5 border border-white/5 p-4 space-y-2 text-xs text-slate-300">
                        <p className="flex items-center gap-2 font-semibold text-white">
                          Package Manifest Bundle Contents:
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                          <li>
                            Fully Configured Recharts Month-over-Month Line
                            Flowcharts
                          </li>
                          <li>Adaptive 4-Column Statcard Grid UI Containers</li>
                          <li>
                            No-Code Dynamic JSON State Mutators for Sprints &
                            Images
                          </li>
                        </ul>
                      </div>

                      <div
                        className={`border rounded-xl p-3 text-xs font-medium flex items-center gap-2 ${currentActiveTheme.pill}`}
                      >
                        <Sparkles size={14} className="shrink-0" />
                        Ready to launch. Choose your replication pipeline method
                        below to spin up the asset wrapper.
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            window.open(
                              "https://github.com/OPEmma/command-center-template",
                              "_blank",
                            );
                            setIsOpen(false);
                            setOption(null);
                          }}
                          className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-bold text-white transition py-3"
                        >
                          <Copy size={14} /> Visit Repository
                        </button>
                        <button
                          type="button"
                          onClick={() => setCopyStep("manualForm")}
                          className={`flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition py-3 ${currentActiveTheme.accent}`}
                        >
                          Type Parameters <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PATHWAY 2: MANUAL WORKSPACE FORM */}
                  {copyStep === "manualForm" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Workspace Hub Name
                          </label>
                          <input
                            type="text"
                            name="siteName"
                            value={customWorkspace.siteName}
                            onChange={handleWorkspaceChange}
                            placeholder="e.g. Nexus Core"
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Developer Handle Title
                          </label>
                          <input
                            type="text"
                            name="developerTitle"
                            value={customWorkspace.developerTitle}
                            onChange={handleWorkspaceChange}
                            placeholder="e.g. Lead Architect"
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Source Repository Target URL (Optional)
                        </label>
                        <input
                          type="url"
                          name="repoUrl"
                          value={customWorkspace.repoUrl}
                          onChange={handleWorkspaceChange}
                          placeholder="https://github.com/..."
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-600"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setCopyStep("selection")}
                          className="w-1/3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:bg-white/5 py-2.5"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setCopyStep("domainPopup")}
                          disabled={
                            !customWorkspace.siteName ||
                            !customWorkspace.developerTitle
                          }
                          className={`w-2/3 rounded-xl text-xs font-bold py-2.5 transition disabled:opacity-40 disabled:cursor-not-allowed ${currentActiveTheme.accent}`}
                        >
                          Allocate System Domain
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PATHWAY 3: POPUP DOMAIN RESERVATION */}
                  {copyStep === "domainPopup" && (
                    <div className="space-y-4 text-center py-2">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-xl text-purple-400">
                        <Globe size={20} className={currentActiveTheme.text} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold tracking-tight">
                          Claim Your Network Identity
                        </h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
                          Assign a secure subdomain prefix to route your
                          compiled sandbox environment files.
                        </p>
                      </div>

                      <div className="max-w-xs mx-auto">
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-slate-600 transition-colors">
                          <input
                            type="text"
                            placeholder="your-workspace"
                            className="w-full bg-transparent px-3 py-2 text-sm text-white focus:outline-none text-right placeholder-slate-600 font-medium"
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
                          <span className="bg-white/5 px-3 py-2 text-xs font-bold tracking-wide text-slate-400 border-l border-slate-800 shrink-0">
                            .devhub.ng
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setCopyStep("manualForm")}
                          className="px-5 py-2 text-xs font-bold border border-slate-800 rounded-xl text-slate-400 hover:bg-white/5"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          disabled={!subdomain}
                          onClick={() => setCopyStep("integrations")}
                          className={`px-6 py-2 text-xs font-bold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed ${currentActiveTheme.accent}`}
                        >
                          Configure Contacts
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PATHWAY 4: INTEGRATION HANDLES & FALLBACK SITES */}
                  {copyStep === "integrations" && (
                    <form
                      onSubmit={handlePublishWorkspace}
                      className="space-y-3 text-left animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            WhatsApp Handle / No.
                          </label>
                          <input
                            type="text"
                            name="whatsappHandle"
                            value={integrationData.whatsappHandle}
                            onChange={handleIntegrationChange}
                            placeholder="e.g. +234..."
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Telegram Username
                          </label>
                          <input
                            type="text"
                            name="telegramHandle"
                            value={integrationData.telegramHandle}
                            onChange={handleIntegrationChange}
                            placeholder="e.g. @telegram-username"
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Sites Created / Collabs (Optional)
                        </label>
                        <textarea
                          name="customSites"
                          value={integrationData.customSites}
                          onChange={handleIntegrationChange}
                          rows={2}
                          placeholder="Leave completely blank to use original hardcoded sites instead..."
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-600 resize-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setCopyStep("domainPopup")}
                          className="w-1/3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:bg-white/5 py-2.5"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className={`w-2/3 rounded-xl text-xs font-bold py-2.5 transition ${currentActiveTheme.accent}`}
                        >
                          Upload & Publish Core
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
