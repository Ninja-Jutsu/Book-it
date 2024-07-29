'use client'
import { Card, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

function Footer() {
  return (
    <footer className='footer container'>
      <Card className='flex flex-col items-center justify-center'>
        <CardHeader>&copy; 2024  Ninja Jutsu</CardHeader>
        <ul className='footer-links flex gap-10 mb-5'>
          <li className='hover:underline'>
            <Link href='/'>Home</Link>
          </li>
          <li className='hover:underline'>
            <Link href='/about'>About Us</Link>
          </li>
          <li className='hover:underline'>
            <Link href='/profilePage'>Contact Us</Link>
          </li>
        </ul>
      </Card>
    </footer>
  )
}

export default Footer
