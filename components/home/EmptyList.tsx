import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

function EmptyList({
  heading = 'No items in the list',
  message = 'Keep exploring our properties',
  btnText = 'back home',
  btnLink = '/',
}: Props) {
  return (
    <div className='mt-4'>
      <h2 className='text-xl font-bold'>{heading}</h2>
      <p className='text-lg'>{message}</p>
      <Button
        asChild
        className='mt-4 capitalize'
        size='lg'
      >
        <Link href={btnLink}>{btnText}</Link>
      </Button>
    </div>
  )
}

export default EmptyList

interface Props {
  heading?: string
  message?: string
  btnText?: string
  btnLink?: string
}
