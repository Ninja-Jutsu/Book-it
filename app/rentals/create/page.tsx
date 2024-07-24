import FormInput from '@/components/form/FormInput'
import FormContainer from '@/components/form/FormContainer'
import { createPropertyAction } from '@/utils/actions'
import { SubmitButton } from '@/components/form/Buttons'
import PriceInput from '@/components/form/PriceInput'
import CategoriesInput from '@/components/form/CategoriesInput'
import TextAreaInput from '@/components/form/TextAreaInput'
import CountriesInput from '@/components/form/CountriesInput'
import ImageInput from '@/components/form/ImageInput'
import CounterInput from '@/components/form/CounterInput'

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
            {/* price */}
            <PriceInput />
            {/* categories */}
            <CategoriesInput />
          </div>
          {/* text area, description */}
          <TextAreaInput
            name='description'
            labelText='description (10 - 1000 words)'
          />
          <div className='grid sm:grid-cols-2 gap-8 mt-4'>
            <CountriesInput />
            <ImageInput />
          </div>
          <h3 className='text-lg mt-8 mb-4 font-medium'>Accommodation details</h3>
          <CounterInput label='guests' />
          <CounterInput label='bedrooms' />
          <CounterInput label='beds' />
          <CounterInput label='baths' />
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
