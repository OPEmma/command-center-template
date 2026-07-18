import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

// Verify this matches your framework's build directory (e.g. 'dist' for Vite, 'out' or '.next' for others)
const DIST_DIR = "dist"; 
const DEPLOY_ENDPOINT = "https://umiauevfaxqlfbuujskl.supabase.co/functions/v1/deploy-site";

const CONTENT_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function collectFiles(dir, base = dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    files = statSync(fullPath).isDirectory()
      ? files.concat(collectFiles(fullPath, base))
      : files.concat([fullPath]);
  }
  return files;
}

async function main() {
  const files = collectFiles(DIST_DIR).map((filePath) => ({
    path: "/" + relative(DIST_DIR, filePath).replace(/\\/g, "/"),
    content_base64: readFileSync(filePath).toString("base64"),
    content_type: CONTENT_TYPES[extname(filePath)] || "application/octet-stream",
  }));

  const res = await fetch(DEPLOY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ repository: process.env.GITHUB_REPOSITORY, files }),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error("Deploy failed:", result);
    process.exit(1);
  }
  console.log("Deployed successfully:", result);
}

main();