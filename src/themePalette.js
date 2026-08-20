export const THEME_PALETTE = [
  { name: "Cyber Purple", colors: ["#7c3aed", "#6366f1", "#1e1b4b"], category: "Dark" },
  { name: "Emerald Matrix", colors: ["#059669", "#10b981", "#022c22"], category: "Dark" },
  { name: "Solar Flare", colors: ["#d97706", "#f59e0b", "#451a03"], category: "Dark" },
  { name: "Abyssal Blue", colors: ["#2563eb", "#3b82f6", "#172554"], category: "Dark" },
  { name: "Rose Gold", colors: ["#e11d48", "#f43f5e", "#4c0519"], category: "Dark" },
  { name: "Arctic Frost", colors: ["#0891b2", "#22d3ee", "#083344"], category: "Dark" },
  { name: "Sunset Boulevard", colors: ["#ea580c", "#f97316", "#431407"], category: "Dark" },
  { name: "Midnight Moss", colors: ["#4d7c0f", "#84cc16", "#1a2e05"], category: "Dark" },
  { name: "Velvet Noir", colors: ["#a21caf", "#d946ef", "#3b0764"], category: "Dark" },
  { name: "Ocean Depth", colors: ["#0369a1", "#0ea5e9", "#0c1929"], category: "Dark" },
  { name: "Lavender Dream", colors: ["#7c3aed", "#a78bfa", "#f5f3ff"], category: "Light" },
  { name: "Mint Fresh", colors: ["#059669", "#34d399", "#ecfdf5"], category: "Light" },
  { name: "Peach Cream", colors: ["#ea580c", "#fb923c", "#fff7ed"], category: "Light" },
  { name: "Skyline", colors: ["#0284c7", "#38bdf8", "#f0f9ff"], category: "Light" },
  { name: "Cherry Blossom", colors: ["#e11d48", "#fb7185", "#fff1f2"], category: "Light" },
  { name: "Honeycomb", colors: ["#d97706", "#fbbf24", "#fefce8"], category: "Light" },
];

const DEFAULT_THEME = THEME_PALETTE[0]; // Cyber Purple

export function getThemeColors(themeName) {
  const theme = THEME_PALETTE.find((t) => t.name === themeName);
  return theme ? theme.colors : DEFAULT_THEME.colors;
}

export function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}