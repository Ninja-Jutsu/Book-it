'use client'
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { icon } from 'leaflet'
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png'

import { findCountryByCode } from '@/utils/countries'
import CountryFlagAndName from '../card/CountryFlagAndName'
import Title from './Title'

const markerIcon = icon({
  iconUrl: iconUrl,
  iconSize: [20, 30],
})

import React from 'react'

function PropertyMap({ countryCode }: { countryCode: string }) {
  const defaultLocation = [31.7917, 7.0926] as [number, number]
  const location = findCountryByCode(countryCode)?.location as [number, number]
  return (
    <div className='mt-4'>
      <div className='mt-4'>
        <Title text='Where will you be staying:' />
        <CountryFlagAndName countryCode={countryCode} />
      </div>
      <MapContainer
        scrollWheelZoom={false}
        zoomControl={false}
        className='h-[50vh] rounded-lg relative z-0'
        center={location || defaultLocation}
        zoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ZoomControl position='bottomright' />
        <Marker
          position={location || defaultLocation}
          icon={markerIcon}
        />
      </MapContainer>
    </div>
  )
}

export default PropertyMap
