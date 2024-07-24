import { FaHeart } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

function FavoriteToggleBtn({ propertyId }: { propertyId: string }) {
  return (
    <Button
      size='icon'
      variant='outline'
      className='p-2 cursor-pointer'
    >
      <FaHeart />
    </Button>
  )
}
export default FavoriteToggleBtn
