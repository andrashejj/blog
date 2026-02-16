import { getAllPostMeta } from "../lib/content";
import { site } from "../lib/site";
import type { PostMeta } from "../lib/content";

export async function GET(context: { site: URL | undefined }) {
  const posts = await getAllPostMeta();
  const baseSite = String(context.site ?? site.url);

  const items = posts
    .map((post: PostMeta) => {
      const itemUrl = `${baseSite}${post.routePath}`;
      const categories = (post.tags || [])
        .map((tag: string) => `<category><![CDATA[${tag}]]></category>`)
        .join("");

      return [
        "<item>",
        `<title><![CDATA[${post.title}]]></title>`,
        `<description><![CDATA[${post.summary}]]></description>`,
        `<link>${itemUrl}</link>`,
        `<guid isPermaLink="true">${itemUrl}</guid>`,
        `<pubDate>${new Date(post.updated || post.date).toUTCString()}</pubDate>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    `<title><![CDATA[${site.title}]]></title>`,
    `<description><![CDATA[${site.description}]]></description>`,
    `<link>${baseSite}</link>`,
    `<language>en</language>`,
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `<copyright>© ${new Date().getUTCFullYear()} ${site.author}</copyright>`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
