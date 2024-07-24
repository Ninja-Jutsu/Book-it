import FormInput from '@/components/form/FormInput'
import FormContainer from '@/components/form/FormContainer'
import { createPropertyAction } from '@/utils/actions'
import { SubmitButton } from '@/components/form/Buttons'

function CreateRentalPage() {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>create property</h1>
      <div className='border p-8 rounded'>
        <h3 className='text-lg mb-4 font-medium'>General Info</h3>
        <FormContainer action={createPropertyAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
            <FormInput
              inputId='name'
              inputType='text'
              label='Name (20 limit)'
              defaultValue='Cabin in Morocco'
            />
            <FormInput
              inputId='tagline'
              inputType='text'
              label='Tagline (30 limit)'
              defaultValue='Dream Getaway'
            />
            {/* {price} */}
            {/* {categories} */}
          </div>
          {/* text area, description */}
          <SubmitButton
            text='create rental'
            className='mt-12'
          />
        </FormContainer>
      </div>
    </section>
  )
}

export default CreateRentalPage
