import React, { Suspense } from 'react'
import StatsLoadingContainer from '../../components/admin/Loading'
import StatsContainer from '@/components/admin/StatsContainer'
import { ChartsLoadingContainer } from '../../components/admin/Loading'
import ChartsContainer from '@/components/admin/ChartsContainer'

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
