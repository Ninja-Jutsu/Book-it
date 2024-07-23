import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import FormInput from '@/components/form/FormInput'

async function createdProfileAction(formData: FormData) {
  'use server'
  const firstName = formData.get('firstName') as string
  console.log(firstName)
}

function CreateProfilePage() {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>new user</h1>
      <div className='border p-8 rounded-md max-w-lg'>
        <form action={createdProfileAction}>
          <FormInput
            inputId={'firstName'}
            label='First Name'
            inputType='text'
          />
          <Button size='lg'>Create Profile</Button>
        </form>
      </div>
    </section>
  )
}

export default CreateProfilePage
