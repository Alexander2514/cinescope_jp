import { Suspense } from 'react'
import CategoryContent from './CategoryContent'


export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent />
    </Suspense>
  )
}