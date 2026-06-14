import { useState } from "react";

import {
  MessageSquare,
  Copy,
  X,
  ArrowRight,
  Layers,
  Sun,
  Moon,
} from "lucide-react";

function Header({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState(null); // 'build' or 'copy'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    platform: "whatsapp",
  });

  // These should come from a secure config or environment variable, not hardcoded
  const YOUR_WHATSAPP_NUMBER = profile?.whatsapp || "2348060110195";
  const YOUR_TELEGRAM_USERNAME = profile?.telegram || "OpEmmaVvy";

  // Theme State: tracking light or dark
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBuildSubmit = (e) => {
    e.preventDefault();

    const message = `Hi! I'd like to build a website.\n\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n💬 Preferred Platform: ${formData.platform}`;
    const encodedMessage = encodeURIComponent(message);

    if (formData.platform === "whatsapp") {
      // Send to YOUR WhatsApp number, not the user's
      window.open(
        `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodedMessage}`,
        "_blank",
      );
    } else {
      // Send to YOUR Telegram
      window.open(
        `https://t.me/${YOUR_TELEGRAM_USERNAME}?text=${encodedMessage}`,
        "_blank",
      );
    }

    setIsOpen(false);
    setOption(null);
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

          {/* MIDDLE AREA: ENHANCED DYNAMIC THEME TOGGLE */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="group relative flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 overflow-hidden rounded-xl border bg-gray-50 px-2.5 sm:px-4 text-gray-600 transition-all duration-300 hover:text-purple-600 hover:border-purple-300 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-purple-400"
              aria-label="Toggle website theme mode"
            >
              {/* Sun Icon with rotation animation */}
              <Sun
                size={16}
                className={`relative transition-all duration-500 ${
                  theme === "dark"
                    ? "-rotate-90 scale-0 opacity-0 absolute"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              />

              {/* Moon Icon with rotation animation */}
              <Moon
                size={16}
                className={`relative transition-all duration-500 ${
                  theme === "light"
                    ? "rotate-90 scale-0 opacity-0 absolute"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              />

              {/* Dynamic text that slides - hidden on mobile, visible on sm+ */}
              <span className="hidden sm:block relative overflow-hidden">
                <span
                  className={`block text-xs font-medium transition-all duration-500 ${
                    theme === "dark"
                      ? "-translate-y-full opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  Light
                </span>
                <span
                  className={`absolute inset-0 text-xs font-medium transition-all duration-500 ${
                    theme === "light"
                      ? "translate-y-full opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  Dark
                </span>
              </span>
            </button>
          </div>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-2xl transition-all border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setOption(null);
              }}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            {/* STEP 1: CHOOSE AN OPTION */}
            {!option && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Get Started with DevCenter
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Choose how you want to interact with our infrastructure
                  ecosystem.
                </p>

                <div className="grid gap-3 sm:gap-4">
                  <button
                    onClick={() => setOption("build")}
                    className="group flex items-start gap-3 sm:gap-4 rounded-xl border border-purple-100 bg-purple-50/50 p-3 sm:p-4 text-left transition hover:border-purple-300 hover:bg-purple-50"
                  >
                    <div className="rounded-lg bg-purple-600 p-2.5 sm:p-3 text-white group-hover:scale-105 transition">
                      <MessageSquare size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:font-semibold text-gray-900 flex items-center gap-2">
                        Build a Website{" "}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0"
                        />
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-600 mt-1">
                        Submit your basic contact info and route directly to
                        WhatsApp or Telegram to kickstart your customized
                        project development plan instantly.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOption("copy")}
                    className="group flex items-start gap-3 sm:gap-4 rounded-xl border border-gray-200 p-3 sm:p-4 text-left transition hover:border-purple-400 hover:bg-white"
                  >
                    <div className="rounded-lg bg-gray-100 p-2.5 sm:p-3 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition">
                      <Copy size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:font-semibold text-gray-900 flex items-center gap-2">
                        Copy Infrastructure{" "}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0"
                        />
                      </h4>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                        Duplicate this complete dashboard environment layout.
                        Replace visual assets, track custom timelines, and
                        adjust sprint values directly via no-code operational
                        configs.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2A: BUILD WEBSITE FORM SUBMIT */}
            {option === "build" && (
              <form onSubmit={handleBuildSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Project Brief Details
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Provide active contact info so we can link directly to your
                    messenger client platform choice.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Your Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                      className="w-full rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Preferred Chat Client Link Platform
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
                      <label
                        className={`flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl border cursor-pointer font-medium text-xs sm:text-sm transition ${formData.platform === "whatsapp" ? "border-purple-600 bg-purple-50 text-purple-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
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
                        className={`flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl border cursor-pointer font-medium text-xs sm:text-sm transition ${formData.platform === "telegram" ? "border-purple-600 bg-purple-50 text-purple-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
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

                <div className="flex gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOption(null)}
                    className="w-1/3 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-50 transition py-2 sm:py-2.5"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 rounded-xl bg-purple-600 text-xs sm:text-sm font-semibold text-white hover:bg-purple-700 transition shadow-lg shadow-purple-600/10 py-2 sm:py-2.5"
                  >
                    Connect Messenger Client
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2B: COPY INFRASTRUCTURE INTERFACE */}

            {/* STEP 2B: COPY INFRASTRUCTURE INTERFACE */}
            {option === "copy" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Fork Full Infrastructure
                  </h3>
                  <p className="text-sm text-gray-500">
                    Deploy this responsive app layout wrapper directly into an
                    editable workspace schema state template structure
                    instantly.
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2 text-xs text-gray-600">
                  <p className="flex items-center gap-2 font-medium text-gray-900">
                    📦 Package Manifest Bundle Contents:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      Fully Configured Recharts Month-over-Month Line Flowcharts
                    </li>
                    <li>Adaptive 4-Column Statcard Grid UI Containers</li>
                    <li>
                      No-Code Dynamic JSON State Mutators for Sprints & Images
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-xs text-purple-700 font-medium">
                  🚀 Ready to launch. Clicking below will instantly duplicate
                  this codebase into your own GitHub account so you can edit the
                  values freely.
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOption(null)}
                    className="w-1/3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Replace 'op-emma-vvy' and 'command-center-template' with your real GitHub names!
                      window.open(
                        "https://github.com/OPEmma/command-center-template",
                        "_blank",
                      );
                      setIsOpen(false);
                      setOption(null);
                    }}
                    className="w-2/3 rounded-xl bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 transition shadow-lg shadow-purple-600/10 py-2.5 flex items-center justify-center gap-2"
                  >
                    <Layers size={16} /> Clone Workspace Template
                  </button>
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
