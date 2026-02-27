import { Suspense } from 'react'
import SearchContent from './SearchContent'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-white/40">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}