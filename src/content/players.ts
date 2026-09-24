/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE PONG PICTURES — swap these for real photos whenever you like.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Each entry is one playable picture. Two ways to change them:
 *
 *  1. Easiest — drop a replacement image over the file of the same name in
 *     `public/img/players/` (e.g. overwrite `player-1.png` with your photo)
 *     and just edit the `name` and `blurb` below.
 *  2. Or add a new file to `public/img/players/`, then point `src` at it.
 *
 *  Square, head-and-shoulders images work best: the game crops each one into a
 *  circle about 90px across, so faces should be centred and reasonably large.
 *  Add or remove entries freely — the picker and the game adapt to the list.
 */

export type Player = {
  id: string
  name: string
  blurb: string
  /** Path inside `public/`. Served through Netlify Image CDN, so use the original. */
  src: string
  /** Ring colour drawn around the picture on the court. */
  accent: string
}

export const players: Player[] = [
  {
    id: 'olive',
    name: 'Team Olive',
    blurb: 'Steady hands, ruthless at lawn games.',
    src: '/img/players/player-1.png',
    accent: '#5c6349',
  },
  {
    id: 'terracotta',
    name: 'Team Terracotta',
    blurb: 'All offence, no defence, great hair.',
    src: '/img/players/player-2.png',
    accent: '#b4604a',
  },
  {
    id: 'gold',
    name: 'Team Gold',
    blurb: 'Has played this before. Will remind you.',
    src: '/img/players/player-3.png',
    accent: '#c79a4b',
  },
  {
    id: 'ink',
    name: 'Team Ink',
    blurb: 'Quiet, patient, wins on the long rally.',
    src: '/img/players/player-4.png',
    accent: '#221d18',
  },
]

/** Sized for the court: small, square, and cheap to download. */
export const courtImage = (src: string) =>
  `/.netlify/images?url=${encodeURIComponent(src)}&w=220&h=220&fit=cover&fm=webp&q=80`

/** Sized for the picker cards. */
export const cardImage = (src: string) =>
  `/.netlify/images?url=${encodeURIComponent(src)}&w=420&h=420&fit=cover&fm=webp&q=80`
