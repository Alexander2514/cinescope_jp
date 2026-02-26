import { cn } from '@/lib/utils'

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[10px] bg-elevated',
        'bg-gradient-to-r from-elevated via-white/[0.055] to-elevated',
        'bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  )
}

export function MovieCardSkeleton({ fixedWidth = false }: { fixedWidth?: boolean }) {
  return (
    <Shimmer
      className={cn(
        fixedWidth ? 'flex-shrink-0 w-[150px] h-[225px]' : 'w-full aspect-[2/3]'
      )}
    />
  )
}

export function MovieRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} fixedWidth />
      ))}
    </div>
  )
}

export function CategoryRowSkeleton() {
  return (
    <div className="mb-10 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Shimmer className="w-2 h-2 rounded-full" />
          <Shimmer className="w-32 h-5" />
        </div>
        <Shimmer className="w-16 h-4" />
      </div>
      <MovieRowSkeleton />
    </div>
  )
}

export function MovieGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid gap-3 md:gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function MovieDetailSkeleton() {
  return (
    <div className="bg-surface border border-white/[0.07] rounded-[22px] p-6 md:p-8 max-w-[1080px] mx-auto">
      <div className="grid gap-6 md:grid-cols-[175px_1fr]">
        <Shimmer className="w-full aspect-[2/3] rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Shimmer className="h-10 w-3/4 rounded-xl" />
          <Shimmer className="h-4 w-full rounded" />
          <Shimmer className="h-4 w-5/6 rounded" />
          <Shimmer className="h-4 w-4/6 rounded" />
          <div className="flex gap-2 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Shimmer key={i} className="h-8 w-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
