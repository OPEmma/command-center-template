import { supabase } from "./supabaseClient.js";
import { useState, useEffect } from "react";
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

function Header({ profile }) {
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

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    const message = `Hi! I'd like to connect.\n\nName: ${formData.name}\nEmail: ${formData.email}`;
    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/${WHATSAPP_TARGET}?text=${encodedMessage}`,
      "_blank",
    );

    setIsOpen(false);
  };

  const brandName = profile?.developer_name || profile?.username || "DevHub";

  return (
    <>
      <header className="sticky top-0 z-50 w-full overflow-x-hidden border-b border-purple-100 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-600 p-2 text-white">
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
                  Dev<span className="text-purple-600">Hub</span>
                </>
              )}
            </a>
          </div>

          {/* Cleaned layout: The 3-Column Actions Container */}
          <div className="grid grid-cols-3 items-center gap-2 sm:gap-3 w-48 sm:w-72 md:w-80 justify-items-stretch">
            {/* Column 1: Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group relative flex h-9 w-full sm:h-10 items-center justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-xl border bg-gray-50 px-2 sm:px-4 text-gray-600 transition-all duration-300 hover:text-purple-600 hover:border-purple-300 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-purple-400"
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

            {/* Column 2: Authentication Trigger (Logout or State) */}
            <div className="flex items-center justify-center w-full">
              {session ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors hidden sm:block font-medium text-center w-full truncate"
                  >
                    Logout
                  </button>

                  <button
                    onClick={handleLogout}
                    className="sm:hidden p-2 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center w-full"
                    aria-label="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <div className="w-full text-center text-xs text-gray-400 dark:text-gray-500 font-medium truncate">
                  Guest
                </div>
              )}
            </div>

            {/* Column 3: Main Action Route (Connect / Get Started) */}
            <div className="w-full">
              {session ? (
                <button
                  onClick={() => {
                    setIsAuthModal(false);
                    setIsOpen(true);
                  }}
                  className="w-full justify-center rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 active:scale-95 flex items-center gap-1 sm:gap-1.5 px-1 sm:px-2"
                >
                  <span className="truncate">Connect</span>
                  <LinkIcon size={14} className="shrink-0" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModal(true);
                    setIsOpen(true);
                  }}
                  className="w-full text-center rounded-xl bg-purple-600 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all duration-200 active:scale-95 truncate px-1 sm:px-2"
                >
                  Get Started
                </button>
              )}
            </div>
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
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3">
                <LogIn size={24} className="text-purple-600" />
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
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
              />

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
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
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
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
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
                  className="rounded-xl bg-purple-600 text-xs sm:text-sm font-semibold text-white hover:bg-purple-700 py-2.5"
                >
                  Connect Messenger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
