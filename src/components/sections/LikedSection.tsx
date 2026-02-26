'use client'

import Link from 'next/link'
import { useLikedMovies } from '@/store/likedMovies'
import { MovieCard } from '@/components/ui/MovieCard'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { HScroll } from '@/components/ui/HScroll'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import { useState, useEffect } from 'react'

export function LikedSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { getAll } = useLikedMovies()
  const { lang }   = useLang()

  // ← Solo esto va en el guard, un placeholder simple
  if (!mounted) return <section id="liked" className="mb-14"><div className="h-[80px]" /></section>

  // ← items se declara DESPUÉS del guard, cuando ya estamos en cliente
  const items = getAll()

  return (
    <section
      id="liked"
      className="mb-14 animate-[fadeUp_0.55s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]"
    >
      <div className="flex items-center justify-between mb-5">
        <SectionTitle>{t(lang, 'likedMovies')}</SectionTitle>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-9 px-8 text-center
          rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.02]
          max-w-[340px]">
          <span className="text-[2.5rem]">🎬</span>
          <p className="text-[0.9rem] font-medium text-white/50">
            ¡No hay películas guardadas!
          </p>
          <p className="text-[0.78rem] text-white/28 max-w-[220px]">
            Empieza a crear tu colección agregando tus favoritas.
          </p>
          <Link
            href="/trends"
            className="mt-1 px-5 py-2 rounded-lg text-[0.8rem] font-bold
              bg-violet-glow text-void transition-all duration-200
              hover:bg-yellow-400 hover:shadow-[0_0_24px_rgba(251,191,36,0.5)] hover:scale-105"
          >
            Explorar tendencias
          </Link>
        </div>
      ) : (
        <HScroll className="scrollbar-thin">
          {items.map(item => (
            <MovieCard key={item.id} item={item} fixedWidth />
          ))}
        </HScroll>
      )}
    </section>
  )
}
