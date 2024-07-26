'use client'
import { useProperty } from '@/utils/store'
import ConfirmBooking from './ConfirmBooking'
import BookingForm from './BookingForm'

function BookingContainer() {
  const { range } = useProperty((state) => state)

  // if user hasn't selected a range display nothing
  if (!range || !range.from || !range.to) return null

  // if user selects less than one day display nothing
  if (range.to.getTime() === range.from.getTime()) return null
  return (
    <div className='w-full'>
      <BookingForm />
      <ConfirmBooking />
    </div>
  )
}

export default BookingContainer
