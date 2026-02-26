'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { discoverByGenre } from '@/lib/api'
import { MovieGrid } from '@/components/sections/MovieGrid'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useLang } from '@/hooks/useLang'
import { GENRE_COLORS } from '@/lib/types'
import type { TrendingItem } from '@/lib/types'

export default function CategoryPage() {
  const params       = useParams()
  const searchParams = useSearchParams()
  const id           = Number(params.id)
  const name         = searchParams.get('name') ?? 'Categoría'
  const dotColor     = GENRE_COLORS[id] ?? '#8b5cf6'
  const { lang }     = useLang()

  const [items,      setItems]      = useState<TrendingItem[]>([])
  const [totalPages, setTotalPages] = useState(10)
  const [loading,    setLoading]    = useState(true)

  // Re-fetch cuando cambia género O idioma
  useEffect(() => {
    setLoading(true)
    setItems([])
    discoverByGenre(id, 1, lang).then(data => {
      setItems(data.results as TrendingItem[])
      setTotalPages(Math.min(data.total_pages, 10))
      setLoading(false)
    })
  }, [id, lang])

  const fetchMore = useCallback(async (page: number): Promise<TrendingItem[]> => {
    const data = await discoverByGenre(id, page, lang)
    return data.results as TrendingItem[]
  }, [id, lang])

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 pt-8 pb-24 md:pb-10">
      <div className="flex items-center gap-3 mb-8">
        <span
          className="inline-block w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: dotColor, boxShadow: `0 0 10px ${dotColor}` }}
        />
        <SectionTitle className="section-title-bar font-serif font-bold text-xl md:text-2xl text-white/95">
          {name}
        </SectionTitle>
      </div>

      {loading && (
        <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-[10px] skeleton" style={{ animationDelay: `${i * 35}ms` }} />
          ))}
        </div>
      )}

      {!loading && (
        <MovieGrid
          initialItems={items}
          initialPage={1}
          totalPages={totalPages}
          fetchMore={fetchMore}
        />
      )}
    </main>
  )
}