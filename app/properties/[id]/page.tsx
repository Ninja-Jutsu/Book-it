
import FavoriteToggleBtn from '@/components/card/FavoriteToggleBtn'
import BreadCrumbs from '@/components/properties/BreadCrumbs'
import ShareButton from '@/components/properties/ShareButton'
import { fetchPropertyDetails } from '@/utils/actions'
import { redirect } from 'next/navigation'
import React from 'react'

async function PropertyDetailsPage({ params: { id } }: { params: { id: string } }) {
  const property = await fetchPropertyDetails(id)

  if (!property) redirect('/')

  const { id: propertyId, baths, bedrooms, beds, guests, tagline, name } = property
  const details = { baths, bedrooms, beds, guests }
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
    </section>
  )
}

export default PropertyDetailsPage
