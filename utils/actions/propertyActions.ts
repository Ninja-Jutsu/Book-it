'use server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from './actionsHelper/getCurrentUser'
import renderError from './actionsHelper/renderError'
import { imageSchema, propertySchema, validateWithZodSchema } from '../schemas'
import prisma from '@/prisma/client'
import { uploadImage } from '../supabase'
import { revalidatePath } from 'next/cache'

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
