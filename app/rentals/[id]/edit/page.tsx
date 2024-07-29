import { fetchRentalDetails } from '@/utils/actions/rentalsActions'
import { updatePropertyImageAction, updatePropertyAction } from '@/utils/actions/propertyActions'
import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import CategoriesInput from '@/components/form/CategoriesInput'
import PriceInput from '@/components/form/PriceInput'
import TextAreaInput from '@/components/form/TextAreaInput'
import CountriesInput from '@/components/form/CountriesInput'
import CounterInput from '@/components/form/CounterInput'
import Amenities from '@/components/form/Amenities'
import { SubmitButton } from '@/components/form/Buttons'
import { redirect } from 'next/navigation'
import { type Amenity } from '@/utils/amenities'
import ImageInputContainer from '@/components/form/ImageInputContainer'
async function EditRentalPage({ params: { id } }: { params: { id: string } }) {
  const property = await fetchRentalDetails(id)
  if (!property) redirect('/')
  const defaultAmenities: Amenity[] = JSON.parse(property.amenities)

  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>
        <div className='border p-8 rounded-md'>
          <ImageInputContainer
            name={property.name}
            text='Upload Image'
            action={updatePropertyImageAction}
            image={property.image}
          >
            <input
              type='hidden'
              name='id'
              value={property.id}
            />
          </ImageInputContainer>
          <FormContainer action={updatePropertyAction}>
            <input
              type='hidden'
              name='id'
              value={property.id}
            />
            <div className='grid md:grid-cols-2 gap-8 mb-4 mt-8'>
              <FormInput
                inputId='name'
                inputType='text'
                label='Name (20 limit)'
                defaultValue={property.name}
              />
              <FormInput
                inputId='tagline'
                inputType='text '
                label='Tagline (30 limit)'
                defaultValue={property.tagline}
              />
              <PriceInput defaultValue={property.price} />
              <CategoriesInput defaultValue={property.category} />
              <CountriesInput defaultValue={property.country} />
            </div>
            <TextAreaInput
              name='description'
              labelText='Description (10 - 100 Words)'
              defaultValue={property.description}
            />
            <h3 className='text-lg mt-8 mb-4 font-medium'>Accommodation Details</h3>
            <CounterInput
              label='guests'
              defaultValue={property.guests}
            />
            <CounterInput
              label='bedrooms'
              defaultValue={property.bedrooms}
            />
            <CounterInput
              label='beds'
              defaultValue={property.beds}
            />
            <CounterInput
              label='baths'
              defaultValue={property.baths}
            />
            <h3 className='text-lg mt-10 mb-6 font-medium'>Amenities</h3>
            <Amenities defaultValue={defaultAmenities} />
            <SubmitButton
              text='edit property'
              className='mt-12'
            />
          </FormContainer>
        </div>
      </h1>
    </section>
  )
}

export default EditRentalPage
