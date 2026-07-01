import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient.js";
import {
  ExternalLink,
  CheckCircle2,
  Flame,
  Layers,
  LayoutGrid,
  Gauge,
} from "lucide-react";

const defaultProjectsData = [
  {
    id: "d1",
    title: "Trust Events Ltd",
    client: "Collaborated with Trust Events CEO",
    progress: 80,
    status: "In Progress",
    url: "https://trustevents.com.ng/",
    image: "WhatsApp Image 2026-06-15 at 18.53.50.jpeg",
    tags: ["React", "Tailwind", "Stripe"],
  },
  {
    id: "d2",
    title: "Popcat",
    client: "Popcat.io",
    progress: 100,
    status: "Completed",
    url: "https://popcat.click/",
    image: "WhatsApp Image 2026-06-17 at 00.25.19.jpeg",
    tags: ["Audio Context", "Clicker Engine", "Event Matrix"],
  },
  {
    id: "d3",
    title: " UniTrade × UI Student Union",
    client: "Collaborated with UI Student Union",
    progress: 85,
    status: "In Progress",
    url: "https://unitradeconnect.com.ng/",
    image: "WhatsApp Image 2026-06-16 at 23.55.33.jpeg",
    tags: ["React", "PayStack", "Supabase"],
  },
  {
    id: "d4",
    title: "THREE",
    client: "Collaborated with THREE",
    progress: 100,
    status: "Completed",
    url: "https://three.ws/",
    image: "WhatsApp Image 2026-06-15 at 23.41.11.jpeg",
    tags: ["React", "Three.js", "Framer", "Blender"],
  },
  {
    id: "d5",
    title: "PyCon",
    client: "Collaborated with PyCon.co",
    progress: 100,
    status: "Completed",
    url: "https://ng.pycon.org/",
    image: "Screenshot 2026-06-17 001617.png",
    tags: ["Python", "Django", "Tailwind"],
  },
];

function Hero({ profile, customProjects = [], isSubdomain = false }) {
  const [session, setSession] = useState(null);
  const [mobileFilter, setMobileFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Resize window tracker setup
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if user is signed in
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

  // Determine active project rendering dataset: Use custom user uploads if they exist, otherwise fallback to filler data
  const projects =
    customProjects.length > 0 ? customProjects : defaultProjectsData;

  const inProgressProjects = projects.filter((p) => p.progress !== 100);
  const completedProjects = projects.filter((p) => p.progress === 100);

  const mobileFilteredProjects =
    mobileFilter === "in-progress"
      ? inProgressProjects
      : mobileFilter === "completed"
        ? completedProjects
        : projects;

  // Reusable functional layout template for the project cards
  const renderProjectCard = (project) => (
    <a
      key={project.id}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-600/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-900/40 cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={project.image_url || project.image}
          alt={`${project.title} Interface view`}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold shadow-md backdrop-blur-md ${
            project.progress === 100
              ? "bg-emerald-500/90 text-white"
              : "bg-purple-600/90 text-white"
          }`}
        >
          {project.progress === 100 ? (
            <CheckCircle2 size={12} />
          ) : (
            <Layers size={12} />
          )}
          {project.status ||
            (project.progress === 100 ? "Completed" : "In Progress")}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(project.tags || []).map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-gray-900 line-clamp-1 dark:text-white transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
          {project.title}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Client:{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {project.client}
          </span>
        </p>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-500 dark:text-gray-400">
              Sprint Progress
            </span>
            <span
              className={
                project.progress === 100
                  ? "text-emerald-500"
                  : "text-purple-600 dark:text-purple-400"
              }
            >
              {project.progress}%
            </span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                project.progress === 100
                  ? "bg-linear-to-r from-emerald-500 to-teal-400"
                  : "bg-linear-to-r from-purple-600 to-indigo-500"
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-end">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 transition-colors duration-200 group-hover:text-purple-600 dark:text-gray-500 dark:group-hover:text-purple-400">
            <ExternalLink size={12} />
          </div>
        </div>
      </div>
    </a>
  );

  return (
    <main className="w-full overflow-x-hidden bg-gray-50 px-6 py-12 transition-colors duration-300 dark:bg-gray-950 md:py-20">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* HERO HEADER SECTION */}
        <div className="text-center md:mx-auto md:max-w-3xl">
          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-purple-100 bg-purple-50/50 px-4 py-1.5 text-xs font-semibold text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/40 dark:text-purple-400">
            <Flame size={20} className="animate-pulse text-purple-600" />
            <span>Active Deployment Infrastructure Environment</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            {profile?.developer_name || "Live Development"}{" "}
            <span className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              {profile ? "Workspace" : "Sprints"}
            </span>{" "}
            {profile ? "" : "Center"}
          </h1>

          <p className="mt-4 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            {profile?.bio ||
              "Track live project metrics, fork layout structures, and preview functional client production pipelines instantly."}
          </p>

          {!isSubdomain && session && (
            <div className="mt-6">
              <Link
                to="/dashboard"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 active:scale-95"
              >
                <Gauge size={18} />
                <span>Dashboard</span>
              </Link>
            </div>
          )}
        </div>

        {/* INTERACTIVE WORKSPACE GRID */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <LayoutGrid size={20} className="text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {customProjects.length > 0
                  ? "Personal Built Projects"
                  : "Current Production Tracks"}
              </h2>
            </div>
            <span className="hidden sm:block text-xs font-medium text-gray-400 dark:text-gray-500">
              Showing {projects.length} Active Engines
            </span>
          </div>

          {/* MOBILE FILTER TOGGLE */}
          <div className="flex sm:hidden w-full">
            <div className="inline-flex w-full rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
              {["all", "in-progress", "completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setMobileFilter(filter)}
                  className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 capitalize ${
                    mobileFilter === filter
                      ? "bg-white text-purple-600 shadow-sm dark:bg-gray-700 dark:text-purple-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {filter.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop & Mobile Responsive Unified Grid Layout */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(isMobile ? mobileFilteredProjects : projects).map((project) =>
              renderProjectCard(project),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Hero;
