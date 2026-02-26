import { getTrending, getMovieGenres, getCategoryPreviews } from '@/lib/api'
// import { getLangFromCookie } from '@/lib/langCookie'
import { t } from '@/lib/i18n'
import { TrendingSection } from '@/components/sections/TrendingSection'
import { CategoryRow } from '@/components/sections/CategoryRow'
import { LikedSection } from '@/components/sections/LikedSection'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { CategoryRowSkeleton } from '@/components/ui/Skeleton'
import { Suspense } from 'react'

import { getLangFromCookie } from '@/lib/serverLang'
// Revalidate every 10 minutes
export const revalidate = 600

async function CategoriesGrid() {
  // Read lang from cookie — works in SSR
  const lang     = getLangFromCookie()
  const genres   = await getMovieGenres(lang)
  const top10    = genres.slice(0, 10)  // ← 10 categories instead of 8
  const previews = await getCategoryPreviews(top10.map(g => g.id), lang)

  return (
    <section className="mb-14">
      <SectionTitle className="section-title-bar mb-7 font-serif font-bold text-xl md:text-2xl text-white/95">
        {t(lang as 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR' | 'zh-CN' | 'de-DE' | 'it-IT', 'categories')}
      </SectionTitle>
      {top10.map((genre, i) => {
        const data = previews[i]
        if (!data) return null
        return (
          <CategoryRow
            key={genre.id}
            genre={genre}
            movies={data.results.slice(0, 10)}  // ← 10 movies per row instead of 6
            index={i}
            lang={lang}
          />
        )
      })}
    </section>
  )
}

export default async function HomePage() {
  const lang     = getLangFromCookie()
  const trending = await getTrending(1, lang)

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 pt-8 pb-24 md:pb-10">

      {/* Trending */}
      <TrendingSection items={trending.results} lang={lang} />

      {/* Categories — SSR with Suspense fallback */}
      <Suspense fallback={
        <section className="mb-14">
          <SectionTitle className="section-title-bar mb-7 font-serif font-bold text-xl text-white/95">
            {t(lang, 'categories')}
          </SectionTitle>
          {Array.from({ length: 4 }).map((_, i) => <CategoryRowSkeleton key={i} />)}
        </section>
      }>
        <CategoriesGrid />
      </Suspense>

      {/* Liked movies — client component, reads localStorage via Zustand */}
      <LikedSection />

    </main>
  )
}
