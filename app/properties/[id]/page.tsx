import FavoriteToggleBtn from '@/components/card/FavoriteToggleBtn'
import PropertyRating from '@/components/card/PropertyRating'
import BookingCalender from '@/components/properties/BookingCalender'
import BreadCrumbs from '@/components/properties/BreadCrumbs'
import ImageContainer from '@/components/properties/ImageContainer'
import PropertyDetails from '@/components/properties/PropertyDetails'
import ShareButton from '@/components/properties/ShareButton'
import UserInfo from '@/components/properties/UserInfo'
import { fetchPropertyDetails } from '@/utils/actions'
import { Separator } from '@/components/ui/separator'
import { redirect } from 'next/navigation'
import React from 'react'
import Description from '@/components/properties/Description'
import Amenities from '@/components/properties/Amenities'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const DynamicMap = dynamic(() => import('@/components/properties/PropertyMap'), {
  ssr: false,
  loading: () => <Skeleton className='h-[400px] w-full' />,
})

async function PropertyDetailsPage({ params: { id } }: { params: { id: string } }) {
  const property = await fetchPropertyDetails(id)

  if (!property) redirect('/')

  // destruct property details
  const {
    id: propertyId,
    baths,
    bedrooms,
    beds,
    guests,
    tagline,
    name,
    image,
    description,
    amenities,
    country,
  } = property

  // destruct profile details
  const {
    profile: { firstName, profileImage },
  } = property

  return (
    <section>
      <BreadCrumbs name={name} />
      <header className='flex justify-between items-center mt-4'>
        <h1 className='text-4xl font-bold capitalize'>{tagline}</h1>
        <div className='flex items-center gap-x-4'>
          {/* share button */}
          <ShareButton
            propertyId={propertyId}
            name={name}
          />
          <FavoriteToggleBtn propertyId={propertyId} />
        </div>
      </header>
      <ImageContainer
        name={name}
        mainImage={image}
      />
      <section className='lg:grid lg:grid-cols-12 gap-x-12 mt-12'>
        <div className='lg:col-span-8'>
          <div className='flex gap-x-4 items-center'>
            <h1 className='text-xl font-bold'>{property.name}</h1>
            <PropertyRating
              inPage
              propertyId={propertyId}
            />
          </div>
          <PropertyDetails details={{ baths, bedrooms, beds, guests }} />
          <UserInfo profile={{ firstName, profileImage }} />
          <Separator className='mt-4' />
          <Description description={description} />
          <Separator className='mt-4' />
          <Amenities amenities={amenities} />
          <Separator className='mt-4' />
          <DynamicMap countryCode={country} />
        </div>
        <div className='lg:col-span-4 flex flex-col items-center'>
          {/* calendar */}
          <BookingCalender />
        </div>
      </section>
    </section>
  )
}

export default PropertyDetailsPage
