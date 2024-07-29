import { Suspense } from 'react'
import { CategoriesList, PropertiesContainer } from '@/components/home'
import { LoadingCards } from '@/components/card'

async function HomePage({ searchParams }: { searchParams: { category?: string; search?: string } }) {
  return (
    <section>
      <CategoriesList
        category={searchParams.category}
        search={searchParams.search}
      />
      <Suspense fallback={<LoadingCards />}>
        <PropertiesContainer
          category={searchParams.category}
          search={searchParams.search}
        />
      </Suspense>
    </section>
  )
}

export default HomePage
