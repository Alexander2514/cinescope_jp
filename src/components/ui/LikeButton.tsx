'use client'

import { useLikedMovies } from '@/store/likedMovies'
import { cn } from '@/lib/utils'
import type { TrendingItem } from '@/lib/types'
import { useState, useEffect } from 'react'
interface Props {
  item: TrendingItem
  className?: string
}

export function LikeButton({ item, className }: Props) {
   const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { toggle, isLiked } = useLikedMovies()
  const liked = mounted ? isLiked(item.id) : false
  return (
    <button
      onClick={() => toggle(item)}
      aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      className={cn(
        'transition-all duration-300 p-1',
        liked
          ? 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.75)] animate-heart'
          : 'text-white/20 hover:text-red-500 hover:scale-110',
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-10 h-10"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={liked ? 0 : 1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  )
}
