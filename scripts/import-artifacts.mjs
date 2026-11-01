// Copies a post's finished artefacts from the private project folders into this public repo.
//   npm run import -- <post-slug>
// Every file is scanned before it is written; a provenance record (checksums, no paths) goes to src/data/.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadRules, scanFile } from "./public-rules.mjs";

const slug = process.argv[2];
const plan = JSON.parse(readFileSync("artifacts.json", "utf8"));
if (!slug || !plan[slug]) {
  console.error(`Usage: npm run import -- <slug>\nKnown: ${Object.keys(plan).filter((k) => !k.startsWith("$")).join(", ")}`);
  process.exit(1);
}
if (!existsSync("artifacts.local.json")) {
  console.error("Missing artifacts.local.json: copy artifacts.local.example.json and set the folder roots.");
  process.exit(1);
}
const { roots } = JSON.parse(readFileSync("artifacts.local.json", "utf8"));
const rules = loadRules();

const resolve = (from) => {
  const [root, rel] = from.split(/:(.*)/s);
  if (!roots[root]) throw new Error(`Unknown root "${root}" in ${from}`);
  return path.join(roots[root], rel);
};

// Read and transform everything first, so nothing is written if any file fails the checks.
const tmpDir = path.join("node_modules", ".import-check");
mkdirSync(tmpDir, { recursive: true });
const staged = plan[slug].map((item) => {
  const src = resolve(item.from);
  if (!existsSync(src)) throw new Error(`Missing source for ${item.to}`);
  let data = readFileSync(src);
  if (item.pick) {
    const json = JSON.parse(data.toString("utf8"));
    data = Buffer.from(JSON.stringify(Object.fromEntries(item.pick.map((k) => [k, json[k]])), null, 2) + "\n");
  }
  const check = path.join(tmpDir, path.basename(item.to));
  writeFileSync(check, data);
  return { item, data, problems: scanFile(check, rules).map((p) => p.replace(check, item.to)) };
});
const problems = staged.flatMap((s) => s.problems);
if (problems.length) {
  console.error(`Import stopped; nothing was written:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

const provenance = { slug, importedAt: new Date().toISOString(), files: [] };
for (const { item, data } of staged) {
  mkdirSync(path.dirname(item.to), { recursive: true });
  writeFileSync(item.to, data);
  provenance.files.push({ path: item.to, bytes: data.length, sha256: createHash("sha256").update(data).digest("hex") });
  console.log(`  ${item.to} (${(data.length / 1e6).toFixed(2)} MB)`);
}
writeFileSync(path.join("src", "data", `${slug}.provenance.json`), JSON.stringify(provenance, null, 2) + "\n");
console.log(`Imported ${staged.length} files for ${slug}. Review with npm run dev before committing.`);
