'use client'
import { Card, CardHeader } from '@/components/ui/card'
import { LuMinus, LuPlus } from 'react-icons/lu'

import { Button } from '../ui/button'
import { useState } from 'react'

function CounterInput({ label, defaultValue }: { label: string; defaultValue?: number }) {
  const [counter, setCounter] = useState(defaultValue || 0)

  function increaseCount() {
    setCounter((prevCount) => prevCount + 1)
  }
  function decreaseCount() {
    if (counter === 0) return
    setCounter((prevCount) => prevCount - 1)
  }
  return (
    <Card className='mb-4'>
      {/* input */}
      <input
        type='hidden'
        name={label}
        value={counter}
      />
      {/* Display */}
      <CardHeader className='flex flex-col gap-y-5'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col'>
            <h2 className='font-medium capitalize'>{label}</h2>
            <p className='text-muted-foreground text-sm'>Specify the number of {label}</p>
          </div>
          <div className='flex items-center gap-8'>
            <Button
              onClick={decreaseCount}
              variant='outline'
              size='icon'
              type='button'
              disabled={counter === 0}
            >
              <LuMinus className='w-5 h-5 text-primary' />
            </Button>
            <span className='text-xl font-medium w-5 text-center'>{counter}</span>
            <Button
              onClick={increaseCount}
              variant='outline'
              size='icon'
              type='button'
            >
              <LuPlus className='w-5 h-5 text-primary' />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default CounterInput
