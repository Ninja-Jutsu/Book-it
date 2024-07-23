'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

type Props = {
  className?: string
  text?: string
}
export function SubmitButton({ className, text = 'submit' }: Props) {
  const { pending } = useFormStatus()
  return (
    <Button
      disabled={pending}
      className={`capitalize ${className}`}
      size='lg'
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
