const RESERVED_SUBDOMAINS = [
  "www",
  "admin",
  "api",
  "blog",
  "status",
  "support",
  "dashboard",
  "config",
  "assets",
];

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default async function middleware(request) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  // Ignore requests hitting apex devhub.ng or www
  if (!host.endsWith(".devhub.ng") || host === "www.devhub.ng" || host === "devhub.ng") {
    return; 
  }

  const subdomain = host.replace(".devhub.ng", "");
  if (RESERVED_SUBDOMAINS.includes(subdomain)) {
    return;
  }

  // Query Supabase to see if this subdomain user has updated their boilerplate with custom code
  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?username=eq.${subdomain}&select=has_custom_deployment`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );

  if (!profileRes.ok) return;

  const rows = await profileRes.json();
  if (!rows[0]?.has_custom_deployment) {
    return; // Fall through to standard layout profile if they haven't run custom push yet
  }

  const objectPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const baseStorageUrl = `${SUPABASE_URL}/storage/v1/object/public/user-sites/${subdomain}`;

  // Fetch the user's compiled assets directly from the Supabase bucket
  let fileRes = await fetch(`${baseStorageUrl}${objectPath}`);
  if (!fileRes.ok) {
    fileRes = await fetch(`${baseStorageUrl}/index.html`); // Router fallback for Single Page Apps (SPA)
  }
  if (!fileRes.ok) return;

  return new Response(fileRes.body, {
    status: 200,
    headers: {
      "content-type": fileRes.headers.get("content-type") || "text/html",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}

export const config = {
  matcher: ["/(.*)"],
};