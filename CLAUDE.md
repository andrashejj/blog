# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Andras Hejj's personal blog** using **Next.js 15 (Pages Router)** with **git-tracked MDX content**.

Content lives in:

- `content/posts/*.mdx` for blog posts
- `content/pages/about.mdx` and `content/pages/contact.mdx` for static pages

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Run lint + prettier checks |

## Architecture

### Pages Router routes

- `/` homepage
- `/blog` blog index
- `/blog/[year]/[month]/[slug]` post page
- `/about` static page
- `/contact` static page
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`

### Content pipeline

- `lib/content/posts.ts`: post discovery, frontmatter validation, sorting, route metadata
- `lib/content/markdown.ts`: MDX compile/serialize
- `lib/content/feed.ts`: RSS generation
- `lib/content/seo.ts`: SEO metadata helpers

### Layout/components

- `components/layout/SiteLayout.tsx`
- `components/blog/PostCard.tsx`
- `components/blog/PostMeta.tsx`
- `components/blog/MarkdownProse.tsx`

## Tech Stack

- **Framework**: Next.js 15.3.3 (Pages Router)
- **Language**: TypeScript
- **UI**: React 19.1.0
- **Content**: MDX (`next-mdx-remote`, `gray-matter`)
- **Package Manager**: pnpm
- **Deployment**: Vercel
