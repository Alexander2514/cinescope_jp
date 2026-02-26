'use client'

import Link from 'next/link'
import { MovieCard } from '@/components/ui/MovieCard'
import { MovieRowSkeleton } from '@/components/ui/Skeleton'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { HScroll } from '@/components/ui/HScroll'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import type { TrendingItem } from '@/lib/types'
import type { LangCode } from '@/hooks/useLang'

interface Props {
  items: TrendingItem[]
  loading?: boolean
  /** SSR-passed lang — falls back to Zustand store on client */
  lang?: LangCode
}

export function TrendingSection({ items, loading, lang: ssrLang }: Props) {
  // Use SSR lang prop if provided (home page), otherwise read from Zustand (client nav)
  const store    = useLang()
  const lang: LangCode = ssrLang ?? store.lang

  return (
    <section className="mb-14 animate-[fadeUp_0.55s_cubic-bezier(0.16,1,0.3,1)_both]">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle>{t(lang, 'trending')}</SectionTitle>
        <Link
          href="/trends"
          className="text-[0.7rem] font-bold tracking-[0.1em] uppercase
            text-violet-glow bg-violet/12 border border-violet/32 rounded-full px-4 py-1.5
            transition-all duration-250 hover:bg-violet/28 hover:border-violet-glow
            hover:shadow-[0_0_35px_rgba(109,40,217,0.55)] hover:scale-105"
        >
          {t(lang, 'seeMore')}
        </Link>
      </div>

      {loading ? (
        <MovieRowSkeleton count={8} />
      ) : (
        <HScroll className="scrollbar-thin">
          {items.map((item, i) => (
            <MovieCard key={item.id} item={item} fixedWidth priority={i < 4} />
          ))}
        </HScroll>
      )}
    </section>
  )
}
