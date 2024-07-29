//Compo
import {
  FormInput,
  FormContainer,
  PriceInput,
  CategoriesInput,
  TextAreaInput,
  CountriesInput,
  ImageInput,
  CounterInput,
  AmenitiesInput,
} from '@/components/form'
import { SubmitButton } from '@/components/form/Buttons'
//Actions
import { createPropertyAction } from '@/utils/actions/propertyActions'

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
            />
            <FormInput
              inputId='tagline'
              inputType='text'
              label='Tagline (30 limit)'
            />
            <PriceInput />
            <CategoriesInput />
          </div>
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
          <h3 className='text-lg mt-8 mb-4 font-medium'>Amenities</h3>
          <AmenitiesInput />
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
