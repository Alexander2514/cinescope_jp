import { getRatingColor, scoreToPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  alwaysVisible?: boolean
}

const SIZES = {
  sm: { px: 36, r: 14, stroke: 2.5, font: '0.52rem' },
  md: { px: 48, r: 19, stroke: 3,   font: '0.7rem'  },
  lg: { px: 64, r: 26, stroke: 3.5, font: '0.9rem'  },
}

export function RatingCircle({ score, size = 'sm', className, alwaysVisible }: Props) {
  const { px, r, stroke, font } = SIZES[size]
  const color = getRatingColor(score)
  const pct   = scoreToPercent(score)
  const circ  = 2 * Math.PI * r
  const dash  = (pct / 100) * circ

  return (
    <div
      className={cn(
        'relative flex-shrink-0',
        !alwaysVisible && 'opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0',
        className
      )}
      style={{ width: px, height: px }}
      title={`${score.toFixed(1)} / 10`}
    >
      <svg viewBox={`0 0 ${px} ${px}`} width={px} height={px}>
        {/* Track */}
        <circle
          cx={px / 2} cy={px / 2} r={r}
          fill="rgba(6,6,14,0.85)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={px / 2} cy={px / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash.toFixed(2)} ${circ.toFixed(2)}`}
          strokeDashoffset={(circ / 4).toFixed(2)}
          strokeLinecap="round"
        />
      </svg>
      {/* Number */}
      <span
        className="absolute inset-0 flex items-center justify-center font-body font-black leading-none"
        style={{ fontSize: font, color }}
      >
        {pct}
      </span>
    </div>
  )
}
