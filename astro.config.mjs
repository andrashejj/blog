import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export default defineConfig({
  site: "https://www.andrashejj.com",
  output: "static",
  compressHTML: true,
  adapter: vercel({
    webAnalytics: { enabled: true },
    maxDuration: 30,
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    // The Aszófő pages carry their own branding and stay out of the blog's
    // sitemap until they move to their own domain.
    sitemap({ filter: (page) => !page.includes("/aszofo") }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "append" }],
      ],
    }),
  },
});
