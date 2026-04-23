import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { renderOG } from "../../lib/og";
import { site } from "../../lib/site";

interface PageEntry {
  slug: string;
  title: string;
  description: string;
  kicker?: string;
}

async function collectPages(): Promise<PageEntry[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  const pages: PageEntry[] = [
    {
      slug: "index",
      title: site.name,
      description: site.description,
      kicker: "The Dispatch",
    },
    {
      slug: "blog",
      title: "Blog",
      description: "A chronologically organized archive of articles.",
      kicker: "Archive",
    },
    {
      slug: "about",
      title: "About",
      description: site.description,
      kicker: "Colophon",
    },
    {
      slug: "subscribe",
      title: "Subscribe",
      description: `RSS feed for ${site.name}'s posts.`,
      kicker: "Subscribe",
    },
  ];

  for (const post of posts) {
    pages.push({
      slug: `blog/${post.data.slug}`,
      title: post.data.title,
      description: post.data.summary,
      kicker: "Dispatch",
    });
  }

  return pages;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await collectPages();
  return pages.map((page) => ({
    params: { route: `${page.slug}.png` },
    props: { page },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { page } = props as { page: PageEntry };
  const bytes = await renderOG({
    title: page.title,
    description: page.description,
    kicker: page.kicker,
  });
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
