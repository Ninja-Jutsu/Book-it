import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { auth } from '@clerk/nextjs/server'
//Compo
import { FavoriteToggleBtn, PropertyRating } from '@/components/card'
import {
  BreadCrumbs,
  ImageContainer,
  PropertyDetails,
  // ShareButton,
  UserInfo,
  Description,
  Amenities,
} from '@/components/properties'
import { SubmitReview, PropertyReviews } from '@/components/reviews'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
//Actions
import { findExistingReview } from '@/utils/actions/reviewsActions'
import { fetchPropertyDetails } from '@/utils/actions/propertyActions'

// Cancel SSR :
const DynamicMap = dynamic(() => import('@/components/properties/PropertyMap'), {
  ssr: false,
  loading: () => <Skeleton className='h-[400px] w-full' />,
})

const DynamicBookingWrapper = dynamic(() => import('@/components/booking/BookingWrapper'), {
  ssr: false,
  loading: () => <Skeleton className='h-[200px] w-full' />,
})

const DynamicShareButton = dynamic(() => import('@/components/properties/ShareButton'), {
  ssr: false,
  loading: () => <Skeleton className='h-[200px] w-full' />,
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
    price,
    bookings,
    profile: { firstName, profileImage, clerkId },
  } = property

  const { userId } = auth()
  const isNotOwner = clerkId !== userId
  const reviewDoesNotExist = userId && isNotOwner && !(await findExistingReview(userId, propertyId))

  return (
    <section>
      <BreadCrumbs name={name} />
      <header className='flex justify-between items-center mt-4'>
        <h1 className='text-4xl font-bold capitalize'>{tagline}</h1>
        <div className='flex items-center gap-x-4'>
          <DynamicShareButton
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
            <h1 className='text-xl font-bold'>{name}</h1>
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
          <DynamicBookingWrapper
            bookings={bookings}
            price={price}
            propertyId={propertyId}
          />
        </div>
      </section>
      {reviewDoesNotExist && <SubmitReview propertyId={propertyId} />}
      <PropertyReviews propertyId={propertyId} />
    </section>
  )
}

export default PropertyDetailsPage
