import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className }: Props) {
  return (
    <h2
      className={cn(
        'inline-flex items-center gap-2.5',
        'font-serif font-bold text-xl md:text-[1.45rem] text-white/95',
        'before:content-[""] before:inline-block before:w-[3.5px] before:h-[1.05em]',
        'before:rounded-full before:flex-shrink-0',
        'before:bg-gradient-to-b before:from-violet before:to-violet-glow',
        'before:shadow-[0_0_14px_rgba(109,40,217,0.75)]',
        className
      )}
    >
      {children}
    </h2>
  )
}
