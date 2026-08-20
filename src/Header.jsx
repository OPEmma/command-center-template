import { supabase } from "./supabaseClient.js";
import { useState, useEffect } from "react";
import { getThemeColors, hexToRgba } from "./themePalette.js";
import {
  X,
  Layers,
  Sun,
  Moon,
  LogIn,
  Mail,
  LogOut,
  Link as LinkIcon,
} from "lucide-react";

function Header({ profile, isSubdomain = false }) {
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModal, setIsAuthModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const WHATSAPP_TARGET = profile?.whatsapp_number || "2348060110195";
  const [theme, setTheme] = useState("light");

  const [primary, secondary] = getThemeColors(profile?.theme_preference);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleOpenAuth = () => {
      setIsAuthModal(true);
      setIsOpen(true);
    };

    window.addEventListener("open-connect-modal", handleOpenAuth);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("open-connect-modal", handleOpenAuth);
    };
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
      setIsOpen(false);
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

  const buildWhatsAppLink = (rawNumber, message) => {
    const digitsOnly = rawNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
  };

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    const message = `Hi! I'd like to connect.\n\nName: ${formData.name}\nEmail: ${formData.email}`;
    window.open(buildWhatsAppLink(WHATSAPP_TARGET, message), "_blank");
    setIsOpen(false);
  };

  const brandName = profile?.developer_name || profile?.username || "DevHub";

  const handleSubdomainConnect = () => {
    const message = `Hi ${brandName}! I'd like to connect.`;
    window.open(buildWhatsAppLink(profile.whatsapp_number, message), "_blank");
  };

  return (
    <div style={{ "--theme-primary": primary, "--theme-secondary": secondary }}>
      <header className="sticky top-0 z-50 w-full overflow-x-hidden border-b border-purple-100 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/80">
        {/* FIXED CONTAINER: Added relative positioning to anchor the absolute centered toggle item */}
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* LOGO — Left Side */}
          <div className="flex items-center gap-2 z-10">
            <div
              className="rounded-lg p-2 text-white"
              style={{ backgroundColor: primary }}
            >
              <Layers size={20} />
            </div>
            <a
              href="/"
              className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 transition-colors duration-300 dark:text-white"
            >
              {profile ? (
                brandName
              ) : (
                <>
                  Dev<span style={{ color: primary }}>Hub</span>
                </>
              )}
            </a>
          </div>

          {/* THEME TOGGLE — Mathematical Dead Center */}
          {/* By stripping out grid flow and using left-1/2 -translate-x-1/2, this element sits perfectly centered on all devices regardless of surrounding sibling widths */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <button
              onClick={toggleTheme}
              className="group relative flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 overflow-hidden rounded-xl border bg-gray-50 px-2.5 sm:px-4 text-gray-600 transition-all duration-300 hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)]/40 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap"
              aria-label="Toggle website theme mode"
            >
              <Sun
                size={16}
                className={`transition-all duration-500 ${theme === "dark" ? "-rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"}`}
              />
              <Moon
                size={16}
                className={`transition-all duration-500 ${theme === "light" ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"}`}
              />
              <span className="hidden sm:block text-xs font-medium">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 z-10 shrink-0">
            {isSubdomain ? (
              profile?.whatsapp_number && (
                <button
                  onClick={handleSubdomainConnect}
                  className="rounded-xl bg-linear-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 hover:opacity-90 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Connect</span>
                  <LinkIcon size={14} />
                </button>
              )
            ) : session ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <LogOut size={16} className="sm:hidden" />
                </button>

                <button
                  onClick={() => {
                    setIsAuthModal(false);
                    setIsOpen(true);
                  }}
                  className="rounded-xl bg-linear-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 hover:opacity-90 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Connect</span>
                  <LinkIcon size={14} />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModal(true);
                  setIsOpen(true);
                }}
                className="rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: primary }}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modals remain completely unchanged below */}
      {isOpen && isAuthModal && !session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-full mb-3"
                style={{ backgroundColor: hexToRgba(primary, 0.12) }}
              >
                <LogIn size={24} style={{ color: primary }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Sign in to DevHub
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                No passwords required — just enter your email.
              </p>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-4 py-3 text-sm focus:border-[var(--theme-primary)] focus:outline-none"
              />

              {authError && (
                <p className="text-red-500 text-xs text-center">{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90"
                style={{ backgroundColor: primary }}
              >
                <Mail size={16} />
                {authLoading ? "Sending link..." : "Send Verification Link"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isOpen && (!isAuthModal || session) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-xl rounded-2xl border bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800 p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleConnectSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Connect Messenger
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Route conversations instantly via secure webhook pipelines.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2.5 text-sm focus:border-[var(--theme-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2.5 text-sm focus:border-[var(--theme-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl text-xs sm:text-sm font-semibold text-white py-2.5 hover:opacity-90"
                  style={{ backgroundColor: primary }}
                >
                  Connect Messenger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
