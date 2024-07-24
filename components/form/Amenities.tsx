'use client'
import { useState } from 'react'
import { amenities, conservativeAmenities, Amenity } from '@/utils/amenities'
import { Checkbox } from '@/components/ui/checkbox'

export default function AmenitiesInput({ defaultValue }: { defaultValue?: Amenity[] }) {
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(defaultValue || conservativeAmenities)

  function handleChange(amenity: Amenity) {
    setSelectedAmenities((prev) => {
      return prev.map((a) => {
        if (a.name === amenity.name) {
          return { ...a, selected: !a.selected }
        }
        return a
      })
    })
  }
  return (
    <section>
      <input
        type='hidden'
        name='amenities'
        value={JSON.stringify(selectedAmenities)}
      />
      <div className='grid grid-cols-2 gap-4'>
        {selectedAmenities.map((amenity) => {
          return (
            <div
              key={amenity.name}
              className='flex items-center space-x-2'
            >
              <Checkbox
                id={amenity.name}
                checked={amenity.selected}
                onCheckedChange={() => handleChange(amenity)}
                className='rounded'
              />
              <label
                htmlFor={amenity.name}
                className='text-sm font-medium leading-none flex gap-x-2 items-center capitalize'
              >
                {amenity.name} <amenity.icon className='w-4 h-4' />
              </label>
            </div>
          )
        })}
      </div>
      <h1 className='text-xl'></h1>
    </section>
  )
}
