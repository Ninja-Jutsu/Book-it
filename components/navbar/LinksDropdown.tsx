// Shadcn UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'

import { auth } from '@clerk/nextjs/server'

// icons
import { LuAlignLeft } from 'react-icons/lu'
import UserIcon from './UserIcon'

// components
import SignOutLink from './SignOutLink'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'

import { links } from '@/utils/links'
function LinksDropdown() {
  const { userId } = auth()
  const isAdminUser = userId === process.env.ADMIN_ID
  return (
    <DropdownMenu>
      {/* must add asChild because trigger is already a button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='flex gap-4 max-w-[150px] md:h-16 md:w-32'
        >
          <LuAlignLeft className='w-6 h-6 md:w-8 md:h-8' />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-52'
        align='start'
        sideOffset={10}
      >
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode='modal'>
              <button className='w-full text-left'>Login</button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignUpButton mode='modal'>
              <button className='w-full text-left'>Register</button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>
        <SignedIn>
          {links.map((link) => {
            if (link.label === 'admin' && !isAdminUser) return null
            return (
              <DropdownMenuItem key={link.href}>
                <Link
                  href={link.href}
                  className='capitalize w-full'
                >
                  {link.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutLink />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LinksDropdown
