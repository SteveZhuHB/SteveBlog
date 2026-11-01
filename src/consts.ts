export const SITE = {
  title: "Small Solid Steps",
  short: "S³",
  author: "Steve Zhu",
  description: "Serious tech, curious minds, occasionally ridiculous ideas. Data & AI experiments explained step by step.",
  tagline: "Data · AI · Architecture · Beyond",
  series: "Data in Motion",
  disclosure: "A personal project; views are my own. I work for a Databricks partner. Not affiliated with or endorsed by Databricks.",
  licence: "Text and visuals © Steve Zhu. All rights reserved. Datasets remain under their own licences.",
  links: {
    linkedin: "https://www.linkedin.com/in/steve-zhu-uk/",
    youtube: "",
    github: "https://github.com/SteveZhuHB",
  },
} as const;

export const LINK_LABELS: Record<keyof typeof SITE.links, string> = {
  linkedin: "LinkedIn",
  youtube: "YouTube",
  github: "GitHub",
};

export const socialLinks = (Object.keys(SITE.links) as (keyof typeof SITE.links)[])
  .filter((k) => SITE.links[k])
  .map((k) => ({ label: LINK_LABELS[k], url: SITE.links[k] }));
