'use client'
import { SignInButton } from '@clerk/nextjs'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { LuTrash2, LuPenSquare } from 'react-icons/lu'

import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

type btnSize = 'default' | 'lg' | 'sm'

type Props = {
  className?: string
  text?: string
  size?: btnSize
}
export function SubmitButton({ className, text = 'submit', size = 'lg' }: Props) {
  const { pending } = useFormStatus()
  return (
    <Button
      disabled={pending}
      className={`capitalize ${className}`}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
          Please wait...{' '}
        </>
      ) : (
        text
      )}
    </Button>
  )
}

export function CardSignInButton() {
  return (
    <SignInButton mode='modal'>
      <Button
        type='button'
        size='icon'
        variant='outline'
        className='p-2 cursor-pointer'
        asChild
      >
        <FaRegHeart />
      </Button>
    </SignInButton>
  )
}

export function CardSubmitButton({ isFavorite }: { isFavorite: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button
      size='icon'
      variant='outline'
      className='p-2 cursor-pointer bg-transparent border-none'
      disabled={pending}
    >
      {pending ? (
        <ReloadIcon className='animate-spin' />
      ) : isFavorite ? (
        <FaHeart
          fill='tomato'
          style={{ width: '40px', height: '40px' }}
        />
      ) : (
        <FaRegHeart style={{ width: '40px', height: '40px' }} />
      )}
    </Button>
  )
}

export function IconButton({ actionType }: { actionType: 'edit' | 'delete' }) {
  const { pending } = useFormStatus()
  function ChosenIcon() {
    if (actionType === 'delete') {
      return <LuTrash2 />
    } else if (actionType === 'edit') {
      return <LuPenSquare />
    } else {
      const never: never = actionType
      throw new Error(`Invalid action type:${never}`)
    }
  }

  return (
    <Button
      type='submit'
      size='icon'
      variant='link'
      className='p-2 cursor-pointer'
    >
      {pending ? <ReloadIcon className='animate-spin' /> : <ChosenIcon />}
    </Button>
  )
}
