import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { couple, fridayEvent, wedding } from '@/content/wedding'

export const Route = createFileRoute('/friday')({
  component: FridayPage,
})

const FORM_NAME = 'friday-supper'
/** Must be the static skeleton in public/ — POSTing to '/' is swallowed by SSR. */
const FORM_ENDPOINT = '/friday-rsvp.html'

const supper = '/.netlify/images?url=/img/friday-supper.png&w=1200&h=620&fit=cover&fm=webp&q=78'

/* Every value is a string so the generic field setter below stays simple and
   the payload maps one-to-one onto the registered Netlify form fields. */
type Fields = {
  name: string
  email: string
  attending: string
  'party-size': string
  'guest-names': string
  dietary: string
  arrival: string
  note: string
}

const EMPTY: Fields = {
  name: '',
  email: '',
  attending: 'yes',
  'party-size': '1',
  'guest-names': '',
  dietary: '',
  arrival: '',
  note: '',
}

const arrivalOptions = [
  'Not sure yet',
  'Thursday night',
  'Friday during the day',
  'Friday, straight to supper',
]

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

function validate(fields: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {}
  if (!fields.name.trim()) errors.name = 'We need a name to put on the list.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
    errors.email = 'That email address does not look quite right.'
  return errors
}

function FridayPage() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const coming = fields.attending === 'yes'

  const set = (key: keyof Fields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate(fields)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('sending')
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': FORM_NAME,
          ...fields,
          // Only meaningful when they are actually coming.
          'party-size': coming ? fields['party-size'] : '0',
        }),
      })
      if (!response.ok) throw new Error(`Form responded ${response.status}`)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="max-w-3xl">
        <p className="eyebrow">{fridayEvent.date} · {fridayEvent.time}</p>
        <h1 className="display mt-4 text-[clamp(2.8rem,8vw,5.5rem)] text-ink">
          {fridayEvent.name}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-ink-soft">{fridayEvent.blurb}</p>
      </header>

      <img
        src={supper}
        alt="An illustration of the courtyard at The Cider House set for supper, with a lit pergola over a long trestle table"
        className="mt-12 aspect-[12/6.2] w-full rounded-sm border border-ink/12 object-cover"
        loading="lazy"
      />

      <div className="mt-16 grid gap-14 md:grid-cols-12 md:gap-16">
        {/* ── Practical details ──────────────────────────────────────── */}
        <aside className="md:col-span-4">
          <div className="md:sticky md:top-24">
            <dl className="divide-y divide-ink/12 border-y border-ink/12">
              <div className="py-4">
                <dt className="eyebrow mb-1.5">Where</dt>
                <dd className="display text-xl text-ink">{fridayEvent.venueName}</dd>
                <dd className="mt-1 text-sm text-ink-soft">{fridayEvent.venueAddress}</dd>
              </div>
              <div className="py-4">
                <dt className="eyebrow mb-1.5">When</dt>
                <dd className="text-ink">{fridayEvent.date}</dd>
                <dd className="text-sm text-ink-soft">{fridayEvent.time}</dd>
              </div>
              <div className="py-4">
                <dt className="eyebrow mb-1.5">Sign up by</dt>
                <dd className="text-ink">{fridayEvent.rsvpBy}</dd>
                <dd className="mt-1 text-sm text-ink-soft">{fridayEvent.capacityNote}</dd>
              </div>
            </dl>

            <ul className="mt-8 space-y-3">
              {fridayEvent.practicalities.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink-soft">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-ink-faint">
              Signing up here covers Friday only — the Saturday invitation is separate, and your reply
              to that comes by post.
            </p>
          </div>
        </aside>

        {/* ── The form ───────────────────────────────────────────────── */}
        <div className="md:col-span-8">
          {status === 'done' ? (
            <div className="rounded-sm border border-olive/40 bg-olive/8 p-10 text-center sm:p-14">
              <p className="display text-6xl leading-none text-olive">✓</p>
              <h2 className="display mt-5 text-3xl text-ink sm:text-4xl">
                {coming ? 'You are on the list' : 'Thanks for letting us know'}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ink-soft">
                {coming
                  ? `We have got you down for ${fields['party-size']} at ${fridayEvent.venueName} on ${fridayEvent.date}. We will send directions and any last details to ${fields.email} nearer the time.`
                  : `We will miss you on Friday — but we will see you on ${wedding.date} for the main event.`}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link to="/pong" className="btn btn-solid no-underline">
                  Now play some pong
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setFields(EMPTY)
                    setStatus('idle')
                  }}
                >
                  Sign someone else up
                </button>
              </div>
            </div>
          ) : (
            <form
              name={FORM_NAME}
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
              noValidate
            >
              <input type="hidden" name="form-name" value={FORM_NAME} />
              <p className="hidden">
                <label>
                  Leave this empty
                  <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <fieldset className="mb-9 border-0 p-0">
                <legend className="field-label mb-3">Can you make Friday?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: 'yes', label: 'Yes, count us in', hint: 'See you in the courtyard' },
                    { value: 'no', label: 'Sorry, not Friday', hint: 'Saturday only' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-sm border p-4 transition-colors ${
                        fields.attending === option.value
                          ? 'border-ink bg-ink text-paper'
                          : 'border-ink/20 bg-paper hover:border-ink/45'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={option.value}
                        checked={fields.attending === option.value}
                        onChange={set('attending')}
                        className="sr-only"
                      />
                      <span className="block font-semibold">{option.label}</span>
                      <span
                        className={`mt-0.5 block text-sm ${
                          fields.attending === option.value ? 'text-paper/70' : 'text-ink-faint'
                        }`}
                      >
                        {option.hint}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="name">
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="field"
                    value={fields.name}
                    onChange={set('name')}
                    placeholder="Jo Whitfield"
                    autoComplete="name"
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <span className="field-error" id="name-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="field-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="field"
                    value={fields.email}
                    onChange={set('email')}
                    placeholder="jo@example.com"
                    autoComplete="email"
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <span className="field-error" id="email-error">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {coming && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="party-size">
                      How many of you, including yourself?
                    </label>
                    <select
                      id="party-size"
                      name="party-size"
                      className="field"
                      value={fields['party-size']}
                      onChange={set('party-size')}
                    >
                      {['1', '2', '3', '4', '5', '6'].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="arrival">
                      When are you arriving?
                    </label>
                    <select
                      id="arrival"
                      name="arrival"
                      className="field"
                      value={fields.arrival || arrivalOptions[0]}
                      onChange={set('arrival')}
                    >
                      {arrivalOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {fields['party-size'] !== '1' && (
                    <div className="sm:col-span-2">
                      <label className="field-label" htmlFor="guest-names">
                        Who is coming with you?
                      </label>
                      <input
                        id="guest-names"
                        name="guest-names"
                        className="field"
                        value={fields['guest-names']}
                        onChange={set('guest-names')}
                        placeholder="Names of everyone else in your group"
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="dietary">
                      Anything the kitchen should know?
                    </label>
                    <textarea
                      id="dietary"
                      name="dietary"
                      rows={2}
                      className="field resize-y"
                      value={fields.dietary}
                      onChange={set('dietary')}
                      placeholder="Allergies, vegetarian, vegan, or nothing at all"
                    />
                    <span className="mt-1.5 block text-sm text-ink-faint">
                      We will pass this along for Saturday too, so you only have to say it once.
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="field-label" htmlFor="note">
                  A note for {couple.one} and {couple.two} <span className="font-normal normal-case tracking-normal text-ink-faint">(optional)</span>
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  className="field resize-y"
                  value={fields.note}
                  onChange={set('note')}
                  placeholder="Song requests, questions, gossip"
                />
              </div>

              {status === 'error' && (
                <p className="mt-6 rounded-sm border border-terracotta/45 bg-terracotta/8 px-4 py-3 text-sm text-terracotta" role="alert">
                  Something went wrong sending that. Have another go, or email us at{' '}
                  <a href="mailto:hello@example.com" className="underline">
                    hello@example.com
                  </a>{' '}
                  and we will add you by hand.
                </p>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : coming ? 'Put me on the list' : 'Send reply'}
                </button>
                <p className="text-sm text-ink-faint">
                  Sign-ups close {fridayEvent.rsvpBy}.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
