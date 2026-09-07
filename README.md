# Where To Go — site build

Working copy of wheretogolondon.co.uk, assembled from Claude chat outputs on 7 Sept 2026.

## Structure
- `index.html`, `about.html`, `activities.html` — top-level pages
- `activity/<brand>/<site>/index.html` — venue pages (15 of 19 live venues; see below)
- `site.css` — the live design system stylesheet, linked by every page

## Known gaps — read before deploying

1. **No images, favicons, or `saul.png`.** These are referenced (`/img/*.jpg`, `/favicon*.png`, `/saul.png`) but the binary files aren't in this repo — I only had HTML to work from, not the asset files. **Deploying this repo via `wrangler pages deploy .` as-is will delete those assets from production**, per the photo-wiping incident already on record. Pull the real asset files from the current live deployment or the `site-mirror.zip` before any deploy.

2. **Missing `_redirects`.** The old flat `.html` → `/activity/...` redirect rules aren't in this repo either, for the same reason. Needed before this can safely replace what's live.

3. **Four venues from the live 19 aren't in this repo**: Electric Shuffle (London Bridge), Bounce (Farringdon), Plonk (Borough Market), and Sixes Cricket (Fitzrovia, confirmed closed, not yet redirected). Only venues that have been through a chat research session are here.

4. **Inconsistent head tags on 7 older pages** (all-star-lanes, bounce-battersea, clays-soho, flight-club-shoreditch, hijingo, oche, puttshack): missing favicon `<link>` tags, and flight-club-shoreditch is additionally missing OG tags, canonical URL, and Twitter card meta. These pages predate the standard head template used on newer pages. Not fixed here — flagging for a deliberate pass rather than guessing at OG copy.

5. **This repo has no git history and no deploy connection.** It's a clean starting point, not yet wired to Cloudflare Pages.
