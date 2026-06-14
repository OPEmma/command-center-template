import { useState, useEffect } from "react";
import { getSubdomain } from "./utils/subdomain";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function SprintsShowcase() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const userSubdomain = getSubdomain();

    // If no subdomain is detected, it shouldn't show a custom workspace
    if (!userSubdomain) {
      setError("No developer workspace specified.");
      setLoading(false);
      return;
    }

    // Dynamic URL: Fetches from your centralized hosting bucket or profile folder
    // e.g., /profiles/alex.json
    fetch(`/profiles/${userSubdomain}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Profile config not found");
        return res.json();
      })
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(`Workspace profile '${userSubdomain}' could not be initialized.`);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center text-purple-600 font-bold"><RefreshCw className="animate-spin mr-2" /> Initializing Workspace...</div>;

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center p-6 bg-gray-50">
        <AlertCircle size={40} className="text-red-500 mb-3" />
        <h2 className="text-lg font-bold text-gray-900">Infrastructure Error</h2>
        <p className="text-sm text-gray-500 max-w-sm mt-1">{error}</p>
        <a href="https://yourdomain.com" className="mt-4 text-sm font-semibold text-purple-600 hover:underline">Return to DevCenter Main Site</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 min-h-screen bg-gray-50/50">
      {/* (Rest of the beautiful Sprint UI mapping code stays exactly the same) */}
      <div className="mb-12 flex items-center gap-4 border-b border-gray-100 pb-8 pt-6">
        <img src={config.hero.avatarUrl} alt={config.developerName} className="h-16 w-16 rounded-full object-cover ring-4 ring-purple-100" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.hero.title}</h1>
          <p className="text-sm text-gray-500">Curated by {config.developerName} • <span className="text-purple-600 font-medium">{config.agencyDomain}</span></p>
        </div>
      </div>
      {/* sprints layer */}
    </div>
  );
}