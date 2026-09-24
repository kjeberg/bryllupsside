# Rosa & Ellis — Wedding Site

A three-part wedding website: the information page, a sign-up form for the Friday
night welcome supper, and a pong game played with guest pictures.

## What's on it

| Route     | What it is |
|-----------|------------|
| `/`       | The wedding information page — hero, live countdown, the long-form "about the wedding" text, Saturday running order, travel/accommodation/presents, and an FAQ. |
| `/friday` | Sign-up for **The Welcome Supper** on the Friday night. Collects name, email, whether they're coming, party size, guest names, dietary needs, arrival time and a note. Submissions go to **Netlify Forms**. |
| `/pong`   | **Guest·Pong** — pick which picture you play as, pick its opponent, choose a difficulty, then play. Both paddles are the pictures themselves. |

## Editing the content

Almost nothing is hard-coded in the pages. Two files hold everything:

- **`src/content/wedding.ts`** — names, date, venue, all the body copy, the Saturday
  schedule, the Friday event details, travel notes and FAQ. Every value in it is a
  tasteful placeholder right now. Change them here and the whole site updates.
- **`src/content/players.ts`** — the four pong pictures. To use real photos, either
  overwrite the matching file in `public/img/players/` or point `src` at a new file,
  then edit the `name` and `blurb`. Square, head-and-shoulders images work best —
  the game crops each into a circle roughly 90px across. Add or remove entries
  freely; the picker and the game adapt to the list length.

Contact email (`hello@example.com`) is a placeholder too — it appears in the footer
and in the form's error message.

## Tech

- **TanStack Start** (React 19, TanStack Router, file-based routing)
- **Vite 7** and **Tailwind CSS 4**
- **Netlify Forms** for the Friday sign-ups — no backend to run
- **Netlify Image CDN** for all imagery, so pages ship small WebP rather than the
  full-resolution source files
- **TypeScript**, strict mode, `@/*` path alias for `src/*`

## Running it locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

To exercise the Netlify platform features (Forms, Image CDN) locally, use the CLI
instead — the Image CDN URLs won't resolve under a plain Vite dev server:

```bash
netlify dev
```

Note that **form submissions only work on a real deploy**, not in local dev. Test the
Friday sign-up on a deploy preview; submissions then appear under **Forms** in the
Netlify dashboard for the site.

## Regenerating the illustrations

The hero, the Friday supper scene and the four guest portraits were generated with
Nano Banana through the Netlify AI Gateway. The prompts live in
`scripts/generate-images.mjs`:

```bash
pnpm images       # overwrites the files in public/img/
```

This only works in an environment where the Netlify AI Gateway variables are set. If
you're replacing the portraits with real photos you won't need it at all.

## Before you go live

- [ ] Replace the placeholders in `src/content/wedding.ts` with the real details
- [ ] Swap the contact email in `src/routes/__root.tsx` and `src/routes/friday.tsx`
- [ ] Drop real photos into `public/img/players/` and update `src/content/players.ts`
- [ ] Set the real maps link in `wedding.venueMapsUrl`
- [ ] Turn on a form notification email under Forms → Settings in the Netlify UI, so
      sign-ups reach you without checking the dashboard
