import EmptyList from '@/components/home/EmptyList'
import { deleteReviewAction, fetchPropertyReviewsByUser } from '@/utils/actions/reviewsActions'
import ReviewCard from '@/components/reviews/ReviewCard'
import Title from '@/components/properties/Title'
import FormContainer from '@/components/form/FormContainer'
import { IconButton } from '@/components/form/Buttons'

async function ReviewsPage() {
  const reviews = await fetchPropertyReviewsByUser()

  if (reviews.length === 0) return <EmptyList />

  return (
    <>
      <Title text='Your Reviews' />
      <section className='grid md:grid-cols-2 gap-8 mt-4'>
        {reviews.map(({ comment, id, property: { image, name }, rating }) => {
          return (
            <ReviewCard
              key={id}
              reviewInfo={{ comment, image, name, rating }}
            >
              <DeleteReview reviewId={id} />
            </ReviewCard>
          )
        })}
      </section>
    </>
  )
}

function DeleteReview({ reviewId }: { reviewId: string }) {
  const deleteAction = deleteReviewAction.bind(null, { reviewId })

  return (
    <FormContainer action={deleteAction}>
      <IconButton actionType='delete' />
    </FormContainer>
  )
}

export default ReviewsPage
