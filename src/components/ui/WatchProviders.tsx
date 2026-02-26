import Image from 'next/image'
import { IMG } from '@/lib/api'
import type { WatchProviderResult } from '@/lib/types'

interface Props {
  providers: WatchProviderResult | null
}

export function WatchProviders({ providers }: Props) {
  if (!providers) return null

  // Deduplicate across flatrate / rent / buy
  const seen = new Set<number>()
  const all = [
    ...(providers.flatrate ?? []),
    ...(providers.rent ?? []),
    ...(providers.buy ?? []),
    ...(providers.free ?? []),
  ].filter((p) => {
    if (seen.has(p.provider_id)) return false
    seen.add(p.provider_id)
    return true
  }).slice(0, 8)

  if (!all.length) return null

  return (
    <div className="mt-5 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
      <p className="text-[0.7rem] font-bold uppercase tracking-widest text-white/35 mb-3">
        Disponible en
      </p>
      <div className="flex flex-wrap gap-2">
        {all.map((p) => {
          const logo = IMG.logo(p.logo_path, 'w92')
          return logo ? (
            <div key={p.provider_id} className="group relative">
              <Image
                src={logo}
                alt={p.provider_name}
                width={38}
                height={38}
                className="rounded-lg object-cover opacity-80 transition-all duration-200 group-hover:opacity-100 group-hover:scale-110"
                title={p.provider_name}
              />
            </div>
          ) : null
        })}
      </div>
    </div>
  )
}
