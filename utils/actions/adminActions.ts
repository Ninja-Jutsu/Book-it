import { getCurrentUser } from './actionsHelper/getCurrentUser'
import { redirect } from 'next/navigation'
import prisma from '@/prisma/client'
import { formatDate } from '../format'

async function getAdminUser() {
  const user = await getCurrentUser()
  if (user.id !== process.env.ADMIN_ID) redirect('/')
}

export async function fetchStats() {
  await getAdminUser()

  const usersCount = await prisma.profile.count()
  const propertiesCount = await prisma.property.count()
  const bookingsCount = await prisma.booking.count({
    where: {
      paymentStatus: true,
    },
  })

  return {
    usersCount,
    propertiesCount,
    bookingsCount,
  }
}

export async function fetchChartsData() {
  await getAdminUser()

  // checking data for the last 6 months
  const date = new Date()
  date.setMonth(date.getMonth() - 6)
  const sixMonthsAgo = date

  const bookings = await prisma.booking.findMany({
    where: {
      paymentStatus: true,
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  let bookingsPerMonth = bookings.reduce((total, current) => {
    const date = formatDate(current.createdAt, true)

    const existingEntry = total.find((entry) => entry.date === date)

    if (existingEntry) {
      existingEntry.count += 1
    } else {
      total.push({ date, count: 1 })
    }
    return total
  }, [] as Array<{ date: string; count: number }>)
  return bookingsPerMonth
}
