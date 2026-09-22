#!/usr/bin/env node
// Fails if two posts share a cover image, or if a cover file is missing.
// Every post gets its own cover: they show up side by side on the blog index,
// in cards, in the feed and as the OG image, and repeats make the list look broken.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const POSTS = "content/posts";
const PUBLIC = "public";

const covers = new Map(); // cover path -> [post, ...]
const missing = [];

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".mdx"))) {
  if (file.startsWith("_")) continue;
  const raw = readFileSync(join(POSTS, file), "utf8");
  const match = raw.match(/^coverImage:\s*["']?(.+?)["']?\s*$/m);
  if (!match) continue;

  const cover = match[1];
  if (!covers.has(cover)) covers.set(cover, []);
  covers.get(cover).push(file);

  if (cover.startsWith("/") && !existsSync(join(PUBLIC, cover))) {
    missing.push([file, cover]);
  }
}

const dupes = [...covers].filter(([, posts]) => posts.length > 1);

for (const [cover, posts] of dupes) {
  console.error(`✗ ${posts.length} posts share ${cover}`);
  for (const p of posts) console.error(`    ${p}`);
}
for (const [post, cover] of missing) {
  console.error(`✗ ${post} points at a cover that does not exist: ${cover}`);
}

if (dupes.length || missing.length) {
  console.error("\nGive each post its own cover image.");
  process.exit(1);
}

console.log(`✓ ${covers.size} posts, ${covers.size} distinct cover images`);
