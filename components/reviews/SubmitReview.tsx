'use client'
import { useState } from 'react'
import { SubmitButton } from '@/components/form/Buttons'
import FormContainer from '@/components/form/FormContainer'
import { Card } from '@/components/ui/card'
import RatingInput from '@/components/form/RatingInput'
import TextAreaInput from '@/components/form/TextAreaInput'
import { Button } from '@/components/ui/button'
import { createReviewAction } from '@/utils/actions/reviewsActions'

function SubmitReview({ propertyId }: { propertyId: string }) {
  const [isFormVisible, setFormVisible] = useState(false)

  return (
    <div className='mt-8'>
      <Button
        onClick={() => {
          setFormVisible(!isFormVisible)
        }}
      >
        Leave Review
      </Button>
      {isFormVisible && (
        <Card className='p-8 mt-8'>
          <FormContainer action={createReviewAction}>
            <input
              type='hidden'
              name='propertyId'
              value={propertyId}
            />
            <RatingInput name='rating' />
            <TextAreaInput
              name='comment'
              labelText='your thoughts on this property'
            />
            <SubmitButton
              className='mt-4'
              text='Submit'
            />
          </FormContainer>
        </Card>
      )}
    </div>
  )
}

export default SubmitReview
