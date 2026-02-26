'use client'
import { useEffect } from 'react'
import { useLikedMovies } from '@/store/likedMovies'
import { useLang } from '@/hooks/useLang'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useLikedMovies.persist.rehydrate()
    useLang.persist.rehydrate()
  }, [])
  return <>{children}</>
}