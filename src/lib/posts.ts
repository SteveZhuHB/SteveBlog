import { getCollection } from "astro:content";

// Published posts, newest first. Drafts show in `npm run dev`, or in a build with SHOW_DRAFTS=1 (local preview only).
export const getPosts = async () =>
  (await getCollection("blog", ({ data }) => import.meta.env.DEV || process.env.SHOW_DRAFTS === "1" || !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
