import { formatQuantity } from '@/utils/format'

type PropertyDetailsProps = {
  details: {
    bedrooms: number
    baths: number
    guests: number
    beds: number
  }
}

function PropertyDetails({ details: { baths, bedrooms, beds, guests } }: PropertyDetailsProps) {
  return (
    <p className='text-md font-light'>
      <span>{formatQuantity(guests, 'guest')} &middot; </span>
      <span>{formatQuantity(bedrooms, 'bedroom')} &middot; </span>
      <span>{formatQuantity(beds, 'bed')} &middot; </span>
      <span>{formatQuantity(baths, 'bath')} </span>
    </p>
  )
}

export default PropertyDetails
