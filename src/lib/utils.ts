import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TrendingItem } from './types'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Get display title from any media item */
export function getTitle(item: TrendingItem | { title?: string; name?: string }): string {
  return ('title' in item && item.title) || ('name' in item && item.name) || 'Unknown'
}

/** Get release year from any media item */
export function getYear(item: TrendingItem): string {
  const date =
    ('release_date' in item && item.release_date) ||
    ('first_air_date' in item && item.first_air_date) ||
    ''
  return date.slice(0, 4)
}

/** Color based on vote score */
export function getRatingColor(score: number): string {
  if (score >= 7.5) return '#4ade80'
  if (score >= 6.0) return '#fbbf24'
  if (score >= 4.0) return '#f97316'
  return '#ef4444'
}

/** Score → percentage (0-100) */
export function scoreToPercent(score: number): number {
  return Math.round(score * 10)
}

/** Format runtime in hours/minutes */
export function formatRuntime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/** Format budget / revenue */
export function formatMoney(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000)     return `$${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000)         return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

/** Stagger animation delay for list items */
export function staggerDelay(index: number, base = 70): string {
  return `${index * base}ms`
}
