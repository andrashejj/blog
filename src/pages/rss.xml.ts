import { getAllPostMeta } from "../lib/content";
import type { PostMeta } from "../lib/content";
import { site } from "../lib/site";

const FEED_PATH = "/rss.xml";
const MAX_ITEMS = 30;

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return char;
    }
  });
}

export async function GET(context: { site: URL | undefined }) {
  const posts = (await getAllPostMeta()).slice(0, MAX_ITEMS);
  const baseSite = String(context.site ?? site.url).replace(/\/$/, "");
  const feedUrl = `${baseSite}${FEED_PATH}`;

  const latestPostDate = posts[0]
    ? new Date(posts[0].updated || posts[0].date)
    : new Date();

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
        `<link>${escapeXml(itemUrl)}</link>`,
        `<guid isPermaLink="true">${escapeXml(itemUrl)}</guid>`,
        `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `<dc:creator><![CDATA[${site.author}]]></dc:creator>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "<channel>",
    `<title><![CDATA[${site.title}]]></title>`,
    `<description><![CDATA[${site.description}]]></description>`,
    `<link>${escapeXml(baseSite)}</link>`,
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    "<language>en</language>",
    `<lastBuildDate>${latestPostDate.toUTCString()}</lastBuildDate>`,
    `<managingEditor>${escapeXml(site.email)} (${escapeXml(site.author)})</managingEditor>`,
    `<webMaster>${escapeXml(site.email)} (${escapeXml(site.author)})</webMaster>`,
    `<copyright>© ${new Date().getUTCFullYear()} ${escapeXml(site.author)}</copyright>`,
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
