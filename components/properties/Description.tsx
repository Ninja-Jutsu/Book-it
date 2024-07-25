'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Title from './Title'

function Description({ description }: { description: string }) {
  const [isFullDescShown, setFullDesc] = useState(false)

  const words = description.split(' ')
  const isLongDesc = words.length > 100

  const displayFullDesc = isLongDesc && !isFullDescShown ? words.splice(0, 100).join(' ') + '...' : description
  return (
    <article className='mt-4'>
      <Title text='Description' />
      <p className='text-muted-foreground font-light leading-loose'>{displayFullDesc}</p>

      {isLongDesc && (
        <Button
          onClick={() => setFullDesc(!isFullDescShown)}
          className='pl-0'
          variant='link'
        >
          {isFullDescShown ? 'Show less' : 'Show more'}
        </Button>
      )}
    </article>
  )
}

export default Description
