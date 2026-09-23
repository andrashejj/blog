# CLAUDE.md

Guidance for coding agents (Claude Code, Codex, etc.) working in this repository. `AGENTS.md` is a symlink to this file.

## Project Overview

Andras Hejj's personal blog (www.andrashejj.com). Astro 7 + MDX, content collections, deployed to Vercel. Output is `static`; the only on-demand routes are the `src/pages/api/*` endpoints (`export const prerender = false`), which run as Vercel functions.

Content lives in:

- `content/posts/*.mdx` — blog posts (files starting with `_`, e.g. `_template.mdx`, are ignored)
- `content/pages/*.mdx` — static pages (`about.mdx`)

Other reference docs: `design.md` (visual system), `style.md` (writing voice), `docs/writing-posts.md` (frontmatter, drafts, images).

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Astro dev server (port 4321) |
| `pnpm build` | Production build |
| `pnpm preview` | Preview the built site |
| `pnpm check` | Biome lint/format check + cover-image check |
| `pnpm check:covers` | Fail if a post's `coverImage` is missing or shared with another post |
| `pnpm format` | Biome format-write |
| `pnpm thumbs` | Regenerate board-project WebP thumbnails (output is committed) |
| `pnpm deploy` | `vercel deploy` |

One-off scripts in `scripts/`: `generate-og-background.mjs` / `generate-og-avatar.mjs` (rebake `public/og-templates/*.png`), `generate-pdf.mjs` (Puppeteer PDF of the Noah worksheet).

## Environment

- `GEMINI_API_KEY` — required by the `/api/*` generators (`src/lib/gemini.ts`)
- `GEMINI_SURF_MODEL` — optional model override for `generate-surf-exercises`

## Architecture

### Routes (`src/pages/`)

- `index.astro` — homepage
- `blog/index.astro` — archive (grouped/filterable by `series`)
- `blog/[slug].astro` — canonical post page
- `blog/[year]/[month]/[slug].ts` — 301 from legacy dated URLs to `/blog/[slug]` (also mirrored in `vercel.json` redirects)
- `about.astro`, `subscribe.astro`, `404.astro`
- `rss.xml.ts`; `feed.ts` redirects to `/rss.xml`
- `sitemap.xml.ts` plus `@astrojs/sitemap` (`sitemap-index.xml`); `vercel.json` redirects `/sitemap.xml` to the index
- `og/[...route].ts` — OG images, rendered with CanvasKit by `src/lib/og.ts` on top of `public/og-templates/paper.png`
- `api/*.ts` — Gemini-powered endpoints: `generate-{challenges,math-exercises,physical-exercises,sketches,words}` (Noah worksheet), `generate-surf-exercises` (surf coaching), `tamarin-plan` (Tamarin day-trip planner)

### Content pipeline

- `src/content.config.ts` — collections (`posts`, `pages`) via `glob` loader. Post frontmatter: required `title`, `date` (`YYYY-MM-DD`), `slug`, `summary`, `coverImage`; optional `draft`, `wide`, `tags`, `series`, `updated`, `readingTime`, `canonicalUrl`
- `src/lib/content.ts` — post helpers (sorting, route metadata)
- `src/lib/site.ts` — site constants, `seriesRegistry` (valid `series` ids), `staticPages`
- `src/lib/seo.ts` — SEO metadata helpers
- `src/lib/og.ts` — custom OG card renderer
- `src/lib/gemini.ts` — Gemini client for the API endpoints
- Interactive post data: `exercise-collection-data`, `noah-worksheet{,-client}`, `surf-{exercises,skills}`, `tamarin-{activities,map,map-locations}` (all `src/lib/*.ts`; the Tamarin map uses Leaflet)

### Layouts & components

- `src/layouts/SiteLayout.astro`
- `src/components/{PostCard,PostMeta}.astro`
- Interactive embeds: `src/components/{NoahWorksheet,SurfCoachingPlan,ExerciseCollection,TamarinGuide}.astro`
- `src/components/mdx/{Callout,ClipGrid,CTA,Divider,Highlight,ImageFloat,ImageGrid,Quote}.astro` — components usable inside MDX posts

### Styling & markdown

- Tailwind CSS v4 via `@tailwindcss/vite`; theme tokens live in `@theme` in `src/styles/global.css` (not `tailwind.config.mjs`)
- Markdown: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` (append)

## Tech Stack

- Framework: Astro 7 (`@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/vercel` with Web Analytics)
- Styling: Tailwind CSS v4 + `@tailwindcss/typography`
- AI: `@google/genai` (Gemini)
- Lint/format: Biome
- Package manager: pnpm
- Deployment: Vercel

<writing_voice>
This applies to all blog post prose in `content/posts/*.mdx` and `content/pages/*.mdx`. The long-form voice guide (scene-first structure, review pass, endings) is `style.md`; frontmatter and image conventions are in `docs/writing-posts.md`.

## Voice

Be direct. Have opinions. Use specific examples and names, not vague claims. State the point first, then support it. Trust the reader to recognise what matters without labelling it as "significant" or "important."

## Banned words

Never use: delve, dive into, navigate (figurative), underscore, bolster, foster, harness, leverage, unpack, shed light on, pave the way, pivotal, groundbreaking, cutting-edge, transformative, game-changing, innovative, robust, comprehensive, seamless, intricate, nuanced (as empty praise), vibrant, multifaceted, holistic, testament, landscape (figurative), realm.

## Banned phrases

- "In today's [fast-paced/rapidly evolving/digital] world..."
- "It's important/worth noting that..."
- "One of the most [important/significant/crucial]..."
- "When it comes to..." / "At its core..." / "At the end of the day..."
- "This is where X comes in" / "Let's break it down"
- "Plays a crucial role in..." / "It cannot be overstated..."
- "...underscoring the importance of..." / "...highlighting the need for..."
- "...reflecting a broader trend toward..." / "...marking a significant shift in..."

## Banned structures

- "It's not just X — it's Y"
- "Not only X, but Y"
- "This isn't about X. It's about Y."
- "No X. No Y. Just Z."

These mimic insight without providing any.

## Structure rules

- Vary paragraph and sentence length. Don't write uniform blocks.
- Never use the "Bold term: explanation sentence" list format. It's the single most recognisable AI pattern.
- Don't signpost ("Let's explore," "Now let's turn to"). Make the point.
- Don't open with a sweeping contextual statement. Don't close with a summary or inspirational wrap-up. Start and end on substance.
- Don't restate the question back before answering it.

## Style rules

- Use contractions. "It's," "don't," "won't."
- Maximum one em dash per post. Use commas or parentheses instead.
- Don't over-format. Plain prose is often clearer than headers and bullet points.
- Drop preamble ("Great question!"), performative enthusiasm ("exciting," "incredible," "powerful"), and unsolicited caveats.
- Match tone to context. Casual post, casual tone.

## Before finishing, check

1. Read it out loud. Does any sentence sound like a press release? Rewrite it.
2. Are you repeating the same point in different words? Say it once.
3. Does the opening sentence set the scene with a grand statement about the state of the world? Delete it, start with the second sentence.
</writing_voice>

<frontend_aesthetics>
The site has an established look, documented in `design.md`: vintage atlas / letterpress ledger, warm paper background, ink type, terracotta as the single accent, Fraunces/Newsreader/JetBrains Mono. New pages and interactive embeds should extend that system, not introduce a new one. Palette tokens are CSS variables in `src/styles/global.css`.

Within that system, avoid generic "AI slop": no Inter/Roboto/system-font defaults, no purple gradients, no soft-shadow card grids, no scattered hover sparkle. Prefer one orchestrated load reveal and CSS-only motion. Read "Adding something new" in `design.md` before building a new component.
</frontend_aesthetics>
