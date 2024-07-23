// Shadcn UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'

// icons
import { LuAlignLeft } from 'react-icons/lu'
import UserIcon from './UserIcon'

// components
import SignOutLink from './SignOutLink'
import Link from 'next/link'

import { links } from '@/utils/links'
function LinksDropdown() {
  return (
    <DropdownMenu>
      {/* must add asChild because trigger is already a button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='flex gap-4 max-w-[100px]'
        >
          <LuAlignLeft className='w-6 h-6' />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-52'
        align='start'
        sideOffset={10}
      >
        {links.map((link) => {
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LinksDropdown
