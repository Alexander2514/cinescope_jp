'use client'

import Link from 'next/link'
import { MovieCard } from '@/components/ui/MovieCard'
import { HScroll } from '@/components/ui/HScroll'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import { GENRE_COLORS } from '@/lib/types'
import type { Genre, Movie } from '@/lib/types'
import type { LangCode } from '@/hooks/useLang'

interface Props {
  genre: Genre
  movies: Movie[]
  index?: number
  /** SSR-passed lang — falls back to Zustand store on client */
  lang?: LangCode
}

export function CategoryRow({ genre, movies, index = 0, lang: ssrLang }: Props) {
  const store    = useLang()
  const lang: LangCode = ssrLang ?? store.lang

  const dotColor = GENRE_COLORS[genre.id] ?? '#8b5cf6'
  const href     = `/category/${genre.id}?name=${encodeURIComponent(genre.name)}`
  const delay    = `${index * 70}ms`

  if (!movies.length) return null

  return (
    <div
      className="mb-10"
      style={{ animation: 'rowIn 0.5s cubic-bezier(0.16,1,0.3,1) both', animationDelay: delay }}
    >
      {/* Row header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: dotColor, boxShadow: `0 0 7px ${dotColor}` }}
          />
          <Link
            href={href}
            className="font-serif font-bold text-[1rem] md:text-[1.1rem] text-white/95
              hover:text-violet-glow transition-colors duration-200"
          >
            {genre.name}
          </Link>
        </div>

        <Link
          href={href}
          className="flex items-center gap-1 text-[0.72rem] font-semibold uppercase
            tracking-[0.06em] text-violet-glow/55 hover:text-violet-glow transition-all duration-200 group"
        >
          {t(lang, 'seeMore')}
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Horizontal scroll — 10 movies */}
      <HScroll className="scrollbar-thin gap-3">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            item={{ ...movie, media_type: 'movie' }}
            fixedWidth
          />
        ))}
      </HScroll>
    </div>
  )
}
