import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  Flame,
} from "lucide-react";

const AVAILABLE_TAGS = [
  "React",
  "Tailwind",
  "Supabase",
  "Node.js",
  "Python",
  "Django",
  "Three.js",
  "Stripe",
  "PayStack",
  "Framer",
];

const DEFAULT_PRESET_PROJECTS = [
  {
    id: "default-1",
    title: "App",
    client: "Chess Platform",
    progress: 85,
    url: "chess.com",
    tags: ["React", "Tailwind", "Node.js"],
  },
];

export default function ProjectManager({ initialProjects, onProjectsChange }) {
  // 1. Check if the user genuinely has an entry in the database (even an empty array means they initialized it)
  const hasCustomData =
    initialProjects !== undefined && initialProjects !== null;

  // 2. Fallback to default presets ONLY if initialProjects is completely missing/undefined
  const [projects, setProjects] = useState(() =>
    hasCustomData ? initialProjects : DEFAULT_PRESET_PROJECTS,
  );
  const [showForm, setShowForm] = useState(false);

  // 3. Keep database updates in sync cleanly
  useEffect(() => {
    if (hasCustomData) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  // Single Project Core Formulation State
  const [newProject, setNewProject] = useState({
    title: "",
    client: "",
    progress: 80,
    url: "",
    tags: [],
  });

  const handleTagToggle = (tag) => {
    setNewProject((prev) => {
      const isAlreadySelected = prev.tags.includes(tag);

      if (isAlreadySelected) {
        return {
          ...prev,
          tags: prev.tags.filter((t) => t !== tag),
        };
      } else {
        const updatedTags =
          prev.tags.length >= 3
            ? [...prev.tags.slice(1), tag]
            : [...prev.tags, tag];

        return {
          ...prev,
          tags: updatedTags,
        };
      }
    });
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.url) {
      alert("Please provide at least a project title and the site's link!");
      return;
    }

    // Filter out defaults if we are appending a fresh custom item
    const baseProjects = projects.some((p) =>
      p.id.toString().startsWith("default-"),
    )
      ? []
      : projects;

    const updated = [
      ...baseProjects,
      {
        ...newProject,
        id: `user-proj-${Date.now()}`,
        status:
          Number(newProject.progress) === 100 ? "Completed" : "In Progress",
      },
    ];

    setProjects(updated);
    onProjectsChange(updated);

    // Reset Form Environment
    setNewProject({
      title: "",
      client: "",
      progress: 80,
      url: "",
      tags: [],
    });
    setShowForm(false);
  };

  // CORRECT SELECTION FUNCTION (Duplicates removed)
  const handleRemoveProject = (id) => {
    const updated = projects.filter((p) => p.id !== id);

    // Keep it empty if they cleared everything, no platform defaults forcing themselves back.
    setProjects(updated);
    onProjectsChange(updated);
  };

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            Custom Project Showcase
          </h3>
          <p className="text-xs text-gray-400">
            Add live links and stack frameworks you worked with.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          {showForm ? <Minus size={14} /> : <Plus size={14} />}
          {showForm ? "Close Form" : "Build Project"}
        </button>
      </div>

      {/* FLUID TRANSITION SUBMISSION SCREEN CONTAINER */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showForm
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`p-4 rounded-xl bg-gray-50 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800/80 space-y-4 transition-all duration-300 transform origin-top ${
              showForm ? "translate-y-0 scale-100" : "-translate-y-2 scale-95"
            }`}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="E-Commerce API Core"
                  className="w-full text-xs rounded-lg border bg-white dark:bg-gray-900 dark:text-white border-gray-200 dark:border-gray-800 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">
                  Collaborator / Client
                </label>
                <input
                  type="text"
                  placeholder="UI Student Union"
                  className="w-full text-xs rounded-lg border bg-white dark:bg-gray-900 dark:text-white border-gray-200 dark:border-gray-800 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  value={newProject.client}
                  onChange={(e) =>
                    setNewProject({ ...newProject, client: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">
                  Site URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full text-xs rounded-lg border bg-white dark:bg-gray-900 dark:text-white border-gray-200 dark:border-gray-800 px-3 py-2 focus:border-purple-500 focus:outline-none"
                  value={newProject.url}
                  onChange={(e) =>
                    setNewProject({ ...newProject, url: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">
                  Sprint Metrics Progress ({newProject.progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-purple-600 mt-2"
                  value={newProject.progress}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      progress: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* CHIPS TAG SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5">
                Select Tech Stack Frameworks (Max 3 — FIFO queue)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((tag) => {
                  const selected = newProject.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                        selected
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-purple-300"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddProject}
              className="w-full mt-2 rounded-lg bg-gray-900 dark:bg-purple-600 hover:dark:bg-purple-700 text-white text-xs font-bold py-2.5 transition"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE USER PROJECTS ROW PREVIEW TRACKER */}
      <div className="space-y-2">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-900 rounded-xl"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${proj.progress === 100 ? "bg-emerald-500" : "bg-purple-600"}`}
              >
                {proj.progress === 100 ? (
                  <CheckCircle size={14} />
                ) : (
                  <Flame size={14} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {proj.title}
                </p>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  {proj.url} <ExternalLink size={8} />
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveProject(proj.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
