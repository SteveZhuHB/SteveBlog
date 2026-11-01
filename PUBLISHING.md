# Publishing a post

This repo is **public** and only ever receives finished work. Drafts, code, notebooks and raw data stay in the
private project folders. Everything here is checked by `npm run check:public` before it can be deployed.

## One-time setup
1. `npm install`
2. Copy `artifacts.local.example.json` to `artifacts.local.json` (git-ignored) and set:
   - `roots`: the local folders of your private projects.
   - `forbidden`: words that must never appear in a published file (for example employer or client names).
3. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.

## For each post
1. **Finish the work** in the private project: the analysis export, the deck or map, the still images.
2. **List the artefacts** for the post in `artifacts.json`: where each file comes from (`<root>:<path>`) and where it
   goes. For a JSON export, `pick` keeps only the fields the post needs.
3. **Import:** `npm run import -- <slug>`. Every file is scanned first; if anything fails, nothing is written. A
   provenance record (sizes and SHA-256, no local paths) goes to `src/data/<slug>.provenance.json`.
4. **Write the post** in `src/content/blog/<slug>.mdx` with `draft: true`.
   - Import the data file and render numbers from it (`{fmt(facts.lsoas)}`); never retype a figure.
   - End with **Method and sources**: datasets, releases, licence wording, plain-English steps, limits.
   - Credit basemaps and data in every figure caption.
5. **Review locally:** `npm run dev`, then open the post. Drafts show in dev only.
6. **Publish:**
   - Set `draft: false` and the real `pubDate`.
   - Run `npm run check:public && npm run build`.
   - Commit and push to `main`. GitHub Actions checks, builds and deploys.
7. **Share:** link the post from LinkedIn (and YouTube, once videos are posted there).

## Rules
- Nothing goes in this repo until it is ready to be public. Git history keeps deleted files.
- Files over 50 MB trigger a GitHub warning; over 100 MB are rejected. Large videos belong on YouTube.
- Third-party logos are used unmodified, and only to show the platform a project runs on.
