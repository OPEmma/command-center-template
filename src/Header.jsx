import { supabase } from "./supabaseClient.js";
import { useState, useEffect } from "react";
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
  LogIn,
  Mail,
  Gauge,
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

function Header({ profile }) {
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState(null);
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
    email: "",
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      alert("Verification link sent! Check your email to sign in.");
      setAuthEmail("");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

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

      setIsOpen(false);
      setOption(null);
      setCopyStep("selection");
      setSubdomain("");
      setCustomWorkspace({ siteName: "", developerTitle: "", repoUrl: "" });
      setIntegrationData({
        email: "",
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-600 p-2 text-white">
              <Layers size={20} />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 transition-colors duration-300 dark:text-white">
              Dev<span className="text-purple-600">Hub</span>
            </span>
          </div>

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

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                  {session.user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors hidden sm:block"
                >
                  Logout
                </button>
                <a
                  href="/dashboard"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  <Gauge size={16} />
                  <span>Dashboard</span>
                </a>
              </>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="rounded-xl bg-purple-600 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all duration-200 active:scale-95"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* AUTH MODAL */}
      {isOpen && !session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3">
                <LogIn size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Sign in to DevHub
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                No passwords — just enter your email.
              </p>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              {authError && (
                <p className="text-red-500 text-xs text-center">{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                {authLoading ? "Sending link..." : "Send Verification Link"}
              </button>
            </form>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
              We'll email you a one-click login link. No password needed.
            </p>
          </div>
        </div>
      )}

      {/* CONNECT WITH US MODAL (BUILD) */}
      {isOpen && session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 transition-all">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border bg-gradient-to-br bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800 p-5 sm:p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setIsOpen(false);
                setOption(null);
              }}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 p-1 rounded-lg transition-colors text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </button>

            {!option && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome, {session.user.email}
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
                </div>
              </div>
            )}

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
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
