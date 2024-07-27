import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { formatDate } from '@/utils/format'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest, res: NextResponse) {
  // in order for this route to work locally & when pushed to production
  const reqHeaders = new Headers(req.headers)
  const origin = reqHeaders.get('origin') // localhost || vercel...

  const { bookingId } = await req.json()
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })
  if (!booking) return NextResponse.json(null, { status: 404, statusText: 'Not Found' })

  const {
    checkIn,
    checkOut,
    orderTotal,
    totalNights,
    property: { image, name },
  } = booking

  // Communicate with stripe === Create a session
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      metadata: { bookingId: booking.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${name}`,
              images: [image],
              description: `Stay in this wonderful place for ${totalNights} nights, from ${formatDate(
                checkIn
              )} to ${formatDate(checkOut)}. Enjoy your stay!`,
            },
            unit_amount: orderTotal * 100,
          },
        },
      ],
      mode: 'payment',
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    })

    return Response.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.log(error)
    return NextResponse.json(null, { status: 500, statusText: 'Internal Payment Server Error' })
  }
}
