import { getAllPostMeta } from "../lib/content";
import { site, staticPages } from "../lib/site";
import type { PostMeta } from "../lib/content";

function buildSitemapXml(
  entries: Array<{ url: string; priority: number; lastmod: string }>,
) {
  const urls = entries
    .map(
      (entry) =>
        `<url>\n  <loc>${entry.url}</loc>\n  <lastmod>${entry.lastmod}</lastmod>\n  <priority>${entry.priority.toFixed(1)}</priority>\n</url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export async function GET() {
  const posts = await getAllPostMeta();

  const entries = [
    ...staticPages.map((page) => ({
      url: `${site.url}${page.path}`,
      priority: page.priority,
      lastmod: new Date().toISOString(),
    })),
    ...posts.map((post: PostMeta) => ({
      url: `${site.url}${post.routePath}`,
      priority: 0.7,
      lastmod: new Date(post.updated || post.date).toISOString(),
    })),
  ];

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
