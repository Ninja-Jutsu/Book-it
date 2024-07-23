import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar/Navbar'

//components

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Get-Home',
  description: 'Feel home, away from home',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Navbar />
        <main className='container py-10'>{children}</main>
      </body>
    </html>
  )
}
