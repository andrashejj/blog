# Design

Field notes from Andras Hejj. The site reads like a vintage atlas or letterpress ledger — paper-warm, hand-set, calmly opinionated — not a SaaS blog template.

## Aesthetic posture

- **Editorial, not product.** Long lines of measured prose, generous margins, dispatches rather than cards.
- **Paper over screen.** Warm cream background, ink-black type, terracotta as the single insistent accent.
- **Atlas / ledger details.** Corner ticks, dotted rules, monospaced eyebrows, stamps, drop caps. Used sparingly so they stay surprising.
- **Calm motion.** One orchestrated reveal on load, no scattered hover sparkle.

If a choice feels generically "AI default" (Inter, white background, purple gradient, soft drop shadow card grid) — reject it.

## Palette

Defined as CSS variables in [src/styles/global.css](src/styles/global.css#L5-L27).

| Token | Hex | Role |
|---|---|---|
| `--color-paper` | `#f1e6cf` | Page background — warm cream |
| `--color-paper-deep` | `#e8d9b8` | Footer / inset surfaces |
| `--color-surface` | `#fbf4e2` | Cards, embeds |
| `--color-ink` | `#1b1713` | Primary text |
| `--color-ink-soft` | `#3b332b` | Secondary text |
| `--color-muted` | `#6f5f4f` | Eyebrows, metadata |
| `--color-rule` | `#c8b694` | Borders, dotted rules |
| `--color-terracotta` | `#bf4024` | Accent — links, marks, the one loud color |
| `--color-terracotta-strong` | `#8f2c18` | Hover / weighted accent |
| `--color-pine` / `--color-pine-soft` | `#0e4140` / `#1b5f5c` | Atmospheric depth in background gradients |
| `--color-ochre` | `#c4892d` | Atmospheric warm wash |
| `--color-ocean` | `#1a2940` | Reserved cool accent |

Rule of thumb: ink + paper carry the page. Terracotta is the only color that talks. Pine and ochre live in the radial-gradient atmosphere of `body`, never on type.

## Typography

Three faces, each with a job. No fourth font.

- **Fraunces** — `--font-display`. Headings, the `A·H` mark, occasional flourish. Use variable axes: `SOFT 50–100`, `WONK 0–1`, `opsz 72–144`. Higher SOFT + WONK = more editorial swagger; reserve for h1 and the wordmark.
- **Newsreader** — `--font-sans` (despite the name). Body copy, navigation when it needs warmth. Optical sizing on; line-height 1.65 in body.
- **JetBrains Mono** — `--font-mono`. Eyebrows, stamps, nav, footer meta. Always uppercase, letter-spacing `0.2em+`, size `0.65–0.72rem`. Mono is for *labels*, never paragraphs.

Never reach for Inter, Roboto, Arial, or system-ui. If a new role appears, find it inside the existing three.

## Components & motifs

Defined in `@layer components` of [src/styles/global.css](src/styles/global.css#L117-L205).

- **`.eyebrow`** — mono uppercase tracker label, muted color. Use above headings, on metadata.
- **`.rule-horizontal`** / `<hr>` — dotted 6px-on/4px-off repeating rule. Replaces solid dividers.
- **`.card`** — surface + 1px rule + soft card shadow. Square-ish radius (10px). No floating glassmorphism.
- **`.card-ticks`** — adds four corner ticks (atlas registration marks). Use on featured items, not every card.
- **`.stamp`** — pill with currentColor border, mono uppercase. For tags and status chips.
- **Editorial link underline** — `main a` gets a 1px terracotta bar that thickens to 2px on hover. Opt out with `.no-rule` on chrome links (nav, logo, cards). This is the site's signature interaction; preserve it.
- **Drop cap** — `.prose > p:first-of-type::first-letter` renders Fraunces at 4.25em in terracotta. Long-form posts only.

## Background atmosphere

`body` layers three radial gradients (ochre top-right, pine bottom-left, faint terracotta center) over a fixed SVG fractal-noise grain. Do not replace with a flat color. If a section needs to feel distinct, layer one more low-opacity gradient — don't paint over the paper.

## Motion

- **Page load.** `.reveal` + `.reveal-1…6` stagger header → main → meta → body in ~440ms windows. One orchestrated cascade, not per-element fade-ins.
- **`.mark-draw`** — a terracotta highlighter bar grows under a phrase 600ms after load. Use once per page at most.
- **Hover.** Editorial underline thickens; image covers scale 1.04 over 700ms. That's the vocabulary.
- **Reduced motion.** `prefers-reduced-motion` disables all of the above and lands the final state. Any new animation must include this fallback.

## Voice the design supports

The copy speaks as "field notes" / "dispatches" from a person based in Budapest · Zürich · Mauritius. Design choices reinforce that frame: dispatch labels on post cards, "Field Notes" in the wordmark, mono coordinates in the footer. New surfaces should pick a similar editorial noun ("ledger," "log," "register," "index") rather than product nouns ("dashboard," "feed").

## Adding something new

Before introducing a new color, font, radius, or shadow: check whether an existing token covers it. The constraint is the design. If a real new role exists, add the token in `@theme` and document its role here.
