'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { TrendingItem } from '@/lib/types'

interface LikedMoviesState {
  items: Record<number, TrendingItem>

  // Actions
  toggle: (item: TrendingItem) => void
  isLiked: (id: number) => boolean
  getAll: () => TrendingItem[]
  clear: () => void
}

export const useLikedMovies = create<LikedMoviesState>()(
  persist(
    (set, get) => ({
      items: {},

      toggle(item) {
        set((state) => {
          const next = { ...state.items }
          if (next[item.id]) {
            delete next[item.id]
          } else {
            next[item.id] = item
          }
          return { items: next }
        })
      },

      isLiked(id) {
        return id in get().items
      },

      getAll() {
        return Object.values(get().items)
      },

      clear() {
        set({ items: {} })
      },
    }),
    {
      name: 'cinescope_liked',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
