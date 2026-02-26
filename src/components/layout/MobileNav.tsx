'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Inicio',
    match: (p: string) => p === '/',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[1.15rem] h-[1.15rem]" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1-1.414 1.414L18 10.414V17a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4H10v4a1 1 0 0 1-1 1H8a2 2 0 0 1-2-2v-6.586l-.707.707a1 1 0 0 1-1.414-1.414l7-7Z" />
      </svg>
    ),
  },
  {
    href: '/search?q=',
    label: 'Buscar',
    match: (p: string) => p === '/search',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[1.15rem] h-[1.15rem]" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/trends',
    label: 'Trending',
    match: (p: string) => p === '/trends',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[1.15rem] h-[1.15rem]" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 0 0-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 0 0-.613 3.58 2.64 2.64 0 0 1-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 0 0 5.05 6.05 6.981 6.981 0 0 0 3 11a7 7 0 1 0 13.95-1.524 13.898 13.898 0 0 0-1.55-4.923Z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[500] h-[62px] glass
        border-t border-white/[0.07] flex items-stretch"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(item => {
        const active = item.match(pathname)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-1 flex-1
              text-[0.57rem] font-semibold uppercase tracking-widest
              transition-colors duration-200 -webkit-tap-highlight-color-transparent
              ${active ? 'text-violet-glow' : 'text-white/35 hover:text-white/60'}`}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className={`transition-all duration-250 ${active ? 'drop-shadow-[0_0_6px_rgba(167,139,250,0.7)] -translate-y-0.5' : ''}`}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>

            {/* Active dot */}
            {active && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-glow shadow-[0_0_6px_#a78bfa]" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
