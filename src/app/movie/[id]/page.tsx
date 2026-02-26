import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getMovie,
  getMovieCredits,
  getMovieRecommendations,
  getMovieWatchProviders,
  IMG,
} from '@/lib/api'
import { LikeButton } from '@/components/ui/LikeButton'
import { RatingCircle } from '@/components/ui/RatingCircle'
import { WatchProviders } from '@/components/ui/WatchProviders'
import { MovieCard } from '@/components/ui/MovieCard'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { HScroll } from '@/components/ui/HScroll'
import { formatRuntime, formatMoney } from '@/lib/utils'
import { GENRE_COLORS } from '@/lib/types'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const movie = await getMovie(params.id)
    return {
      title:       `${movie.title} — CineScope`,
      description: movie.overview,
      openGraph: {
        title:  movie.title,
        description: movie.overview,
        images: IMG.poster(movie.poster_path, 'w500') ? [IMG.poster(movie.poster_path, 'w500')!] : [],
      },
    }
  } catch {
    return { title: 'Movie — CineScope' }
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const id = params.id

  // Parallel fetch of all detail data
  const [movie, credits, recommendations, providersData] = await Promise.all([
    getMovie(id).catch(() => null),
    getMovieCredits(id).catch(() => ({ cast: [], crew: [] })),
    getMovieRecommendations(id).catch(() => ({ results: [] })),
    getMovieWatchProviders(id).catch(() => ({ id: 0, results: {} })),
  ])

  if (!movie) notFound()

  const poster    = IMG.poster(movie.poster_path, 'w500')
  const backdrop  = IMG.backdrop(movie.backdrop_path)
  const directors = credits.crew.filter(c => c.job === 'Director').slice(0, 2)
  const cast      = credits.cast.slice(0, 8)

  // Pick best regional providers (US → ES → first available)
  const results = providersData.results as Record<string, any> | undefined
  const provRegion =
    results?.US ??
    results?.ES ??
    (results ? Object.values(results)[0] : null) ??
    null

  const mediaItem = { ...movie, media_type: 'movie' as const }

  return (
    <main className="relative z-[1] max-w-[1080px] mx-auto px-4 md:px-6 lg:px-10 py-8 pb-28 md:pb-10">

      {/* ── Backdrop blur hero ── */}
      {backdrop && (
        <div className="absolute inset-x-0 top-0 h-[380px] -z-10 overflow-hidden pointer-events-none">
          <Image src={backdrop} alt="" fill className="object-cover opacity-15 blur-[2px] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/80 to-void" />
        </div>
      )}

      {/* ── Main card ── */}
      <article className="bg-surface border border-white/[0.07] rounded-[22px] md:rounded-[28px] p-5 md:p-8 lg:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] animate-[fadeUp_0.55s_cubic-bezier(0.16,1,0.3,1)_both]">

        {/* Hero grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-[175px_1fr] lg:grid-cols-[245px_1fr_auto] items-start mb-8">

          {/* Poster */}
          {poster && (
            <div className="relative w-full max-w-[245px] aspect-[2/3] mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-[0_20px_55px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.07)]">
              <Image src={poster} alt={movie.title} fill className="object-cover" priority sizes="(max-width:768px) 50vw, 245px" />
            </div>
          )}

          {/* Info */}
          <div className="min-w-0">
            {/* Tagline */}
            {movie.tagline && (
              <p className="text-[0.72rem] uppercase tracking-widest text-violet-glow/60 mb-2 font-semibold">
                {movie.tagline}
              </p>
            )}
            <h1 className="font-serif font-black text-white text-[clamp(1.6rem,5vw,3rem)] leading-[1.1] mb-3">
              {movie.title}
            </h1>
            <p className="text-white/55 text-[0.9rem] md:text-[0.975rem] leading-[1.85] mb-4">
              {movie.overview}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.release_date && (
                <Chip icon="📅" text={movie.release_date.slice(0, 4)} />
              )}
              {movie.runtime && movie.runtime > 0 && (
                <Chip icon="⏱" text={formatRuntime(movie.runtime)} />
              )}
              {movie.original_language && (
                <Chip icon="🌐" text={movie.original_language.toUpperCase()} />
              )}
              {movie.budget && movie.budget > 0 && (
                <Chip icon="💰" text={formatMoney(movie.budget)} />
              )}
              {directors.length > 0 && (
                <Chip icon="🎬" text={directors.map(d => d.name).join(', ')} />
              )}
            </div>

            {/* Genre tags */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(g => (
                  <Link
                    key={g.id}
                    href={`/category/${g.id}?name=${encodeURIComponent(g.name)}`}
                    className="relative overflow-hidden px-3 py-1.5 rounded-lg border border-white/[0.08]
                      bg-white/[0.04] text-[0.8rem] font-semibold text-white/60 transition-all duration-200
                      hover:border-white/20 hover:text-white hover:-translate-y-0.5"
                    style={{ '--cat': GENRE_COLORS[g.id] ?? '#6d28d9' } as React.CSSProperties}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Watch providers */}
            <WatchProviders providers={provRegion} />
          </div>

          {/* Aside: score + like */}
          <div className="flex flex-row lg:flex-col items-center gap-4 lg:items-end">
            {movie.vote_average > 0 && (
              <div className="flex flex-col items-center gap-1">
                <RatingCircle score={movie.vote_average} size="lg" alwaysVisible />
                <span className="text-[0.7rem] text-white/40 font-semibold">
                  {movie.vote_average.toFixed(1)} / 10
                </span>
                <span className="text-[0.62rem] text-white/25">
                  {movie.vote_count.toLocaleString()} votos
                </span>
              </div>
            )}
            <LikeButton item={mediaItem} />
          </div>
        </div>

        {/* ── Cast ── */}
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

        {/* ── Related ── */}
        {recommendations.results.length > 0 && (
          <section>
            <SectionTitle className="section-title-bar mb-5 font-serif font-bold text-[1.1rem] text-white/95">
              Películas similares
            </SectionTitle>
            <HScroll className="scrollbar-thin">
              {recommendations.results.slice(0, 12).map(r => (
                <MovieCard
                  key={r.id}
                  item={{ ...r, media_type: 'movie' }}
                  fixedWidth
                />
              ))}
            </HScroll>
          </section>
        )}
      </article>
    </main>
  )
}

// ── Sub-components 
function Chip({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
      bg-white/[0.06] border border-white/[0.08] text-[0.75rem] text-white/60">
      <span className="text-[0.8rem]">{icon}</span>
      <span className="font-semibold">{text}</span>
    </span>
  )
}
