'use server'
import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { calculateTotals } from '../calculateTotals'

import { getCurrentUser, renderError } from '../actions'
export async function createBookingAction(prevState: { propertyId: string; checkIn: Date; checkOut: Date }) {
  const currentUser = await getCurrentUser()

  await prisma.booking.deleteMany({
    where: {
      profileId: currentUser.id,
      paymentStatus: false,
    },
  })

  let bookingId: null | string = null

  const { propertyId, checkIn, checkOut } = prevState
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    select: {
      price: true,
    },
  })
  if (!property) return { message: 'Property not found!' }

  const { orderTotal, totalNights } = calculateTotals({ checkIn, checkOut, price: property.price })

  try {
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        checkIn,
        checkOut,
        profileId: currentUser.id,
        orderTotal,
        totalNights,
      },
    })
    bookingId = booking.id
  } catch (error) {
    return renderError(error)
  }
  redirect(`/checkout?bookingId=${bookingId}`)
}

export const fetchBookings = async () => {
  const user = await getCurrentUser()
  const bookings = await prisma.booking.findMany({
    where: {
      profileId: user.id,
      paymentStatus: true,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
    },
    orderBy: {
      checkIn: 'desc',
    },
  })
  return bookings
}

export async function deleteBookingAction(prevState: { bookingId: string }) {
  const { bookingId } = prevState
  const user = await getCurrentUser()

  try {
    await prisma.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    })

    revalidatePath('/bookings')
    return { message: 'Booking deleted successfully' }
  } catch (error) {
    return renderError(error)
  }
}
