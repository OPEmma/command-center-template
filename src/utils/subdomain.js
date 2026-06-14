export function getSubdomain() {
  const hostname = window.location.hostname; // e.g., "alex.devhub.ng"
  
  // Local development fallback
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("user") || null; 
  }

  // Handle your official production domain explicitly
  if (hostname.endsWith("devhub.ng")) {
    const parts = hostname.replace(".devhub.ng", "").split(".");
    // If anything is left over before devhub.ng, and it's not 'www', treat it as a subdomain
    if (parts.length > 0 && parts[0] !== "" && parts[0] !== "www") {
      return parts[0]; // Returns "alex" from alex.devhub.ng
    }
  }
  
  return null; //  landing page (devhub.ng or www.devhub.ng)
}