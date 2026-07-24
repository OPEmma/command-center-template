import { next } from "@vercel/functions";

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

function getContentType(path) {
  if (path.endsWith(".html") || path === "/") return "text/html; charset=utf-8";
  if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".json")) return "application/json";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return null;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  if (!host.endsWith(".devhub.ng") || host === "www.devhub.ng" || host === "devhub.ng") {
    return next();
  }

  const subdomain = host.replace(".devhub.ng", "");
  if (RESERVED_SUBDOMAINS.includes(subdomain)) {
    return next();
  }

  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?username=eq.${subdomain}&select=has_custom_deployment`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );

  if (!profileRes.ok) return next();

  const rows = await profileRes.json();
  if (!rows[0]?.has_custom_deployment) {
    return next();
  }

  const objectPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const baseStorageUrl = `${SUPABASE_URL}/storage/v1/object/public/user-sites/${subdomain}`;

  let fileRes = await fetch(`${baseStorageUrl}${objectPath}`);
  let servePath = objectPath;

  if (!fileRes.ok) {
    fileRes = await fetch(`${baseStorageUrl}/index.html`);
    servePath = "/index.html";
  }
  if (!fileRes.ok) return next();

  const contentType =
    getContentType(servePath) ||
    fileRes.headers.get("content-type") ||
    "text/html; charset=utf-8";

  if (contentType.includes("text/html")) {
    let htmlText = await fileRes.text();

    const envScript = `<script>window.__ENV__=${JSON.stringify({
      VITE_SUPABASE_URL: SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
    })};</script>`;

    htmlText = htmlText.replace("<head>", `<head>${envScript}`);

    return new Response(htmlText, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  }

  return new Response(fileRes.body, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}

export const config = {
  matcher: ["/(.*)"],
};