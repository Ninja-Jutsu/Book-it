'use server'
import prisma from '@/prisma/client'
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { profileSchema } from './schemas'

export async function createProfileAction(prevState: any, formData: FormData) {
  try {
    // get the currentUser
    const user = await currentUser()
    // if (!user) throw new Error('please log to create a profile')
    // this is for typescript or use ! before user
    // this is a protected route, there is definitely a user if we get here

    // extract form data
    const rawData = Object.fromEntries(formData)
    const validatedFields = profileSchema.parse(rawData)

    // create a profile
    await prisma.profile.create({
      data: {
        clerkId: user!.id,
        email: user!.emailAddresses[0].emailAddress,
        profileImage: user!.imageUrl ?? '',
        ...validatedFields,
      },
    })
    await clerkClient.users.updateUserMetadata(user!.id, {
      privateMetadata: {
        hasProfile: true,
      },
    })
    // return { message: 'Profile created' }
  } catch (error) {
    console.log(error)
    return { message: error instanceof Error ? error.message : 'An error occurred' }
  }
  redirect('/')
}
