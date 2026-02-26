'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { LangDropdown } from './LangDropdown'
import { CommandPalette } from './CommandPalette'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'

export function Header() {
  const router   = useRouter()
  const pathname = usePathname()
  const { lang } = useLang()

  const [query,        setQuery]        = useState('')
  const [paletteOpen,  setPaletteOpen]  = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isHome    = pathname === '/'
  const isDetail  = pathname.startsWith('/movie/') || pathname.startsWith('/tv/')

  // Shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(p => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  // Live search debounce (600ms — matches old navigation.js)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchInput = (val: string) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!val.trim()) return
    debounceRef.current = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(val.trim())}`)
    }, 600)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-[200] flex items-center gap-2 md:gap-3 h-[62px] px-4 md:px-6 lg:px-10
          border-b border-white/[0.055] glass transition-shadow duration-300
          ${scrolled ? 'shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : ''}
          animate-[slideDown_0.5s_cubic-bezier(0.16,1,0.3,1)_both]`}
      >
        {/* Back button (non-home pages) */}
        {!isHome && (
          <button
            onClick={() => router.back()}
            aria-label="Volver"
            className="flex items-center justify-center w-[34px] h-[34px] rounded-lg flex-shrink-0
              text-white/40 font-bold text-xl transition-all duration-200
              hover:bg-white/[0.08] hover:text-violet-glow hover:scale-110"
          >
            ‹
          </button>
        )}

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-[1.85rem] tracking-[0.06em] whitespace-nowrap flex-shrink-0
            bg-gradient-to-r from-violet-glow to-yellow-400 bg-clip-text text-transparent
            drop-shadow-[0_0_18px_rgba(109,40,217,0.65)]"
        >
          CineScope
        </Link>

        {/* Page title (detail / category pages) */}
        {isDetail && (
          <span className="text-white/50 font-display text-xl tracking-widest uppercase ml-1 hidden sm:block">
            {pathname.startsWith('/tv/') ? '📺' : '🎬'}
          </span>
        )}

        {/* Search form — hidden on detail pages */}
        {!isDetail && (
          <form
            onSubmit={handleSearch}
            className="flex items-center flex-1 max-w-[380px] h-9 rounded-xl
              border border-white/[0.08] bg-white/[0.055] overflow-hidden
              transition-all duration-300 focus-within:border-violet-glow/50
              focus-within:shadow-[0_0_0_3px_rgba(109,40,217,0.14)]"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={e => handleSearchInput(e.target.value)}
              placeholder={t(lang, 'searchPlaceholder')}
              autoComplete="off"
              className="flex-1 h-full px-3.5 text-sm bg-transparent text-white/90 placeholder-white/28 outline-none"
            />
            <button
              type="submit"
              className="px-2.5 h-full text-white/38 text-sm transition-colors hover:text-violet-glow"
              aria-label="Buscar"
            >
              🔍
            </button>
          </form>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Ctrl+K trigger (desktop) */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            border border-white/[0.08] bg-white/[0.04] text-white/40 text-[0.72rem] font-semibold
            transition-all duration-200 hover:border-violet-glow/45 hover:text-violet-glow hover:bg-violet/10"
          aria-label="Open command palette"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <span className="font-mono">⌘K</span>
        </button>

        {/* Language picker */}
        <LangDropdown />

        {/* Home button (non-home pages) */}
        {!isHome && (
          <Link
            href="/"
            aria-label="Inicio"
            className="flex items-center justify-center w-[34px] h-[34px] rounded-lg flex-shrink-0
              text-white/40 transition-all duration-200
              hover:bg-white/[0.08] hover:text-violet-glow hover:scale-110 md:hidden"
          >
            🏠
          </Link>
        )}
      </header>

      {/* Command palette portal */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
