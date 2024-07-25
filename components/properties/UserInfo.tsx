import Image from 'next/image'

type UserInfoProps = {
  profile: {
    profileImage: string
    firstName: string
  }
}

function UserInfo({ profile: { firstName, profileImage } }: UserInfoProps) {
  return (
    <article className='grid grid-cols-[auto,1fr] gap-4 mt-4'>
      <Image
        src={profileImage}
        alt={firstName}
        width={50}
        height={50}
        className='w-12 h-12 rounded object-cover'
      />
      <div>
        <p>
          Hosted by <span className='font-bold'>{firstName}</span>
        </p>
        <p className='text-muted-foreground font-light'>Hosting since 2024</p>
      </div>
    </article>
  )
}

export default UserInfo
