// Scans every tracked-to-be file in the repo before it can be published. Runs locally and in CI.
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { loadRules, scanFile, warnBytes } from "./public-rules.mjs";

const skip = new Set(["node_modules", ".git", "dist", ".astro", "scripts", "artifacts.local.json", "artifacts.local.example.json"]);
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    if (skip.has(name)) return [];
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const rules = loadRules();
const files = walk(".");
const problems = files.flatMap((f) => scanFile(f, rules));
for (const f of files) {
  const size = statSync(f).size;
  if (size > warnBytes) console.warn(`note: ${f} is ${(size / 1e6).toFixed(1)} MB (GitHub warns over 50 MB, rejects over 100 MB)`);
}
if (problems.length) {
  console.error(`Not safe to publish:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-public: ${files.length} files OK`);
