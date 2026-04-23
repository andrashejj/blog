import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { site } from "../../lib/site";

const posts = await getCollection("posts", ({ data }) => !data.draft);

const pages: Record<string, { title: string; description: string }> = {};

pages["index"] = {
  title: site.name,
  description: site.description,
};
pages["blog"] = {
  title: "Blog",
  description: "A chronologically organized archive of articles.",
};
pages["about"] = {
  title: "About",
  description: site.description,
};
pages["subscribe"] = {
  title: "Subscribe",
  description: `RSS feed for ${site.name}'s posts.`,
};

for (const post of posts) {
  pages[`blog/${post.data.slug}`] = {
    title: post.data.title,
    description: post.data.summary,
  };
}

// Newsprint palette — mirrors the tokens in src/styles/global.css so the share
// card feels cut from the same paper as the site. The atmospheric layer (radial
// glows + grain) is pre-rendered into public/og-templates/paper.png via
// scripts/generate-og-background.mjs; astro-og-canvas only needs to overlay the
// title, description, and masthead avatar on top.
const ink: [number, number, number] = [27, 23, 19];
const muted: [number, number, number] = [111, 95, 79];

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    fonts: [
      "./public/fonts/Fraunces-SemiBold.ttf",
      "./public/fonts/Fraunces-Regular.ttf",
      "./public/fonts/Fraunces-Italic.ttf",
    ],
    font: {
      title: {
        families: ["Fraunces"],
        weight: "SemiBold",
        size: 82,
        lineHeight: 1.08,
        color: ink,
      },
      description: {
        families: ["Fraunces"],
        weight: "Normal",
        size: 34,
        lineHeight: 1.4,
        color: muted,
      },
    },
    bgImage: {
      path: "./public/og-templates/paper.png",
      fit: "cover",
    },
    logo: {
      path: "./public/og-templates/avatar.png",
      size: [128, 128],
    },
    padding: 72,
  }),
});
