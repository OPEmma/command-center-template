import { useState, useEffect } from "react";

export default function SprintsShowcase() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading config:", err));
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center text-purple-600 font-bold">Loading Infrastructure...</div>;

  return (
    <div className="mx-auto max-w-5xl p-6 min-h-screen bg-gray-50/50">
      <div className="mb-12 flex items-center gap-4 border-b border-gray-100 pb-8 pt-6">
        <img src={config.hero.avatarUrl} alt={config.developerName} className="h-16 w-16 rounded-full object-cover ring-4 ring-purple-100" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.hero.title}</h1>
          <p className="text-sm text-gray-500">Curated by {config.developerName} • <span className="text-purple-600 font-medium">{config.agencyDomain}</span></p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {config.sprints.map((sprint) => (
          <div key={sprint.id} className="overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl" style={{ borderRadius: config.theme.borderRadius }}>
            {config.theme.showBannerImage && (
              <div className="h-44 w-full bg-gray-100">
                <img src={sprint.imageUrl} alt={sprint.title} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{sprint.title}</h3>
                  <p className="text-xs text-gray-500">Client: {sprint.client}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 capitalize">{sprint.status}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Progress</span>
                  <span style={{ color: config.theme.primaryColor }}>{sprint.progress}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full transition-all duration-500 ease-out" style={{ width: sprint.progress, backgroundColor: config.theme.primaryColor }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
