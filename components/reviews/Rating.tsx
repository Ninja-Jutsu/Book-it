import { FaStar, FaRegStar } from 'react-icons/fa'

function Rating({ rating }: { rating: number }) {
  const stars = new Array(rating).fill('star')
  return (
    <div className='flex items-center gap-x-1'>
      {stars.map((index, star) => {
        return (
          <FaStar
            key={index}
            className='w-3 h-3 text-indigo-400'
          />
        )
      })}
    </div>
  )
}

export default Rating
