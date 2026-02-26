'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchMulti } from '@/lib/api'
import { MovieCard } from '@/components/ui/MovieCard'
import { MovieGrid } from '@/components/sections/MovieGrid'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useLang } from '@/hooks/useLang'
import { t } from '@/lib/i18n'
import type { TrendingItem } from '@/lib/types'

export default function SearchPage() {
  const params   = useSearchParams()
  const query    = params.get('q') ?? ''
  const { lang } = useLang()

  const [items,      setItems]      = useState<TrendingItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading,    setLoading]    = useState(false)

  // Re-fetch when query OR language changes
  useEffect(() => {
    if (!query.trim()) { setItems([]); return }
    setLoading(true)
    setItems([])
    searchMulti(query, 1, lang)
      .then(data => {
        setItems(data.results as TrendingItem[])
        setTotalPages(Math.min(data.total_pages, 20))
      })
      .finally(() => setLoading(false))
  }, [query, lang])

  const fetchMore = useCallback(async (page: number): Promise<TrendingItem[]> => {
    const data = await searchMulti(query, page, lang)
    return data.results as TrendingItem[]
  }, [query, lang])

  return (
    <main className="relative z-[1] max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 pt-6 pb-24 md:pb-10">

      {/* Header */}
      <div className="flex items-baseline gap-3 mb-6 flex-wrap">
        <SectionTitle className="section-title-bar font-serif font-bold text-xl md:text-2xl text-white/95">
          {query ? `"${query}"` : t(lang, 'searchPlaceholder')}
        </SectionTitle>
        {items.length > 0 && !loading && (
          <span className="text-[0.72rem] text-white/30 uppercase tracking-widest">
            {items.length}+ {lang === 'es-ES' ? 'resultados' : 'results'}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div
          className="grid gap-2.5 md:gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-[10px] skeleton"
              style={{ animationDelay: `${i * 30}ms` }}
            />
          ))}
        </div>
      )}

      {/* Empty query */}
      {!loading && !query && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-violet/10 border border-violet/20 flex items-center justify-center text-4xl">
            🔍
          </div>
          <p className="text-white/40 font-medium text-lg">
            {t(lang, 'searchPlaceholder')}
          </p>
        </div>
      )}

      {/* No results */}
      {!loading && query && items.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-4xl">
            🎬
          </div>
          <p className="text-white/50 font-medium text-lg">
            {lang === 'es-ES'
              ? `Sin resultados para "${query}"`
              : `No results for "${query}"`}
          </p>
          <p className="text-white/25 text-sm max-w-[260px]">
            {lang === 'es-ES'
              ? 'Intenta con otro título, actor o nombre de serie'
              : 'Try a different title, actor or series name'}
          </p>
        </div>
      )}

      {/* Results grid — mobile optimized */}
      {!loading && items.length > 0 && (
        <>
          {/* Mobile: 3 columns compact grid */}
          <div className="block md:hidden mb-4">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
            >
              {items.slice(0, 9).map((item, i) => (
                <MovieCard key={item.id} item={item} priority={i < 6} />
              ))}
            </div>
            {items.length > 9 && (
              <div className="mt-2">
                <MovieGrid
                  initialItems={items.slice(9)}
                  initialPage={1}
                  totalPages={totalPages}
                  fetchMore={fetchMore}
                  columns={3}
                />
              </div>
            )}
          </div>

          {/* Desktop: auto-fill grid */}
          <div className="hidden md:block">
            <MovieGrid
              initialItems={items}
              initialPage={1}
              totalPages={totalPages}
              fetchMore={fetchMore}
            />
          </div>
        </>
      )}
    </main>
  )
}
