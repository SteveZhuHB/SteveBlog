// Small helpers shared by pages and posts.

// Prefix a site path with the base path (the site lives under /SteveBlog/ on GitHub Pages).
export const withBase = (path: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
};

// Estimated reading time from the raw Markdown/MDX body: code, imports and tags removed, ~220 words a minute.
export const readingMinutes = (body = "") => {
  const text = body
    .replace(/^(import|export) .*$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " word ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });

// Numbers in posts come from exported data files, never retyped.
export const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");
export const pct = (x: number, digits = 0) => `${(x * 100).toFixed(digits)}%`;
export const millions = (n: number, digits = 1) => `${(n / 1e6).toFixed(digits)} million`;
