import { useEffect, useState } from 'react'

function parts(target: number, now: number) {
  const ms = Math.max(0, target - now)
  return [
    { value: Math.floor(ms / 86_400_000), label: 'days' },
    { value: Math.floor(ms / 3_600_000) % 24, label: 'hours' },
    { value: Math.floor(ms / 60_000) % 60, label: 'minutes' },
    { value: Math.floor(ms / 1_000) % 60, label: 'seconds' },
  ]
}

export function Countdown({ startsAt }: { startsAt: string }) {
  const target = new Date(startsAt).getTime()
  // Rendered empty on the server so SSR markup never disagrees with the client clock.
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const done = now !== null && now >= target

  return (
    <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-5 sm:gap-x-14">
      {done ? (
        <p className="display text-3xl text-ink">Today is the day.</p>
      ) : (
        parts(target, now ?? target).map(({ value, label }) => (
          <div key={label} className="text-center">
            <div
              className="display text-5xl tabular-nums text-ink sm:text-6xl"
              style={{ fontVariationSettings: '"SOFT" 40, "WONK" 0, "opsz" 100' }}
            >
              {now === null ? '––' : String(value).padStart(2, '0')}
            </div>
            <div className="eyebrow mt-2">{label}</div>
          </div>
        ))
      )}
    </div>
  )
}
