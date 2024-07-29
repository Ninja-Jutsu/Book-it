import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StatsLoadingContainer() {
  return (
    <div className='mt-8 grid md:grid-cols-2 gap-4 lg:grid-cols-3'>
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  )
}

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='w-full h-20 rounded' />
      </CardHeader>
    </Card>
  )
}

