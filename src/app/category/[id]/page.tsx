import { Suspense } from 'react'
import CategoryContent from './CategoryContent'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent />
    </Suspense>
  )
}