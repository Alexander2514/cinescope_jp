'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang, LANGUAGES, type LangCode } from '@/hooks/useLang'
import { LANG_COOKIE } from '@/lib/langCookie'
import {useRouter} from 'next/navigation'

export function LangDropdown() {
  const { lang, setLang, current } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const cur = current()

  const router = useRouter()

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (code: LangCode) => {
    setLang(code)
    setOpen(false)
    // Write cookie so SSR server components can read the lang
    document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    router.refresh()
  }

  return (
    <div ref={ref} className="relative flex-shrink-0 z-[300]">
      <button
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px] text-[0.78rem] font-semibold
          border transition-all duration-200 whitespace-nowrap cursor-pointer
          ${open
            ? 'border-violet-glow/50 bg-violet/16 text-white'
            : 'border-white/[0.09] bg-white/[0.055] text-white/70 hover:border-violet-glow/45 hover:bg-violet/12'
          }`}
      >
        <span className="text-[1.05rem] leading-none">{cur.flag}</span>
        <span className="hidden sm:inline">{cur.label}</span>
        <span
          className="text-[0.5rem] opacity-55 inline-block transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-[calc(100%+8px)] right-0 min-w-[148px] py-1.5 px-1.5
            bg-[rgba(14,14,28,0.98)] border border-white/10 rounded-xl list-none
            shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl z-50"
          style={{ animation: 'paletteIn 0.18s ease both' }}
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={lang === l.code}
                onClick={() => handleSelect(l.code)}
                className={`w-full flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[0.8rem]
                  font-medium text-left transition-colors duration-150 cursor-pointer
                  ${lang === l.code
                    ? 'bg-violet/20 text-white'
                    : 'text-white/60 hover:bg-violet/15 hover:text-white'
                  }`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="flex-1">{l.label}</span>
                {lang === l.code && <span className="text-violet-glow text-xs">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
