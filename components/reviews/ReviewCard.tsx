import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import Rating from './Rating'
import Comment from './Comment'
interface Props {
  reviewInfo: {
    comment: string
    rating: number
    name: string
    image: string
  }
  children?: React.ReactNode
}
function ReviewCard({ reviewInfo: { comment, image, name, rating }, children }: Props) {
  return (
    <Card className='relative'>
      <CardHeader>
        <div className='flex items-center '>
          <Image
            src={image}
            alt={name}
            width={50}
            height={50}
            className='w-12 h-12 rounded-full object-cover'
          />
          <div className='ml-4 flex flex-col justify-items-center'>
            <h3 className='text-sm font-bold capitalize mb-1'>{name}</h3>
            <Rating rating={rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Comment comment={comment} />
      </CardContent>
      {/* delete button */}
      <div className='absolute top-3 right-3'>{children}</div>
    </Card>
  )
}

export default ReviewCard
