export const site = {
  name: "Andras Hejj",
  title: "Andras Hejj",
  description:
    "Thoughts on engineering, product, and building things that matter.",
  domain: "andrashejj.com",
  url: "https://andrashejj.com",
  author: "Andras Hejj",
  email: "hello@andrashejj.com",
  social: {
    x: "https://x.com/andrashejj",
    github: "https://github.com/andrashejj",
    linkedin: "https://www.linkedin.com/in/andras-hejj-70a18764/",
  },
} as const;

export const staticPages = [
  { path: "/", priority: 1.0 },
  { path: "/blog", priority: 0.9 },
  { path: "/about", priority: 0.8 },
] as const;
