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

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    fonts: [
      "./public/fonts/Inter-SemiBold.ttf",
      "./public/fonts/Inter-Regular.ttf",
    ],
    font: {
      title: {
        families: ["Inter"],
        weight: "SemiBold",
        size: 64,
        color: [255, 255, 255],
      },
      description: {
        families: ["Inter"],
        weight: "Normal",
        size: 32,
        color: [200, 210, 230],
      },
    },
    bgGradient: [
      [30, 58, 138],
      [147, 197, 253],
    ],
    border: {
      color: [37, 99, 235],
      width: 8,
      side: "block-end",
    },
    logo: {
      path: "./public/images/posts/andras.png",
      size: [80],
    },
    padding: 60,
  }),
});
