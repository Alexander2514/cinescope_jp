'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { searchMulti, IMG } from '@/lib/api'
import { getTitle, getYear } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import type { SearchResult } from '@/lib/types'

const QUICK_COMMANDS = [
  { id: 'home',   label: '🏠 Inicio',     href: '/' },
  { id: 'trends', label: '🔥 Tendencias', href: '/trends' },
  { id: 'liked',  label: '❤️  Favoritos', href: '/#liked' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: Props) {
  const router   = useRouter()
  const { lang } = useLang()
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(0)

  const close = useCallback(() => {
    onClose()
    setQuery('')
    setResults([])
    setFocused(0)
  }, [onClose])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40)
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchMulti(query, 1, lang)
        setResults(data.results.slice(0, 8))
        setFocused(0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 280)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  // Keyboard navigation
  const listLen = query ? results.length : QUICK_COMMANDS.length
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); setFocused(p => (p + 1) % listLen)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault(); setFocused(p => (p - 1 + listLen) % listLen)
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (!query.trim()) {
          const cmd = QUICK_COMMANDS[focused]
          if (cmd) { router.push(cmd.href); close() }
        } else {
          const r = results[focused]
          if (r) {
            router.push(r.media_type === 'tv' ? `/tv/${r.id}` : `/movie/${r.id}`)
            close()
          }
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, focused, listLen, query, results, router, close])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-[6px]"
        onClick={close}
        aria-hidden
      />

      {/* Palette panel */}
      <div
        role="dialog"
        aria-modal
        aria-label="Command palette"
        className="fixed top-[12vh] left-1/2 -translate-x-1/2 z-[1000] w-[min(640px,92vw)]"
        style={{ animation: 'paletteIn 0.22s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        <div className="bg-[rgba(14,14,28,0.98)] border border-violet-glow/30 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(109,40,217,0.2)]">

          {/* Input row */}
          <div className="flex items-center gap-3 px-4 h-[52px] border-b border-white/[0.07]">
            <svg className="w-4 h-4 text-violet-glow/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t(lang, 'searchPlaceholder')}
              className="flex-1 bg-transparent text-white/90 placeholder-white/30 text-[1rem] outline-none font-body"
              spellCheck={false}
              autoComplete="off"
            />
            <kbd className="text-[0.65rem] font-mono text-white/30 bg-white/[0.07] border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[380px] overflow-y-auto p-1.5">
            {loading && (
              <p className="text-center text-white/30 text-sm py-6">Buscando…</p>
            )}

            {/* Quick commands (no query) */}
            {!query.trim() && !loading && QUICK_COMMANDS.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => { router.push(cmd.href); close() }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[0.88rem] font-medium transition-colors duration-150 ${
                  focused === i ? 'bg-violet/20 text-white' : 'text-white/65 hover:bg-violet/15 hover:text-white'
                }`}
              >
                {cmd.label}
              </button>
            ))}

            {/* Search results */}
            {query.trim() && !loading && results.length === 0 && (
              <p className="text-center text-white/30 text-sm py-6">Sin resultados</p>
            )}
            {results.map((item, i) => {
              const poster = IMG.poster(item.poster_path ?? null, 'w300')
              const title  = getTitle(item as any)
              const year   = (item.release_date || item.first_air_date || '').slice(0, 4)
              const href   = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`

              return (
                <button
                  key={item.id}
                  onClick={() => { router.push(href); close() }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors duration-150 ${
                    focused === i ? 'bg-violet/20' : 'hover:bg-violet/10'
                  }`}
                >
                  {poster && (
                    <div className="relative w-8 h-12 rounded flex-shrink-0 overflow-hidden">
                      <Image src={poster} alt={title} fill className="object-cover" sizes="32px" />
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[0.9rem] font-semibold text-white truncate">{title}</span>
                    <span className="text-[0.72rem] text-white/40">
                      {item.media_type === 'tv' ? '📺 Serie' : '🎬 Película'}{year ? ` · ${year}` : ''}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer hints */}
          <div className="flex gap-4 px-3.5 py-2 border-t border-white/[0.06] text-[0.65rem] text-white/25">
            {[['↑↓', 'navegar'], ['↵', 'seleccionar'], ['ESC', 'cerrar']].map(([key, label]) => (
              <span key={key} className="flex items-center gap-1">
                <kbd className="bg-white/[0.07] border border-white/10 rounded px-1 font-mono">{key}</kbd>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
