import { useState } from "react";
import {
  ExternalLink,
  CheckCircle2,
  Flame,
  Layers,
  LayoutGrid,
} from "lucide-react";

const defaultProjectsData = [
  {
    id: 1,
    title: "Trust Events Ltd",
    client: "Collaborated with Trust Events CEO",
    progress: 80,
    status: "In Progress",
    url: "https://trustevents.com.ng/",
    image: "WhatsApp Image 2026-06-15 at 18.53.50.jpeg",
    tags: ["React", "Tailwind", "Stripe"],
  },
  {
    id: 2,
    title: "THREE",
    client: "Collaborated with THREE",
    progress: 100,
    status: "Completed",
    url: "https://three.ws/",
    image: "WhatsApp Image 2026-06-15 at 23.41.11.jpeg", 
    tags: ["React", "Three.js", "Framer", "Blender"],
  },
  {
    id: 3,
    title: " UniTrade × UI Student Union",
    client: "Collaborated with UI Student Union",
    progress: 80,
    status: "In Progress",
    url: "https://unitradeconnect.com.ng/",
    image: "WhatsApp Image 2026-06-16 at 23.55.33.jpeg",
    tags: ["React", "PayStack", "Supabase"],
  },
  {
    id: 4,
    title: "PyCon",
    client: "Collaborated with PyCon.co",
    progress: 100,
    status: "Completed",
    url: "https://ng.pycon.org/",
    image: "Screenshot 2026-06-17 001617.png",
    tags: ["Python", "Django", "Tailwind"],
  },
  {
    id: 5,
    title: "Popcat",
    client: "Popcat.io",
    progress: 100,
    status: "Completed",
    url: "https://popcat.click/",
    image: "WhatsApp Image 2026-06-17 at 00.25.19.jpeg",
    tags: ["Audio Context", "Clicker Engine", "Event Matrix"],
  },
];

function Hero({ profile }) {
  const projects = profile?.projects || defaultProjectsData;

  const [mobileFilter, setMobileFilter] = useState("all");

  const inProgressProjects = projects.filter((p) => p.progress !== 100);
  const completedProjects = projects.filter((p) => p.progress === 100);

  const mobileFilteredProjects =
    mobileFilter === "in-progress"
      ? inProgressProjects
      : mobileFilter === "completed"
        ? completedProjects
        : projects;

  return (
    <main className="min-w-full bg-gray-50 px-6 py-12 transition-colors duration-300 dark:bg-gray-950 md:py-20">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* HERO HEADER SECTION */}
        <div className="text-center md:mx-auto md:max-w-3xl">
          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-purple-100 bg-purple-50/50 px-4 py-1.5 text-xs font-semibold text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/40 dark:text-purple-400">
            <Flame size={20} className="animate-pulse text-purple-600" />
            <span>Active Deployment Infrastructure Environment</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Live Development{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Sprints
            </span>{" "}
            Center
          </h1>
          <p className="mt-4 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            Track live project metrics, fork layout structures, and preview
            functional client production pipelines instantly. Click code modules
            to synchronize states seamlessly.
          </p>
        </div>

        {/* INTERACTIVE WORKSPACE GRID */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <LayoutGrid size={20} className="text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Current Production Tracks
              </h2>
            </div>
            <span className="hidden sm:block text-xs font-medium text-gray-400 dark:text-gray-500">
              Showing {projects.length} Active Engines
            </span>
            <span className="block sm:hidden text-xs font-medium text-gray-400 dark:text-gray-500">
              {mobileFilteredProjects.length} Active
            </span>
          </div>

          {/* MOBILE FILTER TOGGLE */}
          <div className="flex sm:hidden w-full">
            <div className="inline-flex w-full rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
              <button
                onClick={() => setMobileFilter("all")}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  mobileFilter === "all"
                    ? "bg-white text-purple-600 shadow-sm dark:bg-gray-700 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMobileFilter("in-progress")}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  mobileFilter === "in-progress"
                    ? "bg-white text-purple-600 shadow-sm dark:bg-gray-700 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setMobileFilter("completed")}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  mobileFilter === "completed"
                    ? "bg-white text-emerald-600 shadow-sm dark:bg-gray-700 dark:text-emerald-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Desktop Layout Matrix */}
          <div className="hidden sm:grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-600/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-900/40"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={project.image}
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
                    {project.status}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 dark:text-white transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {project.title}
                    </h3>
                    <ExternalLink
                      size={14}
                      className="text-gray-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-gray-500 shrink-0 mt-1"
                    />
                  </div>

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
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : "bg-gradient-to-r from-purple-600 to-indigo-500"
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Mobile Layout Matrix */}
          <div className="grid sm:hidden gap-6 grid-cols-1">
            {mobileFilteredProjects.map((project) => (
              <a
                key={project.id}
                href={project.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-600/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-900/40"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={project.image}
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
                    {project.status}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 dark:text-white transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {project.title}
                    </h3>
                    <ExternalLink
                      size={14}
                      className="text-gray-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-gray-500 shrink-0 mt-1"
                    />
                  </div>

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
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : "bg-gradient-to-r from-purple-600 to-indigo-500"
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Hero;
