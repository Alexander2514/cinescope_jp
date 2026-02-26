'use client'

import { useState, useCallback } from 'react'
import { MovieCard } from '@/components/ui/MovieCard'
import { MovieGridSkeleton } from '@/components/ui/Skeleton'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { TrendingItem } from '@/lib/types'

interface Props {
  initialItems: TrendingItem[]
  initialPage?: number
  totalPages?: number
  fetchMore?: (page: number) => Promise<TrendingItem[]>
  /** Override grid columns (used on mobile search: 3) */
  columns?: number
}

export function MovieGrid({
  initialItems,
  initialPage = 1,
  totalPages = 1,
  fetchMore,
  columns,
}: Props) {
  const [items,   setItems]   = useState<TrendingItem[]>(initialItems)
  const [page,    setPage]    = useState(initialPage)
  const [hasMore, setHasMore] = useState(page < totalPages)
  const [loading, setLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (!fetchMore || loading || !hasMore) return
    setLoading(true)
    try {
      const next     = page + 1
      const newItems = await fetchMore(next)
      setItems(prev => [...prev, ...newItems])
      setPage(next)
      setHasMore(next < totalPages)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [fetchMore, loading, hasMore, page, totalPages])

  useInfiniteScroll({ onLoadMore: loadMore, hasMore, enabled: !!fetchMore, threshold: 400, delay: 250 })

  const gridStyle = columns
    ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : { gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }

  return (
    <>
      <div className="grid gap-2.5 md:gap-4 pb-20" style={gridStyle}>
        {items.map((item, i) => (
          <MovieCard key={`${item.id}-${i}`} item={item} priority={i < 6} />
        ))}
      </div>

      {loading && <MovieGridSkeleton count={columns ? columns * 2 : 10} />}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-white/20 text-[0.65rem] py-10 tracking-widest uppercase">
          · Fin de resultados ·
        </p>
      )}
    </>
  )
}
