# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Andras Hejj's personal blog. Astro 5 + MDX, content collections, deployed static to Vercel.

Content lives in:

- `content/posts/*.mdx` — blog posts (loaded via `src/content.config.ts`)
- `content/pages/*.mdx` — static pages

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Astro dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview the built site |
| `pnpm check` | Biome lint/format check |
| `pnpm format` | Biome format-write |
| `pnpm deploy` | `vercel deploy` |

## Architecture

### Routes (`src/pages/`)

- `index.astro` — homepage
- `blog/index.astro` — blog index
- `blog/[slug].astro` — canonical post page
- `blog/[year]/[month]/[slug].ts` — dated URL redirect/handler
- `about.astro`, `subscribe.astro`, `404.astro`
- `feed.ts`, `rss.xml.ts`, `sitemap.xml.ts`
- `og/[...route].ts` — OG image generation (`astro-og-canvas`)
- `api/*.ts` — server endpoints (Gemini-powered exercise/sketch/word generators for the Noah and surf-coaching worksheets)

### Content pipeline

- `src/content.config.ts` — Astro content collections (`posts`, `pages`) with Zod frontmatter schema
- `src/lib/content.ts` — post helpers (sorting, route metadata)
- `src/lib/seo.ts` — SEO metadata helpers
- `src/lib/site.ts` — site constants
- `src/lib/gemini.ts` — Gemini client for the AI endpoints
- `src/lib/{exercise-collection-data,noah-worksheet,noah-worksheet-client,surf-exercises,surf-skills}.ts` — interactive worksheet data

### Layouts & components

- `src/layouts/SiteLayout.astro`
- `src/components/{PostCard,PostMeta,NoahWorksheet,SurfCoachingPlan,ExerciseCollection}.astro`
- `src/components/mdx/{Callout,Divider,Highlight,Quote,CTA,ImageFloat,ImageGrid}.astro` — components usable inside MDX posts

### Markdown plugins

- `remark-gfm`
- `rehype-slug`
- `rehype-autolink-headings` (append behaviour)

## Tech Stack

- Framework: Astro 5
- Content: MDX via `@astrojs/mdx`
- Styling: Tailwind CSS v4 (`@tailwindcss/vite`)
- AI: `@google/genai` (Gemini) for the worksheet endpoints
- Package manager: pnpm
- Deployment: Vercel (`@astrojs/vercel`, static output)

<writing_voice>
This applies to all blog post prose in `content/posts/*.mdx` and `content/pages/*.mdx`.

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
