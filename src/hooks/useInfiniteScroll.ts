'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Options {
  onLoadMore: () => Promise<void>
  hasMore: boolean
  threshold?: number   // px from bottom to trigger
  delay?: number       // throttle delay ms
  enabled?: boolean
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  threshold = 350,
  delay = 250,
  enabled = true,
}: Options) {
  const loading = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = useCallback(async () => {
    if (!enabled || loading.current || !hasMore) return
    if (timeoutRef.current) return // throttled

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold

    if (!nearBottom) return

    loading.current = true
    await onLoadMore()
    loading.current = false

    // Throttle: block re-trigger for `delay` ms
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
    }, delay)
  }, [enabled, hasMore, onLoadMore, threshold, delay])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [handleScroll])
}
