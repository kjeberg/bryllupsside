import { Link, createFileRoute } from '@tanstack/react-router'
import { Countdown } from '@/components/Countdown'
import { couple, faqs, fridayEvent, schedule, story, travel, wedding } from '@/content/wedding'

export const Route = createFileRoute('/')({
  component: WeddingHome,
})

const hero = '/.netlify/images?url=/img/hero-venue.png&w=1800&fm=webp&q=78'
const supper = '/.netlify/images?url=/img/friday-supper.png&w=1100&h=800&fit=cover&fm=webp&q=78'

function WeddingHome() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-ink/12">
        <img
          src={hero}
          alt="An illustration of the stone barn at Ashcombe Vale, with festoon lights strung between two oaks and a long table set out in a wildflower meadow"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-right"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(105deg, rgba(246,240,230,0.97) 0%, rgba(246,240,230,0.9) 38%, rgba(246,240,230,0.35) 66%, rgba(246,240,230,0.1) 100%)',
          }}
        />

        <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
          <div className="max-w-2xl">
            <p className="eyebrow rise">{story.eyebrow}</p>

            <h1 className="display mt-5 text-[clamp(3.6rem,13vw,8.5rem)] text-ink">
              <span className="rise block" style={{ animationDelay: '80ms' }}>
                {couple.one}
              </span>
              <span
                className="rise block pl-[0.6em] text-terracotta italic"
                style={{ animationDelay: '180ms', fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
              >
                and
              </span>
              <span className="rise block" style={{ animationDelay: '280ms' }}>
                {couple.two}
              </span>
            </h1>

            <div className="rise mt-10 flex flex-col gap-1.5 border-l-2 border-gold pl-5" style={{ animationDelay: '400ms' }}>
              <p className="text-lg font-semibold tracking-wide text-ink">{wedding.date}</p>
              <p className="text-ink-soft">
                {wedding.ceremonyTime} · {wedding.venueName}
              </p>
              <p className="text-sm text-ink-faint">{wedding.venueAddress}</p>
            </div>

            <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '500ms' }}>
              <Link to="/friday" className="btn btn-solid no-underline">
                Sign up for Friday
              </Link>
              <a href="#details" className="btn btn-ghost no-underline">
                The details
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Countdown ────────────────────────────────────────────────── */}
      <section className="border-b border-ink/12 bg-oat/50 py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="eyebrow mb-7 text-center">Until we say the words</p>
          <Countdown startsAt={wedding.startsAt} />
        </div>
      </section>

      {/* ── Information text ─────────────────────────────────────────── */}
      <section id="details" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="display sticky top-24 text-[clamp(2.2rem,4.6vw,3.4rem)] text-ink">
              {story.heading}
            </h2>
          </div>
          <div className="md:col-span-7 md:pt-3">
            {story.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'mb-6 text-xl leading-relaxed text-ink first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[4.2rem] first-letter:leading-[0.78] first-letter:text-terracotta'
                    : 'mb-6 text-ink-soft'
                }
              >
                {paragraph}
              </p>
            ))}

            <dl className="mt-10 grid gap-6 border-t border-ink/12 pt-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow mb-2">What to wear</dt>
                <dd className="display text-2xl text-ink">{wedding.dressCode}</dd>
                <dd className="mt-2 text-sm text-ink-soft">{wedding.dressCodeNote}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">Where</dt>
                <dd className="display text-2xl text-ink">{wedding.venueName}</dd>
                <dd className="mt-2 text-sm text-ink-soft">{wedding.venueAddress}</dd>
                <dd className="mt-3">
                  <a
                    href={wedding.venueMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ink underline decoration-gold decoration-2 underline-offset-4"
                  >
                    Open in maps ↗
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ── Saturday running order ───────────────────────────────────── */}
      <section className="border-y border-ink/12 bg-oat/40 py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">How Saturday goes</h2>
            <p className="eyebrow">{wedding.dateShort}</p>
          </div>

          <ol className="relative border-l border-ink/20">
            {schedule.map((item, i) => (
              <li
                key={item.title}
                className="relative grid gap-2 pb-11 pl-8 last:pb-0 sm:grid-cols-[7rem_1fr] sm:gap-8"
                style={{ marginLeft: `${(i % 3) * 0.75}rem` }}
              >
                <span
                  className="absolute -left-[5px] top-2.5 h-2 w-2 rounded-full bg-terracotta ring-4 ring-paper"
                  aria-hidden="true"
                />
                <span className="pt-1 text-sm font-bold uppercase tracking-[0.12em] text-olive">
                  {item.time}
                </span>
                <div>
                  <h3 className="display text-2xl text-ink">{item.title}</h3>
                  <p className="mt-1.5 max-w-xl text-ink-soft">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Friday night teaser ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative">
            <img
              src={supper}
              alt="An illustration of the courtyard at The Cider House: a long trestle table under a lit pergola, set for a casual supper"
              className="aspect-[11/8] w-full rounded-sm border border-ink/12 object-cover shadow-[0_24px_50px_-30px_rgba(34,29,24,0.6)]"
              loading="lazy"
            />
            <span className="absolute -right-3 -top-3 rotate-3 bg-terracotta px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-paper shadow-lg">
              The night before
            </span>
          </div>

          <div>
            <p className="eyebrow">{fridayEvent.date} · {fridayEvent.time}</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4.4vw,3.2rem)] text-ink">
              {fridayEvent.name}
            </h2>
            <p className="mt-5 text-ink-soft">{fridayEvent.blurb}</p>
            <p className="mt-5 text-sm text-ink-faint">{fridayEvent.capacityNote}</p>
            <Link to="/friday" className="btn btn-solid mt-8 no-underline">
              Count me in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Travel, staying, presents ────────────────────────────────── */}
      <section className="border-t border-ink/12 py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="display mb-14 text-[clamp(2rem,4vw,3rem)] text-ink">Useful things</h2>
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-3">
            {travel.map((block, i) => (
              <article key={block.title} className={i === 1 ? 'md:mt-12' : i === 2 ? 'md:mt-24' : ''}>
                <span className="display block text-5xl leading-none text-oat-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display mt-3 text-2xl text-ink">{block.title}</h3>
                <p className="mt-3 text-ink-soft">{block.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="border-t border-ink/12 bg-oat/40 py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h2 className="display mb-12 text-[clamp(2rem,4vw,3rem)] text-ink">
            Questions you might have
          </h2>

          <div className="divide-y divide-ink/12 border-y border-ink/12">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-semibold text-ink marker:content-none">
                  {faq.q}
                  <span
                    className="mt-1 shrink-0 text-terracotta transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    ＋
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-10 text-ink-soft">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-16 rounded-sm border border-ink/15 bg-paper p-8 text-center sm:p-12">
            <p className="eyebrow">One more thing</p>
            <h3 className="display mt-3 text-3xl text-ink sm:text-4xl">
              We built you a silly game
            </h3>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">
              Pick a guest portrait and play a round of pong against another one. It settles nothing
              and takes about ninety seconds.
            </p>
            <Link to="/pong" className="btn btn-ghost mt-7 no-underline">
              Play wedding pong
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
