import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { PongGame, type Difficulty } from '@/components/PongGame'
import { cardImage, players } from '@/content/players'
import { couple } from '@/content/wedding'

export const Route = createFileRoute('/pong')({
  component: PongPage,
})

const difficulties: Array<{ id: Difficulty; label: string; hint: string }> = [
  { id: 'easy', label: 'Second cousin', hint: 'Politely lets you win' },
  { id: 'normal', label: 'Old flatmate', hint: 'A fair fight' },
  { id: 'hard', label: 'Best man', hint: 'Has something to prove' },
]

function PongPage() {
  const [youId, setYouId] = useState(players[0].id)
  const [rivalId, setRivalId] = useState(players[1].id)
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [started, setStarted] = useState(false)

  const you = players.find((p) => p.id === youId) ?? players[0]
  const rival = players.find((p) => p.id === rivalId) ?? players[1]

  /* Picking a picture that is already taken swaps the two, so they are never the same. */
  const pick = (side: 'you' | 'rival') => (id: string) => {
    if (side === 'you') {
      if (id === rivalId) setRivalId(youId)
      setYouId(id)
    } else {
      if (id === youId) setYouId(rivalId)
      setRivalId(id)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">Wedding admin, gamified</p>
        <h1 className="display mt-4 text-[clamp(2.8rem,8vw,5.5rem)] text-ink">
          Guest<span className="text-terracotta">·</span>Pong
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-ink-soft">
          Two pictures, one ball, no dignity. Choose which picture you want to be, choose who it is up
          against, and play a round while you decide whether you are coming on Friday.
        </p>
      </header>

      {started ? (
        <div className="mt-14">
          <PongGame
            you={you}
            rival={rival}
            difficulty={difficulty}
            onRestart={() => setStarted(false)}
          />
        </div>
      ) : (
        <div className="mt-14">
          <PickerRow
            caption="You play as"
            index={1}
            selectedId={youId}
            otherId={rivalId}
            onPick={pick('you')}
          />

          <div className="my-12 flex items-center gap-5" aria-hidden="true">
            <hr className="rule flex-1" />
            <span className="display text-2xl italic text-ink-faint">versus</span>
            <hr className="rule flex-1" />
          </div>

          <PickerRow
            caption="Against"
            index={2}
            selectedId={rivalId}
            otherId={youId}
            onPick={pick('rival')}
          />

          {/* ── Difficulty ─────────────────────────────────────────────── */}
          <div className="mt-16">
            <p className="eyebrow mb-4">
              <span className="mr-2 text-terracotta">03</span> How good is your opponent?
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {difficulties.map((option) => {
                const active = difficulty === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDifficulty(option.id)}
                    aria-pressed={active}
                    className={`rounded-sm border p-4 text-left transition-colors ${
                      active
                        ? 'border-ink bg-ink text-paper'
                        : 'border-ink/20 bg-paper hover:border-ink/45'
                    }`}
                  >
                    <span className="block font-semibold">{option.label}</span>
                    <span className={`mt-0.5 block text-sm ${active ? 'text-paper/70' : 'text-ink-faint'}`}>
                      {option.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-5 border-t border-ink/12 pt-10">
            <button type="button" className="btn btn-solid" onClick={() => setStarted(true)}>
              Start the match
            </button>
            <p className="text-sm text-ink-faint">
              {you.name} against {rival.name}. First to seven.
            </p>
          </div>
        </div>
      )}

      <aside className="mt-24 rounded-sm border border-ink/15 bg-oat/50 p-8 sm:p-10">
        <p className="eyebrow">While you are here</p>
        <h2 className="display mt-3 text-3xl text-ink">
          Friday night still needs your name on it
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          {couple.one} and {couple.two} are counting heads for the welcome supper. It takes about
          twenty seconds, and it is considerably easier than beating the best man.
        </p>
        <Link to="/friday" className="btn btn-ghost mt-7 no-underline">
          Sign up for Friday
        </Link>
      </aside>
    </div>
  )
}

function PickerRow({
  caption,
  index,
  selectedId,
  otherId,
  onPick,
}: {
  caption: string
  index: number
  selectedId: string
  otherId: string
  onPick: (id: string) => void
}) {
  return (
    <section>
      <p className="eyebrow mb-4">
        <span className="mr-2 text-terracotta">{String(index).padStart(2, '0')}</span> {caption}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {players.map((player) => {
          const selected = player.id === selectedId
          const taken = player.id === otherId
          return (
            <button
              key={player.id}
              type="button"
              onClick={() => onPick(player.id)}
              aria-pressed={selected}
              className={`group relative overflow-hidden rounded-sm border bg-paper p-3 text-left transition-all duration-200 ${
                selected
                  ? 'border-ink shadow-[0_18px_36px_-24px_rgba(34,29,24,0.9)]'
                  : 'border-ink/15 hover:-translate-y-1 hover:border-ink/45'
              }`}
            >
              <div
                className="relative aspect-square overflow-hidden rounded-full border-[3px]"
                style={{ borderColor: player.accent }}
              >
                <img
                  src={cardImage(player.src)}
                  alt={player.name}
                  className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    taken ? 'opacity-45 saturate-50' : ''
                  }`}
                  loading="lazy"
                />
              </div>

              <p className="display mt-3 text-lg leading-tight text-ink">{player.name}</p>
              <p className="mt-0.5 text-[0.8rem] leading-snug text-ink-faint">{player.blurb}</p>

              <span
                className={`mt-2.5 inline-block text-[0.6rem] font-bold uppercase tracking-[0.18em] ${
                  selected ? 'text-terracotta' : 'text-transparent'
                }`}
              >
                Selected
              </span>

              {taken && (
                <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-paper">
                  Taken
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
