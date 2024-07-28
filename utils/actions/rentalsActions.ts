'use server'
import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { getCurrentUser, renderError } from '../actions'

export const fetchRentals = async () => {
  const user = await getCurrentUser()
  const rentals = await prisma.property.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  })

  const rentalsWithBookingSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalNightsSum = await prisma.booking.aggregate({
        where: {
          propertyId: rental.id,
          paymentStatus: true,
        },
        _sum: {
          totalNights: true,
        },
      })

      const orderTotalSum = await prisma.booking.aggregate({
        where: {
          propertyId: rental.id,
        },
        _sum: {
          orderTotal: true,
        },
      })

      return {
        ...rental,
        totalNightsSum: totalNightsSum._sum.totalNights,
        orderTotalSum: orderTotalSum._sum.orderTotal,
      }
    })
  )

  return rentalsWithBookingSums
}

export async function deleteRentalAction(prevState: { propertyId: string }) {
  const { propertyId } = prevState
  const user = await getCurrentUser()

  try {
    await prisma.property.delete({
      where: {
        id: propertyId,
        profileId: user.id,
      },
    })

    revalidatePath('/rentals')
    return { message: 'Rental deleted successfully' }
  } catch (error) {
    return renderError(error)
  }
}

export const fetchRentalDetails = async (propertyId: string) => {
  const user = await getCurrentUser()

  return prisma.property.findUnique({
    where: {
      id: propertyId,
      profileId: user.id,
    },
  })
}
