'use server'
import prisma from '@/prisma/client'
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { imageSchema, profileSchema, propertySchema, validateWithZodSchema, createReviewSchema } from './schemas'
import { uploadImage } from './supabase'

export async function getCurrentUser() {
  const user = await currentUser()
  if (!user) throw new Error('You must be logged in to access this route')
  if (!user.privateMetadata.hasProfile) {
    redirect('/profile/create')
  }
  return user
}

function renderError(error: unknown): { message: string } {
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

export async function fetchPropertyDetails(id: string) {
  return await prisma.property.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  })
}

export const createReviewAction = async (prevState: any, formData: FormData) => {
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

export const fetchPropertyReviews = async (propertyId: string) => {
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

export const fetchPropertyReviewsByUser = async () => {
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

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
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

export const findExistingReview = async (userId: string, propertyId: string) => {
  // we want the result to be null, otherwise user cannot submit review
  return prisma.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId,
    },
  })
}
