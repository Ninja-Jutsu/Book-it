import z, { ZodSchema } from 'zod'

export const profileSchema = z.object({
  firstName: z.string().min(2, { message: 'First Name minimum value length is 2' }),
  lastName: z.string().min(2, { message: 'Last Name minimum value length is 2' }),
  username: z.string().min(2, { message: 'Username minimum value length is 2' }),
})

export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message)
    throw new Error(errors[0])
  }
  return result.data
}
