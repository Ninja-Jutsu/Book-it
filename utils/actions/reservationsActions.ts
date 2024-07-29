'use server'
import { getCurrentUser } from './actionsHelper/getCurrentUser'
import prisma from '@/prisma/client'

export const fetchReservations = async () => {
  const user = await getCurrentUser()

  const reservations = await prisma.booking.findMany({
    where: {
      paymentStatus: true,
      property: {
        profileId: user.id,
      },
    },

    orderBy: {
      createdAt: 'desc', // or 'asc' for ascending order
    },

    include: {
      property: {
        select: {
          id: true,
          name: true,
          price: true,
          country: true,
          profile: {
            select: {
              lastName: true,
            },
          },
        },
      }, // include property details in the result
    },
  })
  return reservations
}

export const fetchReservationStats = async () => {
  const user = await getCurrentUser()
  const properties = await prisma.property.count({
    where: {
      profileId: user.id,
    },
  })

  const totals = await prisma.booking.aggregate({
    where: {
      property: {
        profileId: user.id,
      },
    },
    // what I need:
    _sum: {
      orderTotal: true,
      totalNights: true,
    },
  })

  return {
    properties,
    nights: totals._sum.totalNights || 0,
    amount: totals._sum.orderTotal || 0,
  }
}
