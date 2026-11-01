// Rules for anything that goes into this public repo. Extra private words come from artifacts.local.json.
import { existsSync, readFileSync } from "node:fs";

export const maxBytes = 95 * 1024 * 1024; // GitHub rejects files over 100 MB
export const warnBytes = 50 * 1024 * 1024; // GitHub warns over 50 MB

const generic = [
  { name: "local file path", re: /\/Users\/[A-Za-z0-9._-]+\//g },
  { name: "Databricks workspace URL", re: /[a-z0-9-]+\.cloud\.databricks\.com/gi },
  { name: "Azure Databricks workspace URL", re: /adb-\d+\.\d+\.azuredatabricks\.net/gi },
  { name: "Databricks token", re: /\bdapi[0-9a-f]{32}\b/g },
  { name: "GitHub token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g },
  { name: "private key", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
];

export const loadRules = () => {
  const local = existsSync("artifacts.local.json") ? JSON.parse(readFileSync("artifacts.local.json", "utf8")) : {};
  const words = (local.forbidden ?? []).map((w) => ({ name: "forbidden word", re: new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi") }));
  return [...generic, ...words];
};

const textLike = /\.(html?|json|md|mdx|astro|js|mjs|ts|css|svg|txt|xml|ya?ml|geojson)$/i;

// Returns a list of problems for one file (empty when it is safe to publish).
export const scanFile = (file, rules) => {
  const problems = [];
  const buf = readFileSync(file);
  if (buf.length > maxBytes) problems.push(`${file}: ${(buf.length / 1e6).toFixed(1)} MB is over the ${maxBytes / 1024 / 1024} MB limit`);
  if (textLike.test(file)) {
    const text = buf.toString("utf8");
    for (const { name, re } of rules) {
      const hits = text.match(re);
      if (hits) problems.push(`${file}: ${name} (${[...new Set(hits)].slice(0, 3).join(", ")})`);
    }
  }
  return problems;
};
