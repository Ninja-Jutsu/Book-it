import React from 'react'
import { fetchProperties } from '@/utils/actions'
import PropertiesList from './PropertiesList'
import EmptyList from './EmptyList'
import type { PropertyCardProps } from '@/utils/types'

type Props = {
  category?: string
  search?: string
}

async function PropertiesContainer({ category, search }: Props) {
  const properties: PropertyCardProps[] = await fetchProperties({ category, search })

  if (properties.length === 0) {
    return (
      <EmptyList
        heading='No result.'
        message='Try changing or removing filters'
        btnText='Clear Filter'
      />
    )
  }

  return <PropertiesList />
}

export default PropertiesContainer
