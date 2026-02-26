// ─── Base Media ──────────────────────────────────────────────
export interface BaseMedia {
  id: number
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  overview: string
  genre_ids?: number[]
  genres?: Genre[]
  original_language: string
}

// ─── Movie ───────────────────────────────────────────────────
export interface Movie extends BaseMedia {
  media_type?: 'movie'
  title: string
  original_title: string
  release_date: string
  runtime?: number
  budget?: number
  revenue?: number
  status?: string
  tagline?: string
  production_companies?: ProductionCompany[]
  spoken_languages?: SpokenLanguage[]
}

// ─── TV Show ─────────────────────────────────────────────────
export interface TVShow extends BaseMedia {
  media_type?: 'tv'
  name: string
  original_name: string
  first_air_date: string
  last_air_date?: string
  number_of_seasons?: number
  number_of_episodes?: number
  episode_run_time?: number[]
  status?: string
  tagline?: string
  networks?: Network[]
}

// ─── Union: any media item ────────────────────────────────────
export type MediaItem = Movie | TVShow

// ─── Trending (mixed) ─────────────────────────────────────────
export type TrendingItem = (Movie & { media_type: 'movie' }) | (TVShow & { media_type: 'tv' })

// ─── Genre ───────────────────────────────────────────────────
export interface Genre {
  id: number
  name: string
}

// ─── Production ──────────────────────────────────────────────
export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Network {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

// ─── Watch Providers ─────────────────────────────────────────
export interface WatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string
  display_priority: number
}

export interface WatchProviderResult {
  link?: string
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
  free?: WatchProvider[]
}

export interface WatchProvidersResponse {
  id: number
  results: Record<string, WatchProviderResult>
}

// ─── Pagination ───────────────────────────────────────────────
export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// ─── Credits ─────────────────────────────────────────────────
export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

// ─── Liked movies (stored in localStorage) ────────────────────
export type LikedMoviesStore = Record<number, TrendingItem>

// ─── UI helpers ──────────────────────────────────────────────
export type MediaType = 'movie' | 'tv'

export interface SearchResult {
  id: number
  media_type: MediaType | 'person'
  // Add relevant properties from Movie and TVShow as optional
  title?: string
  original_title?: string
  release_date?: string
  runtime?: number
  budget?: number
  revenue?: number
  status?: string
  tagline?: string
  production_companies?: ProductionCompany[]
  spoken_languages?: SpokenLanguage[]
  name?: string
  original_name?: string
  first_air_date?: string
  last_air_date?: string
  number_of_seasons?: number
  number_of_episodes?: number
  episode_run_time?: number[]
  networks?: Network[]
  // BaseMedia properties
  poster_path?: string | null
  backdrop_path?: string | null
  vote_average?: number
  vote_count?: number
  overview?: string
  genre_ids?: number[]
  genres?: Genre[]
  original_language?: string
}

// ─── Command Palette ─────────────────────────────────────────
export interface CommandItem {
  id: string
  label: string
  icon: string
  action: () => void
  meta?: string
}

// ─── Category colors ─────────────────────────────────────────
export const GENRE_COLORS: Record<number, string> = {
  28:    '#ef4444', // Action
  12:    '#f97316', // Adventure
  16:    '#fbbf24', // Animation
  35:    '#facc15', // Comedy
  80:    '#a78bfa', // Crime
  99:    '#60a5fa', // Documentary
  18:    '#f9a8d4', // Drama
  10751: '#fbbf24', // Family
  14:    '#c084fc', // Fantasy
  27:    '#f87171', // Horror
  878:   '#2dd4bf', // Sci-Fi
  9648:  '#818cf8', // Mystery
  10749: '#fb7185', // Romance
  53:    '#ef4444', // Thriller
  10402: '#818cf8', // Music
  37:    '#fb923c', // Western
  36:    '#a3e635', // History
  10770: '#38bdf8', // TV Movie
  10752: '#64748b', // War
}
