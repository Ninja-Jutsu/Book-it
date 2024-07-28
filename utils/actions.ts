'use server'
import prisma from '@/prisma/client'
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { calculateTotals } from './calculateTotals'
import { formatDate } from './format'
import { createReviewSchema, imageSchema, profileSchema, propertySchema, validateWithZodSchema } from './schemas'
import { uploadImage } from './supabase'

export async function getCurrentUser() {
  const user = await currentUser()
  if (!user) throw new Error('You must be logged in to access this route')
  if (!user.privateMetadata.hasProfile) {
    redirect('/profile/create')
  }
  return user
}

export function renderError(error: unknown): { message: string } {
  console.log(error)
  return { message: error instanceof Error ? error.message : 'An error occurred' }
}

export async function createProfileAction(prevState: any, formData: FormData) {
  try {
    // get the currentUser
    const user = await currentUser()
    if (!user) throw new Error('please log to create a profile')

    //validate entries
    const rawData = Object.fromEntries(formData)
    const validatedData = validateWithZodSchema(profileSchema, rawData)

    // create a profile
    await prisma.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedData,
      },
    })

    //update user metadata in clerk users
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    })
  } catch (error) {
    return renderError(error)
  }
  // if all good redirect to home page
  redirect('/')
}

export async function fetchProfileImage() {
  const user = await currentUser()
  if (!user) return null
  const profile = await prisma.profile.findUnique({
    where: { clerkId: user.id },
    select: {
      profileImage: true,
    },
  })

  return profile?.profileImage
}

export async function fetchProfile() {
  const user = await getCurrentUser()

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  if (!profile) {
    redirect('/profile/create')
  }

  return profile
}

export async function updateProfileAction(prevState: any, formData: FormData): Promise<{ message: string }> {
  const user = await getCurrentUser()
  try {
    const rawData = Object.fromEntries(formData)
    const validatedData = validateWithZodSchema(profileSchema, rawData)

    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedData,
    })
    revalidatePath('/profile', 'page')
    return { message: 'Profile updated successfully' }
  } catch (error) {
    return renderError(error)
  }
}

export const updateProfileImageAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getCurrentUser()
  const image = formData.get('image') as File
  try {
    const imageData = validateWithZodSchema(imageSchema, { image })
    const imgUrl = await uploadImage(imageData.image)
    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: imgUrl,
      },
    })
    revalidatePath('/profile', 'page')
    return { message: 'Profile image updated successfully' }
  } catch (error) {
    return renderError(error)
  }
}

//@ Property
export const createPropertyAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getCurrentUser()
  try {
    const rawData = Object.fromEntries(formData)
    const file = formData.get('image') as File

    const validatedFields = validateWithZodSchema(propertySchema, rawData)
    // validatedFields.name = validatedFields.name.toLowerCase()
    const validatedFile = validateWithZodSchema(imageSchema, { image: file })
    const fullPath = await uploadImage(validatedFile.image)

    await prisma.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    })
  } catch (error) {
    return renderError(error)
  }
  redirect('/')
}

export async function fetchProperties({ search = '', category }: { search?: string; category?: string }) {
  const properties = await prisma.property.findMany({
    where: {
      category,
      OR: [{ name: { contains: search } }, { tagline: { contains: search } }],
    },
    select: {
      id: true,
      image: true,
      name: true,
      tagline: true,
      country: true,
      price: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return properties
}

export async function fetchPropertyDetails(id: string) {
  return await prisma.property.findUnique({
    where: { id },
    include: {
      profile: true,
      bookings: {
        select: {
          checkIn: true,
          checkOut: true,
        },
      },
    },
  })
}
//@ favorites

export async function fetchFavoriteId({ propertyId }: { propertyId: string }) {
  const user = await getCurrentUser()
  const favorite = await prisma.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  })

  return favorite?.id || null
}

export async function toggleFavoriteAction(prevState: {
  pathName: string
  favoriteId: string | null
  propertyId: string
}) {
  const { favoriteId, propertyId, pathName } = prevState
  const user = await getCurrentUser()
  try {
    if (favoriteId) {
      await prisma.favorite.delete({
        where: {
          id: favoriteId,
        },
      })
    } else {
      await prisma.favorite.create({
        data: {
          propertyId,
          profileId: user.id,
        },
      })
    }
    revalidatePath(pathName)
    return { message: favoriteId ? 'Removed from Faves' : 'Added to Faves' }
  } catch (error) {
    return renderError(error)
  }
}

export async function fetchFavorites() {
  const user = await getCurrentUser()
  const favorites = await prisma.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      property: {
        select: {
          id: true,
          image: true,
          name: true,
          tagline: true,
          country: true,
          price: true,
        },
      },
    },
  })

  return favorites.map((favorite) => favorite.property)
}


//@reviews
export async function createReviewAction(prevState: any, formData: FormData) {
  const currentUser = await getCurrentUser()
  const rawData = Object.fromEntries(formData)

  try {
    const validatedData = validateWithZodSchema(createReviewSchema, rawData)
    await prisma.review.create({
      data: {
        ...validatedData,
        profileId: currentUser.id,
      },
    })
    revalidatePath(`/properties/${validatedData.propertyId}`)
    return { message: 'Review submitted successfully' }
  } catch (error) {
    return renderError(error)
  }
}

export async function fetchPropertyReviews(propertyId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      rating: 'desc',
    },
  })
  return reviews
}

export async function fetchPropertyReviewsByUser() {
  const currentUser = await getCurrentUser()
  const reviews = await prisma.review.findMany({
    where: {
      profileId: currentUser.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return reviews
}

export async function deleteReviewAction(prevState: { reviewId: string }) {
  const currentUser = await getCurrentUser()
  try {
    await prisma.review.delete({
      where: {
        id: prevState.reviewId,
        profileId: currentUser.id,
      },
    })
    revalidatePath('/reviews')
    return { message: 'Review deleted successfully!' }
  } catch (error) {
    return renderError(error)
  }
}

export async function fetchPropertyRating(propertyId: string) {
  const result = await prisma.review.groupBy({
    by: ['propertyId'],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      propertyId,
    },
  })

  return { rating: result[0]?._avg.rating?.toFixed() ?? 0, count: result[0]?._count.rating ?? 0 }
}

export async function findExistingReview(userId: string, propertyId: string) {
  // we want the result to be null, otherwise user cannot submit review
  return prisma.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId,
    },
  })
}

//@bookings
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

//@ rentals
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

export const updatePropertyAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getCurrentUser()
  const propertyId = formData.get('id') as string

  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(propertySchema, rawData)
    await prisma.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        ...validatedFields,
      },
    })

    revalidatePath(`/rentals/${propertyId}/edit`)
    return { message: 'Update Successful' }
  } catch (error) {
    return renderError(error)
  }
}

export const updatePropertyImageAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getCurrentUser()
  const propertyId = formData.get('id') as string

  try {
    const image = formData.get('image') as File
    const validatedFields = validateWithZodSchema(imageSchema, { image })
    const fullPath = await uploadImage(validatedFields.image)

    await prisma.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        image: fullPath,
      },
    })
    revalidatePath(`/rentals/${propertyId}/edit`)
    return { message: 'Property Image Updated Successful' }
  } catch (error) {
    return renderError(error)
  }
}


//@ reservations
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

// Admin
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
