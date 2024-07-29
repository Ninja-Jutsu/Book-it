import NavSearch from './NavSearch'
import Link from 'next/link'
import LinksDropdown from './LinksDropdown'
import DarkMode from './DarkMode'
import Logo from './Logo'
import { Neuton } from 'next/font/google'

const neuton = Neuton({ subsets: ['latin'], weight: '700' })

function Navbar() {
  return (
    <nav className='border-b container'>
      <div className='flex justify-between p-4 pb-2'>
        <div className='flex items-center gap-5 flex-wrap'>
          <Logo />
          <Link
            href='/'
            className={`${neuton.className} text-2xl text-nowrap`}
          >
            Book-it
          </Link>
        </div>
        <div className='flex gap-4 items-center'>
          <DarkMode />
          <LinksDropdown />
        </div>
      </div>
      <div className='container flex justify-center p-2'>
        <NavSearch />
      </div>
    </nav>
  )
}

export default Navbar
