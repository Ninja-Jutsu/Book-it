// Compo
import { FormInput, FormContainer } from '@/components/form'
import { SubmitButton } from '@/components/form/Buttons'
//Actions
import { createProfileAction } from '@/utils/actions/profileActions'

async function CreateProfilePage() {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>new user</h1>
      <div className='border p-8 rounded-md'>
        <FormContainer action={createProfileAction}>
          <div className='grid md:grid-cols-2 gap-4 mt-4'>
            <FormInput
              inputId={'firstName'}
              label='First Name'
              inputType='text'
            />
            <FormInput
              inputId={'lastName'}
              label='Last Name'
              inputType='text'
            />
            <FormInput
              inputId={'username'}
              label='Username'
              inputType='text'
            />
          </div>
          <SubmitButton
            text='create profile'
            className='mt-8'
          />
        </FormContainer>
      </div>
    </section>
  )
}

export default CreateProfilePage
