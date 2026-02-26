import axios from 'axios'
import type {
  Movie,
  TVShow,
  TrendingItem,
  Genre,
  PaginatedResponse,
  WatchProvidersResponse,
  Credits,
  SearchResult,
} from './types'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: process.env.NEXT_PUBLIC_TMDB_KEY },
})

export const IMG = {
  poster: (path: string | null, size: 'w300' | 'w500' | 'original' = 'w300') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
  backdrop: (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
  logo: (path: string | null, size: 'w45' | 'w92' | 'w154' = 'w92') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
}


function langParams(lang = 'en-US') {
  return { language: lang }
}

// ─── Trending ─────────────────────────────────────────────────
export async function getTrending(page = 1, lang?: string): Promise<PaginatedResponse<TrendingItem>> {
  const { data } = await api.get<PaginatedResponse<TrendingItem>>(
    '/trending/all/day',
    { params: { page, ...langParams(lang) } }
  )
  return data
}

// ─── Genres ───────────────────────────────────────────────────
export async function getMovieGenres(lang?: string): Promise<Genre[]> {
  const { data } = await api.get<{ genres: Genre[] }>(
    '/genre/movie/list',
    { params: langParams(lang) }
  )
  return data.genres
}

export async function getTVGenres(lang?: string): Promise<Genre[]> {
  const { data } = await api.get<{ genres: Genre[] }>(
    '/genre/tv/list',
    { params: langParams(lang) }
  )
  return data.genres
}

// ─── Discover ─────────────────────────────────────────────────
export async function discoverByGenre(
  genreId: number,
  page = 1,
  lang?: string
): Promise<PaginatedResponse<Movie>> {
  const { data } = await api.get<PaginatedResponse<Movie>>('/discover/movie', {
    params: { with_genres: genreId, sort_by: 'popularity.desc', page, ...langParams(lang) },
  })
  return data
}

// ─── Movie detail ─────────────────────────────────────────────
export async function getMovie(id: number | string, lang?: string): Promise<Movie> {
  const { data } = await api.get<Movie>(`/movie/${id}`, { params: langParams(lang) })
  return data
}

export async function getMovieCredits(id: number | string, lang?: string): Promise<Credits> {
  const { data } = await api.get<Credits>(`/movie/${id}/credits`, { params: langParams(lang) })
  return data
}

export async function getMovieRecommendations(
  id: number | string,
  page = 1,
  lang?: string
): Promise<PaginatedResponse<Movie>> {
  const { data } = await api.get<PaginatedResponse<Movie>>(
    `/movie/${id}/recommendations`,
    { params: { page, ...langParams(lang) } }
  )
  return data
}

export async function getMovieWatchProviders(
  id: number | string
): Promise<WatchProvidersResponse> {
  // Watch providers don't have language variants — no lang param needed
  const { data } = await api.get<WatchProvidersResponse>(`/movie/${id}/watch/providers`)
  return data
}

// ─── TV detail ────────────────────────────────────────────────
export async function getTVShow(id: number | string, lang?: string): Promise<TVShow> {
  const { data } = await api.get<TVShow>(`/tv/${id}`, { params: langParams(lang) })
  return data
}

export async function getTVCredits(id: number | string, lang?: string): Promise<Credits> {
  const { data } = await api.get<Credits>(`/tv/${id}/credits`, { params: langParams(lang) })
  return data
}

export async function getTVRecommendations(
  id: number | string,
  page = 1,
  lang?: string
): Promise<PaginatedResponse<TVShow>> {
  const { data } = await api.get<PaginatedResponse<TVShow>>(
    `/tv/${id}/recommendations`,
    { params: { page, ...langParams(lang) } }
  )
  return data
}

export async function getTVWatchProviders(
  id: number | string
): Promise<WatchProvidersResponse> {
  const { data } = await api.get<WatchProvidersResponse>(`/tv/${id}/watch/providers`)
  return data
}

// ─── Search ───────────────────────────────────────────────────
export async function searchMulti(
  query: string,
  page = 1,
  lang?: string
): Promise<PaginatedResponse<SearchResult>> {
  const { data } = await api.get<PaginatedResponse<SearchResult>>(
    '/search/multi',
    { params: { query, page, ...langParams(lang) } }
  )
  data.results = data.results.filter((r) => r.media_type !== 'person')
  return data
}

// ─── Parallel category fetch for home page ────────────────────
export async function getCategoryPreviews(genreIds: number[], lang?: string) {
  const requests = genreIds.map((id) =>
    discoverByGenre(id, 1, lang).catch(() => null)
  )
  return Promise.all(requests)
}
