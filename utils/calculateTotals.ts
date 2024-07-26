import { calculateDaysBetween } from '@/utils/calendar'

type BookingDetails = {
  checkIn: Date
  checkOut: Date
  price: number
}

export function calculateTotals({ checkIn, checkOut, price }: BookingDetails) {
  const totalNights = calculateDaysBetween({ checkIn, checkOut })
  const subTotal = totalNights * price
  const cleaning = 15
  const service = 25
  const GST = subTotal * 0.9
  const orderTotal = subTotal + cleaning + service + GST
  return { totalNights, subTotal, cleaning, service, GST, orderTotal }
}
