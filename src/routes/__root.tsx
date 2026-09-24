import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { couple, wedding } from '@/content/wedding'

import '../styles.css'

const siteName = `${couple.one} & ${couple.two} — ${wedding.dateShort}`
const siteDescription = `${couple.one} and ${couple.two} are getting married on ${wedding.date} at ${wedding.venueName}. All the details, plus sign-ups for the Friday night welcome supper.`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: siteName },
      { name: 'description', content: siteDescription },
      { name: 'theme-color', content: '#f6f0e6' },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Karla:ital,wght@0,300..700;1,400..600&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

const navLink =
  'block rounded-full px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-soft no-underline transition-colors hover:bg-oat hover:text-ink sm:text-[0.68rem] [&.active]:bg-ink [&.active]:text-paper'

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-50 border-b border-ink/12 bg-paper/88 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
            <Link to="/" className="group flex items-baseline gap-2.5 no-underline">
              <span className="display text-xl text-ink">
                {couple.one} <span className="text-terracotta">&</span> {couple.two}
              </span>
              <span className="hidden text-[0.6rem] font-bold uppercase tracking-[0.24em] text-ink-faint sm:inline">
                {wedding.dateShort}
              </span>
            </Link>

            <ul className="flex items-center gap-1 sm:gap-2">
              <li>
                <Link to="/" activeOptions={{ exact: true }} className={navLink}>
                  The wedding
                </Link>
              </li>
              <li>
                <Link to="/friday" className={navLink}>
                  Friday night
                </Link>
              </li>
              <li>
                <Link to="/pong" className={navLink}>
                  Pong
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main id="main">{children}</main>

        <footer className="mt-24 border-t border-ink/12 bg-oat/60">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="display text-4xl leading-none text-ink">
                  {couple.one} <span className="text-terracotta">&</span> {couple.two}
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  {wedding.date} · {wedding.venueName}
                </p>
              </div>
              <div className="text-sm text-ink-soft sm:text-right">
                <p className="eyebrow mb-2">Questions?</p>
                <p>
                  Ask us anything at{' '}
                  <a href="mailto:hello@example.com" className="text-ink underline decoration-gold decoration-2 underline-offset-4">
                    hello@example.com
                  </a>
                </p>
                <p className="mt-4 text-ink-faint">{couple.hashtag}</p>
              </div>
            </div>
          </div>
        </footer>

        <Scripts />
      </body>
    </html>
  )
}
