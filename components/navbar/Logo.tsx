import { GiCampingTent } from 'react-icons/gi'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Neuton } from 'next/font/google'
function Logo() {
  return (
    <Button
      asChild
      size='icon'
    >
      <Link href='/'>
        <GiCampingTent className='w-6 h-6' />
      </Link>
    </Button>
  )
}

export default Logo
