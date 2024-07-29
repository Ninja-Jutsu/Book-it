import { GiCampingTent } from 'react-icons/gi'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Neuton } from 'next/font/google'
function Logo() {
  return (
    <Button
      className='w-[55px] h-[55px]'
      asChild
      size='icon'
    >
      <Link href='/'>
        <GiCampingTent
          className='w-[50px] h-[50px]'
          fill='white'
        />
      </Link>
    </Button>
  )
}

export default Logo
