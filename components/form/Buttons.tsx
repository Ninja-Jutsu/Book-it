'use client'

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
