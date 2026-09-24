# AGENTS.md

Architecture notes for developers and AI agents working on this codebase. See
`README.md` for what the site is and how to run it.

## Project overview

A wedding website with three surfaces: an information page, a Netlify Forms sign-up
for the Friday night event, and a canvas pong game whose paddles are guest pictures.
The whole request is built — there is no PLAN.md and no staged milestones.

### Tech stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (file-based routing) |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (`@theme` tokens) + custom classes in `src/styles.css` |
| Forms | Netlify Forms |
| Images | Netlify Image CDN |
| Language | TypeScript 5.9, strict mode |
| Deployment | Netlify |

## Directory structure

```
├── public
│   ├── friday-rsvp.html          # Static form skeleton — see "Netlify Forms" below. Not user-facing.
│   └── img
│       ├── hero-venue.png        # Home page hero illustration
│       ├── friday-supper.png     # Friday night scene, used on / and /friday
│       └── players/player-{1..4}.png  # The pong pictures. Overwrite these to swap in real photos.
├── scripts
│   └── generate-images.mjs       # One-off image generation via Netlify AI Gateway (`pnpm images`)
├── src
│   ├── components
│   │   ├── Countdown.tsx         # Live countdown to wedding.startsAt
│   │   └── PongGame.tsx          # The canvas game: loop, physics, rendering, scoreboard, overlays
│   ├── content
│   │   ├── wedding.ts            # ALL wedding copy and details. Single source of truth.
│   │   └── players.ts            # The pong pictures + Image CDN URL helpers
│   ├── routes
│   │   ├── __root.tsx            # Shell: meta, Google Fonts, sticky nav, footer
│   │   ├── index.tsx             # Wedding information page
│   │   ├── friday.tsx            # Friday night sign-up form
│   │   └── pong.tsx              # Picture picker + difficulty, then mounts PongGame
│   ├── router.tsx
│   └── styles.css                # Design tokens, type, buttons, fields, motion
├── netlify.toml
└── tsconfig.json                 # `@/*` → `./src/*`
```

## Key concepts

### Content lives in `src/content/`, not in components

Every name, date, paragraph and list item comes from `wedding.ts` or `players.ts`.
The route components contain layout only. **When asked to change wording or details,
edit the content file** — do not inline strings into the JSX. Both files carry
comment headers explaining this to whoever opens them next.

All values currently in `wedding.ts` are deliberate placeholders awaiting the real
details.

### Netlify Forms (non-obvious, easy to break)

Netlify registers forms by scanning **static HTML at build time**, and it cannot see
React-rendered markup. Two things therefore must stay in sync:

1. `public/friday-rsvp.html` — a hidden skeleton form named `friday-supper` listing
   every field. This is what Netlify actually registers, including the
   `netlify-honeypot="bot-field"` config.
2. The React form in `src/routes/friday.tsx`, which POSTs url-encoded data to
   `/friday-rsvp.html`.

**If you add a field to the form, add it to the skeleton too** or Netlify will reject
the submission. The POST target must be the skeleton path, never `/` — in an SSR app
`/` is swallowed by the server function and never reaches the forms handler. The
`netlify-honeypot` attribute is intentionally absent from the JSX (it isn't a valid
React attribute); the skeleton carries it instead.

Forms were activated for this site via the `netlify-forms` skill's `enable.cjs`. If
form handling ever appears to be off on deploy, re-run that script.

### Images

Source PNGs in `public/img/` are full-resolution (1–2 MB each) and are **never
referenced directly**. Everything goes through Netlify Image CDN, e.g.
`/.netlify/images?url=/img/hero-venue.png&w=1800&fm=webp&q=78`. `players.ts` exports
`courtImage()` and `cardImage()` helpers for the two sizes the game needs — use them
rather than building URLs by hand.

### The pong game

`PongGame.tsx` runs a fixed logical court (900×560) and scales the canvas to its
container, so all physics maths is resolution-independent. Mutable game state lives
in refs and only score/phase go through React state — do not move the ball or paddle
positions into `useState` or the loop will re-render every frame.

Paddles are circles, and the ball reflects along the paddle-centre→ball normal, which
is what gives edge hits their angle. `bounce()` deliberately forces a minimum
horizontal velocity: without it a glancing edge hit leaves the ball crawling
vertically and the rally stalls.

`phase` is `ready | playing | paused | over`; overlays render on top of the canvas for
everything except `playing`. The picker in `pong.tsx` swaps the two selections when a
taken picture is chosen, so both sides can never be the same image.

## Conventions

- Components PascalCase, content/utilities camelCase, route files kebab-case.
- Imports use the `@/` alias.
- Styling is Tailwind utilities, with shared patterns (`.btn`, `.field`, `.display`,
  `.eyebrow`, `.rise`) as plain classes in `styles.css`. Colours come from the
  `@theme` block — use `ink`/`paper`/`oat`/`olive`/`terracotta`/`gold`, don't
  introduce new hex values.
- Type is Fraunces (display, variable — `font-variation-settings` is used to tune
  SOFT/WONK per use) and Karla (body).
- `tsconfig.json` sets `noUnusedLocals` and `noUnusedParameters`; unused imports fail
  the build.
- Motion respects `prefers-reduced-motion`, handled centrally in `styles.css`.

## Environment

No environment variables are needed to build or run the site. `scripts/generate-images.mjs`
uses `NETLIFY_AI_GATEWAY_KEY` and `NETLIFY_AI_GATEWAY_BASE_URL`, which Netlify injects
automatically; it is a one-off asset script, not part of the app.
