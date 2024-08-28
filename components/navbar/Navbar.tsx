import NavSearch from './NavSearch'
import Link from 'next/link'
import LinksDropdown from './LinksDropdown'
import DarkMode from './DarkMode'
import Logo from './Logo'
import { Neuton } from 'next/font/google'

const neuton = Neuton({ subsets: ['latin'], weight: '700' })

function Navbar() {
  return (
    <nav className='border-b container mb-5'>
      <div className='flex justify-between p-4 pb-2'>
        {/* Logo */}
        <div className='flex items-center gap-5 md:relative group'>
          <Logo />
          <Link
            href='/'
            className={`${neuton.className} text-2xl md:text-3xl text-nowrap md:absolute md:opacity-0 md:top-[25%] md:right-0 group-hover:opacity-100 md:group-hover:translate-x-[125%] transition-all duration-300 ease-in`}
          >
            Book-it
          </Link>
        </div>
        {/* Search Bar For large Screens*/}
        <div className='container hidden md:flex justify-center p-2 items-center md:mx-4'>
          <NavSearch />
        </div>
        {/* Login & DarkMode */}
        <div className='flex gap-4 items-center'>
          <DarkMode />
          <LinksDropdown />
        </div>
      </div>
      {/* Search Bar For small Screens*/}
      <div className='container flex md:hidden justify-center p-2 items-center md:mx-4'>
        <NavSearch />
      </div>
    </nav>
  )
}

export default Navbar
