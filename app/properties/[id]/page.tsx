import { fetchPropertyDetails } from '@/utils/actions'
import { redirect } from 'next/navigation'
import React from 'react'

async function PropertyDetailsPage({ params: { id } }: { params: { id: string } }) {
  const property = await fetchPropertyDetails(id)

  if (!property) redirect('/')

  const { baths, bedrooms, beds, guests } = property
  const details = { baths, bedrooms, beds, guests }
  return <div>{id}</div>
}

export default PropertyDetailsPage
