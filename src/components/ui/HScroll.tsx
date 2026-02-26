import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
}

export function HScroll({ children, className }: Props) {
  return (
    <div
      className={cn(
        'flex gap-3 md:gap-3.5',
        'overflow-x-auto pb-3',
        'scroll-snap-type-x-mandatory [-webkit-overflow-scrolling:touch]',
        '[&::-webkit-scrollbar]:h-[3px]',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:bg-elevated [&::-webkit-scrollbar-thumb]:rounded-full',
        className
      )}
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {children}
    </div>
  )
}
