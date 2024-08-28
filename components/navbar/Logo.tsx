import { GiCampingTent } from 'react-icons/gi'
import { Button } from '../ui/button'
import Link from 'next/link'
function Logo() {
  return (
    <Button
      className='w-max h-max z-10 dark:bg-transparent hover:dark:bg-slate-900'
      asChild
      size='icon'
    >
      <Link href='/'>
        <GiCampingTent
          className='w-[50px] h-[50px] md:w-[90px] md:h-[90px] p-1'
          fill='white'
        />
      </Link>
    </Button>
  )
}

export default Logo
