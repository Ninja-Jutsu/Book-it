import { Suspense } from 'react'
import { StatsLoadingContainer, StatsContainer, ChartsLoadingContainer, ChartsContainer } from '@/components/admin'

function AdminPage() {
  return (
    <div>
      <Suspense fallback={<StatsLoadingContainer />}>
        <StatsContainer />
      </Suspense>
      <Suspense fallback={<ChartsLoadingContainer />}>
        <ChartsContainer />
      </Suspense>
    </div>
  )
}

export default AdminPage
