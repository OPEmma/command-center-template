import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

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

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Short-lived cache so a page load (HTML + many assets) is one Supabase lookup, not dozens
const flagCache = new Map();
const FLAG_TTL_MS = 30_000;

async function hasCustomDeployment(subdomain) {
  const cached = flagCache.get(subdomain);
  if (cached && Date.now() - cached.at < FLAG_TTL_MS) return cached.value;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?username=eq.${encodeURIComponent(subdomain)}&select=has_custom_deployment`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    if (!res.ok) return false;
    const rows = await res.json();
    const value = Boolean(rows[0]?.has_custom_deployment);
    flagCache.set(subdomain, { value, at: Date.now() });
    return value;
  } catch {
    return false; // fail safe: fall back to the shared template
  }
}

const app = express();
app.set("trust proxy", true);

// Custom-deployment proxy: runs before the shared app is served
app.use(async (req, res, next) => {
  const host = req.hostname.toLowerCase();

  if (!host.endsWith(".devhub.ng") || host === "www.devhub.ng") return next();

  const subdomain = host.replace(".devhub.ng", "");
  if (RESERVED_SUBDOMAINS.includes(subdomain)) return next();
  if (!(await hasCustomDeployment(subdomain))) return next();

  const base = `${SUPABASE_URL}/storage/v1/object/public/user-sites/${subdomain}`;
  const reqPath = req.path === "/" ? "/index.html" : req.path;
  const hasExtension = path.extname(reqPath) !== "";

  let servePath = reqPath;
  let fileRes = await fetch(`${base}${servePath}`);

  // SPA fallback only for extensionless routes, so a missing .js never comes back as HTML
  if (!fileRes.ok && !hasExtension) {
    servePath = "/index.html";
    fileRes = await fetch(`${base}${servePath}`);
  }
  if (!fileRes.ok) return next();

  const contentType =
    CONTENT_TYPES[path.extname(servePath)] ||
    fileRes.headers.get("content-type") ||
    "application/octet-stream";

  res.set("Content-Type", contentType);
  res.set("Cache-Control", "public, max-age=0, must-revalidate");

  if (contentType.startsWith("text/html")) {
    const envScript = `<script>window.__ENV__=${JSON.stringify({
      VITE_SUPABASE_URL: SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
    }).replace(/</g, "\\u003c")};</script>`;
    const html = (await fileRes.text()).replace("<head>", `<head>${envScript}`);
    return res.send(html);
  }

  return res.send(Buffer.from(await fileRes.arrayBuffer()));
});

// Shared DevHub app (apex, www, reserved, and subdomains without a custom build)
app.use(express.static(DIST));
app.use((req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`DevHub server listening on ${port}`));
