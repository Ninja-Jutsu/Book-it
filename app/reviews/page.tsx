//Compo
import { EmptyList } from '@/components/home'
import { ReviewCard } from '@/components/reviews'
import { Title } from '@/components/properties'
import { FormContainer } from '@/components/form'
import { IconButton } from '@/components/form/Buttons'
//Actions
import { deleteReviewAction, fetchPropertyReviewsByUser } from '@/utils/actions/reviewsActions'

async function ReviewsPage() {
  const reviews = await fetchPropertyReviewsByUser()
  if (reviews.length === 0) return <EmptyList />

  return (
    <>
      <Title text='Your Reviews' />
      <section className='grid md:grid-cols-2 gap-8 mt-4'>
        {reviews.map(({ comment, id, property, rating }) => {
          const { image, name } = property
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
