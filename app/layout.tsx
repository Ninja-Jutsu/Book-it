import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })
// compo
import Navbar from '@/components/navbar/Navbar'
import Providers from './providers'
import Footer from './Footer'

export const metadata: Metadata = {
  title: 'Book-it',

  description: 'Feel home, away from home',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang='en'
        suppressHydrationWarning
      >
        <body className={inter.className}>
          <Providers>
            <Navbar />
            <main className='container py-10 pt-0'>{children}</main>
          </Providers>
        </body>
        <Footer />
      </html>
    </ClerkProvider>
  )
}
