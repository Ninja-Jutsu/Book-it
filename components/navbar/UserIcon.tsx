/* eslint-disable @next/next/no-img-element */
import { FaUserTie } from 'react-icons/fa6'
import { fetchProfileImage } from '@/utils/actions/profileActions'
async function UserIcon() {
  const profileImage = await fetchProfileImage()
  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt='user profile image'
        className='w-6 h-6 rounded-full object-cover'
      />
    )
  }
  return <FaUserTie className='w-6 h-6 bg-primary rounded-full text-white' />
}

export default UserIcon
