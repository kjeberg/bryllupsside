import { useCallback, useEffect, useRef, useState } from 'react'
import { courtImage, type Player } from '@/content/players'

/* Logical court size. The canvas scales to its container; all maths stay here. */
const W = 900
const H = 560
const PADDLE_R = 46
const PADDLE_X = 78
const BALL_R = 10
const WIN_SCORE = 7
const SERVE_DELAY = 0.9

const SPEED = { start: 430, gain: 1.045, max: 920 }
const RALLY = { player: 900, easy: 250, normal: 370, hard: 500 }
const SLOP = { easy: 90, normal: 42, hard: 12 }

export type Difficulty = keyof typeof SLOP

type Side = { y: number; target: number; score: number }

type Ball = {
  x: number
  y: number
  vx: number
  vy: number
  wait: number
  trail: Array<{ x: number; y: number }>
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const limits = { lo: PADDLE_R + 6, hi: H - PADDLE_R - 6 }

function serve(towards: -1 | 1): Ball {
  const angle = (Math.random() * 0.7 - 0.35) * Math.PI * 0.5
  return {
    x: W / 2,
    y: H / 2,
    vx: Math.cos(angle) * SPEED.start * towards,
    vy: Math.sin(angle) * SPEED.start,
    wait: SERVE_DELAY,
    trail: [],
  }
}

/** Reflect the ball off a round paddle, keeping enough horizontal drive to stay in play. */
function bounce(ball: Ball, px: number, py: number) {
  const dx = ball.x - px
  const dy = ball.y - py
  const dist = Math.hypot(dx, dy) || 1
  const nx = dx / dist
  const ny = dy / dist
  const speed = Math.min(SPEED.max, Math.hypot(ball.vx, ball.vy) * SPEED.gain)

  let vx = nx * speed
  let vy = ny * speed

  // A glancing edge hit can leave the ball crawling vertically — force it outward.
  const minVx = speed * 0.45
  if (Math.abs(vx) < minVx) {
    const dir = nx === 0 ? (px < W / 2 ? 1 : -1) : Math.sign(nx)
    vx = dir * minVx
    vy = Math.sign(vy || 1) * Math.sqrt(Math.max(0, speed * speed - vx * vx))
  }

  ball.vx = vx
  ball.vy = vy
  ball.x = px + nx * (PADDLE_R + BALL_R + 1)
  ball.y = py + ny * (PADDLE_R + BALL_R + 1)
}

export function PongGame({
  you,
  rival,
  difficulty,
  onRestart,
}: {
  you: Player
  rival: Player
  difficulty: Difficulty
  onRestart: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const left = useRef<Side>({ y: H / 2, target: H / 2, score: 0 })
  const right = useRef<Side>({ y: H / 2, target: H / 2, score: 0 })
  const ball = useRef<Ball>(serve(1))
  const keys = useRef({ up: false, down: false })
  const images = useRef<{ you?: HTMLImageElement; rival?: HTMLImageElement }>({})

  const [score, setScore] = useState({ you: 0, rival: 0 })
  const [phase, setPhase] = useState<'ready' | 'playing' | 'paused' | 'over'>('ready')
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  const reset = useCallback(() => {
    left.current = { y: H / 2, target: H / 2, score: 0 }
    right.current = { y: H / 2, target: H / 2, score: 0 }
    ball.current = serve(1)
    setScore({ you: 0, rival: 0 })
    setPhase('playing')
  }, [])

  /* ── Load the two pictures ──────────────────────────────────────────── */
  useEffect(() => {
    let live = true
    for (const [slot, player] of [
      ['you', you],
      ['rival', rival],
    ] as const) {
      const img = new Image()
      img.src = courtImage(player.src)
      img.decoding = 'async'
      img.onload = () => {
        if (live) images.current[slot] = img
      }
    }
    return () => {
      live = false
      images.current = {}
    }
  }, [you, rival])

  /* ── Input ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'w') keys.current.up = true
      if (event.key === 'ArrowDown' || event.key === 's') keys.current.down = true
      if (['ArrowUp', 'ArrowDown', ' '].includes(event.key)) event.preventDefault()

      if (event.key === ' ' && phaseRef.current === 'ready') setPhase('playing')
      if (event.key === 'p' || event.key === 'Escape') {
        setPhase((p) => (p === 'playing' ? 'paused' : p === 'paused' ? 'playing' : p))
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'w') keys.current.up = false
      if (event.key === 'ArrowDown' || event.key === 's') keys.current.down = false
    }
    const onBlur = () => setPhase((p) => (p === 'playing' ? 'paused' : p))

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  const onPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    left.current.target = clamp(((event.clientY - rect.top) / rect.height) * H, limits.lo, limits.hi)
    if (phaseRef.current === 'ready') setPhase('playing')
  }

  /* ── Loop ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    let raf = 0
    let last = performance.now()

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now

      if (phaseRef.current === 'playing') update(dt)
      draw(ctx)
      raf = requestAnimationFrame(step)
    }

    const update = (dt: number) => {
      const b = ball.current
      const mine = left.current
      const cpu = right.current

      /* Player paddle: keyboard nudges the target, pointer sets it directly. */
      if (keys.current.up) mine.target -= RALLY.player * dt
      if (keys.current.down) mine.target += RALLY.player * dt
      mine.target = clamp(mine.target, limits.lo, limits.hi)
      mine.y += (mine.target - mine.y) * Math.min(1, dt * 16)

      /* Opponent: only commits once the ball is coming its way. */
      const aim =
        b.vx > 0 ? b.y + (Math.random() - 0.5) * SLOP[difficulty] : H / 2 + (b.y - H / 2) * 0.12
      const reach = RALLY[difficulty] * dt
      cpu.y = clamp(cpu.y + clamp(aim - cpu.y, -reach, reach), limits.lo, limits.hi)

      if (b.wait > 0) {
        b.wait -= dt
        return
      }

      b.x += b.vx * dt
      b.y += b.vy * dt

      b.trail.push({ x: b.x, y: b.y })
      if (b.trail.length > 12) b.trail.shift()

      if (b.y < BALL_R) {
        b.y = BALL_R
        b.vy = Math.abs(b.vy)
      } else if (b.y > H - BALL_R) {
        b.y = H - BALL_R
        b.vy = -Math.abs(b.vy)
      }

      if (b.vx < 0 && Math.hypot(b.x - PADDLE_X, b.y - mine.y) < PADDLE_R + BALL_R) {
        bounce(b, PADDLE_X, mine.y)
      } else if (b.vx > 0 && Math.hypot(b.x - (W - PADDLE_X), b.y - cpu.y) < PADDLE_R + BALL_R) {
        bounce(b, W - PADDLE_X, cpu.y)
      }

      if (b.x < -BALL_R * 3) point('rival')
      else if (b.x > W + BALL_R * 3) point('you')
    }

    const point = (winner: 'you' | 'rival') => {
      const side = winner === 'you' ? left.current : right.current
      side.score += 1
      setScore({ you: left.current.score, rival: right.current.score })
      ball.current = serve(winner === 'you' ? 1 : -1)
      if (side.score >= WIN_SCORE) setPhase('over')
    }

    const paddle = (
      x: number,
      y: number,
      player: Player,
      img: HTMLImageElement | undefined,
    ) => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, PADDLE_R, 0, Math.PI * 2)
      ctx.shadowColor = 'rgba(34,29,24,0.32)'
      ctx.shadowBlur = 18
      ctx.shadowOffsetY = 6
      ctx.fillStyle = player.accent
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, PADDLE_R - 4, 0, Math.PI * 2)
      ctx.clip()
      if (img) {
        ctx.drawImage(img, x - PADDLE_R + 4, y - PADDLE_R + 4, (PADDLE_R - 4) * 2, (PADDLE_R - 4) * 2)
      } else {
        ctx.fillStyle = player.accent
        ctx.fillRect(x - PADDLE_R, y - PADDLE_R, PADDLE_R * 2, PADDLE_R * 2)
        ctx.fillStyle = '#f6f0e6'
        ctx.font = '600 34px Karla, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(player.name.slice(0, 1), x, y + 1)
      }
      ctx.restore()

      ctx.beginPath()
      ctx.arc(x, y, PADDLE_R - 2, 0, Math.PI * 2)
      ctx.strokeStyle = player.accent
      ctx.lineWidth = 4
      ctx.stroke()
    }

    const draw = (c: CanvasRenderingContext2D) => {
      c.fillStyle = '#ece2d3'
      c.fillRect(0, 0, W, H)

      /* Court markings */
      c.strokeStyle = 'rgba(34,29,24,0.22)'
      c.lineWidth = 2
      c.strokeRect(14, 14, W - 28, H - 28)

      c.save()
      c.setLineDash([12, 14])
      c.beginPath()
      c.moveTo(W / 2, 20)
      c.lineTo(W / 2, H - 20)
      c.stroke()
      c.restore()

      c.beginPath()
      c.arc(W / 2, H / 2, 78, 0, Math.PI * 2)
      c.stroke()

      /* Ball trail, oldest first */
      ball.current.trail.forEach((point, i) => {
        const t = (i + 1) / ball.current.trail.length
        c.beginPath()
        c.arc(point.x, point.y, BALL_R * t * 0.85, 0, Math.PI * 2)
        c.fillStyle = `rgba(180,96,74,${0.1 * t})`
        c.fill()
      })

      paddle(PADDLE_X, left.current.y, you, images.current.you)
      paddle(W - PADDLE_X, right.current.y, rival, images.current.rival)

      const b = ball.current
      c.save()
      c.beginPath()
      c.arc(b.x, b.y, BALL_R, 0, Math.PI * 2)
      c.shadowColor = 'rgba(34,29,24,0.4)'
      c.shadowBlur = 10
      c.shadowOffsetY = 3
      c.fillStyle = b.wait > 0 ? 'rgba(180,96,74,0.35)' : '#b4604a'
      c.fill()
      c.restore()
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [you, rival, difficulty])

  const youWon = score.you >= WIN_SCORE

  return (
    <div>
      {/* ── Scoreboard ───────────────────────────────────────────────── */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <Tag player={you} score={score.you} caption="You" />
        <span className="display shrink-0 text-2xl text-ink-faint">first to {WIN_SCORE}</span>
        <Tag player={rival} score={score.rival} caption="Opponent" align="right" />
      </div>

      {/* ── Court ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-sm border border-ink/20 bg-oat shadow-[0_30px_60px_-40px_rgba(34,29,24,0.8)]">
        <canvas
          ref={canvasRef}
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          className="block w-full touch-none"
          style={{ aspectRatio: `${W} / ${H}` }}
          aria-label={`Pong court. ${you.name} against ${rival.name}. Score ${score.you} to ${score.rival}.`}
          role="img"
        />

        {phase !== 'playing' && (
          <div className="absolute inset-0 grid place-items-center bg-paper/88 px-6 text-center backdrop-blur-sm">
            {phase === 'ready' && (
              <div>
                <p className="eyebrow">{you.name} vs {rival.name}</p>
                <h3 className="display mt-3 text-4xl text-ink sm:text-5xl">Ready when you are</h3>
                <p className="mx-auto mt-3 max-w-sm text-ink-soft">
                  Move your picture with the mouse, a finger, or the arrow keys. Press{' '}
                  <kbd className="rounded border border-ink/25 px-1.5 py-0.5 text-xs">P</kbd> to pause.
                </p>
                <button type="button" className="btn btn-solid mt-7" onClick={() => setPhase('playing')}>
                  Serve
                </button>
              </div>
            )}

            {phase === 'paused' && (
              <div>
                <h3 className="display text-4xl text-ink">Paused</h3>
                <button type="button" className="btn btn-solid mt-6" onClick={() => setPhase('playing')}>
                  Carry on
                </button>
              </div>
            )}

            {phase === 'over' && (
              <div>
                <p className="eyebrow">{score.you} – {score.rival}</p>
                <h3 className="display mt-3 text-4xl text-ink sm:text-5xl">
                  {youWon ? `${you.name} takes it` : `${rival.name} takes it`}
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-ink-soft">
                  {youWon
                    ? 'Genuinely impressive. We will find you a trophy made of cake.'
                    : 'Unlucky. The rematch is free and the court is always open.'}
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button type="button" className="btn btn-solid" onClick={reset}>
                    Rematch
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={onRestart}>
                    Change pictures
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-faint">
        <p>Mouse, touch, or ↑ ↓ / W S to move. P pauses.</p>
        <button
          type="button"
          onClick={onRestart}
          className="underline decoration-gold decoration-2 underline-offset-4 hover:text-ink"
        >
          Pick different pictures
        </button>
      </div>
    </div>
  )
}

function Tag({
  player,
  score,
  caption,
  align = 'left',
}: {
  player: Player
  score: number
  caption: string
  align?: 'left' | 'right'
}) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 text-lg font-bold"
        style={{ borderColor: player.accent, color: player.accent }}
      >
        {score}
      </span>
      <div className="min-w-0">
        <p className="eyebrow">{caption}</p>
        <p className="display truncate text-xl text-ink">{player.name}</p>
      </div>
    </div>
  )
}
