'use server'
import prisma from '@/prisma/client'
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { profileSchema } from './schemas'

async function getCurrentUser() {
  const user = await currentUser()
  if (!user) throw new Error('You must be logged in to access this route')
  if (!user.privateMetadata.hasProfile) redirect('/profile/create')
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
    const validatedFields = profileSchema.parse(rawData)

    // create a profile
    await prisma.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields,
      },
    })

    //update user metadata in clerk users
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    })
  } catch (error) {
    console.log(error)
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

export async function fetchProfileAction() {
  const user = await getCurrentUser()

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  if (!profile) redirect('/profile/create')

  return profile
}

export async function updateProfileAction(prevState: any, formData: FormData): Promise<{ message: string }> {
  const user = await getCurrentUser()
  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = profileSchema.parse(rawData)
    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    })
    revalidatePath('/profile', 'page')
    return { message: 'Profile updated successfully' }
  } catch (error) {
    return renderError(error)
  }
}
