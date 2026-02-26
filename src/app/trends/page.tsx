'use client'

import { useState, useCallback, useEffect } from 'react'
import { getTrending } from '@/lib/api'
import { MovieGrid } from '@/components/sections/MovieGrid'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import type { TrendingItem } from '@/lib/types'

export default function TrendsPage() {
  const { lang }= useLang()
  const [items, setItems]= useState<TrendingItem[]>([])
  const [totalPages,setTotalPages]= useState(20)
  const [loading,setLoading]= useState(true)

  // Re-fetch when language changes
  useEffect(() => {
    setLoading(true)
    setItems([])
    getTrending(1, lang).then(data => {
      setItems(data.results)
      setTotalPages(Math.min(data.total_pages, 20))
      setLoading(false)
    })
  }, [lang])

  const fetchMore = useCallback(async (page: number): Promise<TrendingItem[]> => {
    const data = await getTrending(page, lang)
    return data.results
  }, [lang])

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 pt-8 pb-24 md:pb-10">
      <div className="flex items-center gap-3 mb-8">
        <SectionTitle className="section-title-bar font-serif font-bold text-xl md:text-2xl text-white/95">
          {t(lang, 'trending')}
        </SectionTitle>
        <span className="text-[0.65rem] uppercase tracking-widest text-violet-glow/50 font-semibold">
          🔥 Hoy
        </span>
      </div>

      {loading ? (
        <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-[10px] skeleton" style={{ animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
      ) : (
        <MovieGrid initialItems={items} initialPage={1} totalPages={totalPages} fetchMore={fetchMore} />
      )}
    </main>
  )
}
