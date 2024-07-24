import FormContainer from '@/components/form/FormContainer'
import { updateProfileAction, fetchProfileAction, updateProfileImageAction } from '@/utils/actions'
import FormInput from '@/components/form/FormInput'
import { SubmitButton } from '@/components/form/Buttons'
import ImageInputContainer from '@/components/form/ImageInputContainer'

async function ProfilePage() {
  const profile = await fetchProfileAction()

  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>user profile</h1>
      <div className='border p-8 rounded-md'>
        {/* image input container */}
        <ImageInputContainer
          action={updateProfileImageAction}
          image={profile.profileImage}
          name={profile.username}
          text='Update Profile Image'
        />
        <FormContainer action={updateProfileAction}>
          <div className='grid gap-4 md:grid-cols-2 mt-4 '>
            <FormInput
              inputType='text'
              inputId='firstName'
              label='First Name'
              defaultValue={profile.firstName}
            />
            <FormInput
              inputType='text'
              inputId='lastName'
              label='Last Name'
              defaultValue={profile.lastName}
            />
            <FormInput
              inputType='text'
              inputId='username'
              label='Username'
              defaultValue={profile.username}
            />
          </div>
          <SubmitButton
            text='Update Profile'
            className='mt-8'
            size='sm'
          />
        </FormContainer>
      </div>
    </section>
  )
}

export default ProfilePage
