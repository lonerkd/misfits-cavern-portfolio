# Project Handoff — Misfits Cavern Portfolio

> Written after reconciling the local repo with the live Vercel deployment.
> Intended for the next developer/agent taking over this project.
> Last updated: 2026-09-20

---

## 1. What this project is

A single-page portfolio for **Peter Olowude** — Video Editor & Filmmaker, Calgary, AB.
Brand: **Misfits Cavern**. Dark, cinematic, film-chrome aesthetic.

- One page, no router. Everything is `src/App.jsx` with inline styles.
- Video content is embedded via **YouTube** (source of truth). Thumbnails + embeds are
  public-domain YouTube URLs, which is why they were chosen over Google Drive links
  (Drive links 403 when sharing settings change).

## 2. Live deployment (Vercel)

| Item | Value |
|---|---|
| Production URL | `https://msfts-portfolio.vercel.app` |
| Preview URL (noisy) | `misfits-cavern-portfolio-p1vxu2np1-peters-projects-4575517e.vercel.app` |
| Status | Ready |
| Created | Aug 11, by `lonerkd` |
| Git source | `github/lonerkd` → branch `main` |
| Deploy trigger | **Auto-deploys on push to `main`** (no manual step needed) |

## 3. Git / remote

- Remote: `https://github.com/lonerkd/misfits-cavern-portfolio.git`
- Branch of truth: `main`
- HEAD currently == `origin/main` (fully synced).
- Tag `pre-reconcile-c90d120` points at the pre-cleanup local commit `c90d120`
  (safety snapshot — contains the squashed local history + dead root `App.jsx`).

### Remote branches
- `origin/main` — canonical (live).
- `origin/vercel/install-vercel-web-analytics-bz1bs4` — unmerged PR #1 that adds
  Vercel Web Analytics (adds `@vercel/analytics` dep + an `<Analytics/>` mount).

## 4. Tech stack & tooling

| Area | Details |
|---|---|
| Bundler | Vite `5.4.21` (`vite.config.js` uses `@vitejs/plugin-react`) |
| UI | React `18.3.1` + `react-dom` `18.3.1` |
| Icons | `lucide-react` `0.400.0` |
| Style | CSS custom properties in `src/tokens.css` (no CSS framework) |
| Fonts | Google Fonts: Bebas Neue (display), DM Mono (mono), Cormorant Garamond (serif) — loaded in `index.html` |
| Package manager | npm (Node `v24.12.0`, npm `11.6.2` on the dev machine) |

### Commands
```bash
npm install     # deps (node_modules is gitignored)
npm run dev     # Vite dev server
npm run build   # production build → dist/ (~195.75 kB JS, 63.28 kB gzip)
npm run preview # serve the built dist/ locally
```

## 5. Source layout

```
index.html                 # HTML shell, meta/OG tags, Google Fonts
vite.config.js             # Vite config (react plugin only)
package.json / package-lock.json
public/misfits-mark.svg    # logo mark
.gitignore                 # node_modules, dist, .DS_Store  (REQUIRED — see §7)
src/
  main.jsx                 # React root render
  App.jsx                  # entire page (hero, bento work grid, writing, contact)
  content.js               # ★ EDIT HERE FOR CONTENT — videos, credits, writing,
                           #   skills, facts, email, socials (NOT in components)
  media.js                 # URL helpers: thumbnails, embeds, watch, colour extraction
  CinematicNav.jsx         # Apple-style scroll puck (tap=next frame, hold=fast scroll)
  CustomCursor.jsx         # contextual cursor (dot + ring + labels, fine-pointer only)
  DotField.jsx             # canvas dot-grid background w/ hover colour bloom
  StarField.jsx            # "Photos" gallery overlay (Google Drive stills) + starfield
  tokens.css               # design tokens + global styles + keyframes
```

## 6. Key architectural decisions / gotchas

1. **Content lives in `src/content.js` only.** Add/edit videos, credits, skills, socials
   there; components read from it. YouTube video IDs (`yt`) are the source of truth.
2. **Thumbnail double-fallback** (`src/media.js` + `Thumb` in `App.jsx`):
   `maxresdefault.jpg` → falls back to `hqdefault.jpg` (maxres 404s on some uploads).
3. **Colour extraction is best-effort**: `extractColor()` pulls average colour off the
   thumbnail canvas; YouTube thumbnails don't always send CORS headers, which taints the
   canvas — so callers fall back to per-category tints (`CAT_TINT` in `media.js`).
4. **Gallery stills are Google Drive file IDs** (hardcoded in `src/StarField.jsx`).
   These are NOT the YouTube-first path; if any gallery image breaks, it's a Drive
   permission issue, not a code issue.
5. **Reduced-motion / touch are respected**: `CustomCursor` disables on
   `(hover:hover) and (pointer:fine)` only and on prefers-reduced-motion; `DotField`
   drops the rAF loop under reduced motion; `.mc-puck` is hidden under 900px.
6. **`node_modules` and `dist` MUST stay gitignored** (see §7 — this repo previously
   had them committed, 5,559 bloat files, since removed).

## 7. Repo hygiene (recently fixed — do not regress)

- `node_modules/` and `dist/` are **gitignored**. Do NOT `git add node_modules` or
  `git add dist`.
- If you run `npm install`, it creates `package-lock.json` — that IS tracked and fine.
- The old dead-root `App.jsx` (Drive-based `VModal` player) was **deleted**. Do not
  reintroduce; the live player is `VideoOverlay` in `src/App.jsx`.

## 8. Known issues / open items

1. **Analytics: code installed, dashboard toggle may still be off.** `@vercel/analytics`
   is mounted (`<Analytics />` at the end of `App`), so `/_vercel/insights/script.js`
   is served. Data only flows once Web Analytics is enabled in the Vercel dashboard
   (before that the API returns "Web Analytics not found"). PR #1
   (`vercel/install-vercel-web-analytics-bz1bs4`) is **superseded** — it targets the
   deleted root `App.jsx`; close it.
2. **`npm audit`: 2 vulnerabilities** (1 moderate `esbuild <=0.24.2`, 1 high
   `vite <=6.4.2`). Both are **dev-server-only** (esbuild/vite are devDependencies);
   the high one includes Windows-specific paths (N/A on macOS). Fix path = deliberate
   upgrade to vite 8 (major), not `--force`. No production exposure.
3. **DM button label** is cosmetic (`DM Me` vs `DM ME`) — user said it's irrelevant.
4. No CI/CD config in-repo (deploy is Vercel auto-build on `main` push). No tests,
   lint, or format tooling configured. No ESLint/Prettier configs.

### Recent changes (2026-09-21)
- Design pass: brighter `--fg-*` tokens and larger micro-labels; work filter chips
  (`FILTERS` in `App.jsx`); card tilt (`CAN_TILT`, fine-pointer + no reduced-motion only);
  animated `.film-chrome` corners; nav active-section state and a Writing link; Work/Writing
  nav links hidden under 720px so the nav fits phones; favicon.
- `content.js` credits synced to the CV (CV is the source of truth for roles/years;
  The Briefcase stays "Lead Actor · DP · Editor").

## 9. Working conventions observed in this codebase

- Inline styles (no CSS-in-JS lib, no styled-components); classNames only for global
  tokens/keyframes in `tokens.css`.
- Naming: design tokens use CSS custom properties (`--bg`, `--fg`, `--accent`, etc.).
- Components in `App.jsx` are local functions (`VCard`, `VideoOverlay`, `Reveal`, …);
  only `CustomCursor`, `DotField`, `StarField`, `CinematicNav` are separate files.
- JSX comments use `/* ─── section ─── */` and `═══` dividers.
- Accessibility: `aria-label`, `aria-hidden`, `role="dialog"`, `aria-modal`, focus-visible
  outline, `prefers-reduced-motion`.

## 10. Contact / owner

- Email (site): `peterolowude@icloud.com`
- Socials (in `content.js`): Instagram `lonerkid`, YouTube `@lonerkid`,
  Twitch `lonerfs`, X `lonerfss`, LinkedIn `peterolowude`.
- Git author identity on remote: `Peter Olowude <Kingsavyt@gmail.com>`

