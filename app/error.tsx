'use client'
import Link from 'next/link'

import React from 'react'

function error({ error }: { error: Error }) {
  return (
    <div>
      <p>{error.message}</p>
      <Link href='/'>Homepage</Link>
    </div>
  )
}

export default error
