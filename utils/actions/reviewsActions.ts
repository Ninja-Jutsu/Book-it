'use server'
import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { getCurrentUser, renderError } from '../actions'
import { createReviewSchema, validateWithZodSchema } from '../schemas'

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
