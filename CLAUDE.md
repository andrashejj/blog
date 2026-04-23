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

<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
