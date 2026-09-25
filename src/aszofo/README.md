# Aszófő

Booking requests for the press house above Aszófő. It lives inside the blog for
now but shares nothing with it: its own layout, fonts, CSS and data. To split
it out, move `src/aszofo/`, `src/pages/aszofo/`, `public/aszofo/` and
`scripts/aszofo-images.mjs`, then change `BASE_PATH` in `config.ts`.

## Pages

| Route | What | Rendering |
|---|---|---|
| `/aszofo`, `/aszofo/hu`, `/aszofo/de` | Public page with the calendar and request form. The English root sends first-time visitors to their browser language. | Static |
| `/aszofo/stay/<token>` | The guest's private page. Status while pending; directions, house notes and picked places once approved. Closes `accessGraceDays` after check-out. | Server |
| `/aszofo/admin` | Host dashboard: approve or decline, block dates, private house details. | Server |
| `/aszofo/api/*` | Availability, requests, host actions. | Server |

## How a request moves

1. A guest picks dates (confirmed stays and blocks are greyed out), fills in
   the form and, optionally, who's coming and what they like.
2. The request is saved as `pending`. The guest gets a receipt with a link to
   their page; the host gets the details and a link to the dashboard.
3. The host approves (optionally with a note, e.g. the price) or declines.
   Approval emails the guest their page link in their language.
4. Door details, Wi‑Fi and the host phone appear on the guest page
   `revealDaysBefore` days before arrival. After check-out plus
   `accessGraceDays`, the page shows only a thank-you.
5. Declined and cancelled requests are deleted after `keepClosedDays`; past
   stays after `keepPastDays`.

## Setup

Set these in Vercel (see `.env.example`):

- `KV_REST_API_URL`, `KV_REST_API_TOKEN`: add Upstash Redis from the Vercel
  Marketplace and it sets both. Without them, local dev uses
  `.data/aszofo-dev.json`.
- `ASZOFO_SECRET`: a long random string for signing the host session.
- `RESEND_API_KEY` and `ASZOFO_EMAIL_FROM`: a Resend key and a sender on a
  domain verified there. Without email, the dashboard shows guest links to copy.
- Optional: `ASZOFO_ADMIN_EMAIL` (defaults to `andras@hejj.xyz`),
  `ASZOFO_ADMIN_PASSWORD` (sign-in fallback), `ASZOFO_BASE_URL`.

Sign in at `/aszofo/admin` with the host address; a one-time link arrives by
email. In `pnpm dev` without Resend, the link is shown on the page.

## Editing

- House rules, capacity, times, minimum stay: `config.ts`.
- All page and email text in three languages: `i18n.ts`. English is the
  reference; TypeScript fails if Hungarian or German miss a key.
- Directions, house manual, check-out list, distances: `content.ts`.
- Restaurants, cellars, sights, events: `data/places.json`. Each entry was
  checked against an official source in September 2026. Opening hours drift;
  events carry `dates` for the years we know, and events without dates for the
  guest's year are shown as "dates change yearly" and never picked.
- Photos: `node scripts/aszofo-images.mjs` crops and grades the originals from
  the Balaton cottage posts into `public/aszofo/img/`.
- Private details (address, door code, Wi‑Fi, phone): the dashboard's "House
  details for guests" form. They're stored in Redis, never in the repo.
