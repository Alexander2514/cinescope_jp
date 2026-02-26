'use client'

import Link from 'next/link'
import Image from 'next/image'
import { RatingCircle } from './RatingCircle'
import { getTitle, getYear, cn } from '@/lib/utils'
import type { TrendingItem } from '@/lib/types'
import { IMG } from '@/lib/api'

interface Props {
  item: TrendingItem
  /** Fixed width for horizontal scroll rows */
  fixedWidth?: boolean
  className?: string
  priority?: boolean
}

export function MovieCard({ item, fixedWidth = false, className, priority }: Props) {
  const isTV      = item.media_type === 'tv'
  const href      = isTV ? `/tv/${item.id}` : `/movie/${item.id}`
  const title     = getTitle(item)
  const year      = getYear(item)
  const posterUrl = IMG.poster(item.poster_path)

  return (
    <Link
      href={href}
      className={cn(
        'group relative rounded-[10px] overflow-hidden cursor-pointer bg-card block',
        'shadow-[0_4px_20px_rgba(0,0,0,0.55)]',
        'transition-transform duration-[380ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        'hover:-translate-y-3 hover:scale-[1.05] hover:shadow-[0_22px_55px_rgba(0,0,0,0.85),0_0_0_1.5px_rgba(139,92,246,0.5)] hover:z-20',
        fixedWidth ? 'flex-shrink-0 w-[150px]' : 'w-full',
        className
      )}
    >
      {/* Poster */}
      <div className={cn('relative', fixedWidth ? 'h-[225px] w-[150px]' : 'aspect-[2/3] w-full')}>
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes={fixedWidth ? '150px' : '(max-width:640px) 45vw, (max-width:1024px) 22vw, 185px'}
            className="object-cover transition-[transform,filter] duration-[380ms] group-hover:scale-[1.06] group-hover:brightness-110 group-hover:saturate-[1.2]"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-elevated flex items-center justify-center">
            <span className="text-3xl opacity-30">🎬</span>
          </div>
        )}

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Gloss sweep */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* TV badge */}
        {isTV && (
          <span className="absolute top-[7px] left-[7px] z-10 text-[0.55rem] font-extrabold tracking-widest px-1.5 py-0.5 rounded bg-teal-400/90 text-void">
            TV
          </span>
        )}

        {/* Rating circle (bottom-left, appears on hover) */}
        {item.vote_average > 0 && (
          <div className="absolute bottom-2 left-2 z-10">
            <RatingCircle score={item.vote_average} size="sm" />
          </div>
        )}
      </div>

      {/* Footer info (visible on hover via gradient) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-2 pb-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <p className="text-[0.62rem] font-semibold text-white/90 truncate leading-tight">{title}</p>
        {year && <p className="text-[0.55rem] text-white/45">{year}</p>}
      </div>
    </Link>
  )
}
