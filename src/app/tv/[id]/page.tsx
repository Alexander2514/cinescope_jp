import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getTVShow,
  getTVCredits,
  getTVRecommendations,
  getTVWatchProviders,
  IMG,
} from '@/lib/api'
// import { getLangFromCookie } from '@/lib/langCookie'
import type { WatchProviderResult } from '@/lib/types'
import { LikeButton } from '@/components/ui/LikeButton'
import { RatingCircle } from '@/components/ui/RatingCircle'
import { WatchProviders } from '@/components/ui/WatchProviders'
import { MovieCard } from '@/components/ui/MovieCard'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { HScroll } from '@/components/ui/HScroll'
import { GENRE_COLORS } from '@/lib/types'
import { getLangFromCookie } from '@/lib/serverLang'
interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const lang = getLangFromCookie()
    const show = await getTVShow(params.id, lang)
    return {
      title:       `${show.name} — CineScope`,
      description: show.overview,
      openGraph: {
        title:       show.name,
        description: show.overview,
        images: IMG.poster(show.poster_path, 'w500') ? [IMG.poster(show.poster_path, 'w500')!] : [],
      },
    }
  } catch {
    return { title: 'Serie — CineScope' }
  }
}

export default async function TVDetailPage({ params }: Props) {
  const id   = params.id
  const lang = getLangFromCookie()

  const [show, credits, recs, providersData] = await Promise.all([
    getTVShow(id, lang).catch(() => null),
    getTVCredits(id, lang).catch(() => ({ cast: [], crew: [] })),
    getTVRecommendations(id, 1, lang).catch(() => ({ results: [] })),
    getTVWatchProviders(id).catch(() => ({ id: 0, results: {} })),
  ])

  if (!show) notFound()

  const poster   = IMG.poster(show.poster_path, 'w500')
  const backdrop = IMG.backdrop(show.backdrop_path)
  const cast     = credits.cast.slice(0, 8)
  const creators = credits.crew.filter(c => c.job === 'Executive Producer').slice(0, 2)

  const results    = providersData.results as Record<string, WatchProviderResult> | undefined
  const provRegion = results?.US ?? results?.ES ?? (results ? Object.values(results)[0] : null) ?? null

  const mediaItem = { ...show, media_type: 'tv' as const }

  return (
    <main className="relative z-[1] max-w-[1080px] mx-auto px-4 md:px-6 lg:px-10 py-8 pb-28 md:pb-10">

      {backdrop && (
        <div className="absolute inset-x-0 top-0 h-[380px] -z-10 overflow-hidden pointer-events-none">
          <Image src={backdrop} alt="" fill className="object-cover opacity-15 blur-[2px] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/80 to-void" />
        </div>
      )}

      <article className="bg-surface border border-white/[0.07] rounded-[22px] md:rounded-[28px] p-5 md:p-8 lg:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] animate-[fadeUp_0.55s_cubic-bezier(0.16,1,0.3,1)_both]">

        <div className="grid gap-6 md:gap-8 md:grid-cols-[175px_1fr] lg:grid-cols-[245px_1fr_auto] items-start mb-8">

          {poster && (
            <div className="relative w-full max-w-[245px] aspect-[2/3] mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-[0_20px_55px_rgba(0,0,0,0.85)]">
              <Image src={poster} alt={show.name} fill className="object-cover" priority sizes="(max-width:768px) 50vw, 245px" />
            </div>
          )}

          <div className="min-w-0">
            <span className="inline-block text-[0.65rem] font-extrabold uppercase tracking-widest px-2 py-1 rounded-md bg-teal-400/90 text-void mb-3">
              📺 Serie de TV
            </span>

            {show.tagline && (
              <p className="text-[0.72rem] uppercase tracking-widest text-violet-glow/60 mb-2 font-semibold">
                {show.tagline}
              </p>
            )}

            <h1 className="font-serif font-black text-white text-[clamp(1.6rem,5vw,3rem)] leading-[1.1] mb-3">
              {show.name}
            </h1>
            <p className="text-white/55 text-[0.9rem] leading-[1.85] mb-4">{show.overview}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {show.first_air_date && <Chip icon="📅" text={show.first_air_date.slice(0, 4)} />}
              {show.number_of_seasons && (
                <Chip icon="📺" text={`${show.number_of_seasons} temporada${show.number_of_seasons > 1 ? 's' : ''}`} />
              )}
              {show.number_of_episodes && (
                <Chip icon="🎞" text={`${show.number_of_episodes} episodios`} />
              )}
              {show.original_language && <Chip icon="🌐" text={show.original_language.toUpperCase()} />}
              {show.status && <Chip icon="📡" text={show.status} />}
              {creators.length > 0 && <Chip icon="🎬" text={creators.map(c => c.name).join(', ')} />}
            </div>

            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map(g => (
                  <Link
                    key={g.id}
                    href={`/category/${g.id}?name=${encodeURIComponent(g.name)}`}
                    className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04]
                      text-[0.8rem] font-semibold text-white/60 transition-all duration-200
                      hover:border-white/20 hover:text-white hover:-translate-y-0.5"
                    style={{ color: GENRE_COLORS[g.id] ?? undefined } as React.CSSProperties}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            <WatchProviders providers={provRegion} />
          </div>

          <div className="flex flex-row lg:flex-col items-center gap-4 lg:items-end">
            {show.vote_average > 0 && (
              <div className="flex flex-col items-center gap-1">
                <RatingCircle score={show.vote_average} size="lg" alwaysVisible />
                <span className="text-[0.7rem] text-white/40 font-semibold">
                  {show.vote_average.toFixed(1)} / 10
                </span>
                <span className="text-[0.62rem] text-white/25">
                  {show.vote_count.toLocaleString()} votos
                </span>
              </div>
            )}
            <LikeButton item={mediaItem} />
          </div>
        </div>

        {cast.length > 0 && (
          <section className="mb-8">
            <h3 className="font-serif font-bold text-[1rem] text-white/80 mb-4 section-title-bar">
              Reparto principal
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {cast.map(member => (
                <div key={member.id} className="flex-shrink-0 w-[80px] text-center">
                  <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-elevated mb-1.5">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xl">👤</div>
                    )}
                  </div>
                  <p className="text-[0.62rem] font-semibold text-white/70 truncate">{member.name}</p>
                  <p className="text-[0.55rem] text-white/35 truncate">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {recs.results.length > 0 && (
          <section>
            <SectionTitle className="section-title-bar mb-5 font-serif font-bold text-[1.1rem] text-white/95">
              Series similares
            </SectionTitle>
            <HScroll className="scrollbar-thin">
              {recs.results.slice(0, 12).map(r => (
                <MovieCard key={r.id} item={{ ...r, media_type: 'tv' }} fixedWidth />
              ))}
            </HScroll>
          </section>
        )}
      </article>
    </main>
  )
}

function Chip({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[0.75rem] text-white/60">
      <span className="text-[0.8rem]">{icon}</span>
      <span className="font-semibold">{text}</span>
    </span>
  )
}