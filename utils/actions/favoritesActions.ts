'use server'
import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './actionsHelper/getCurrentUser'
import renderError from './actionsHelper/renderError'

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
