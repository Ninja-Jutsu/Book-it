import Link from 'next/link'

//Components
import { EmptyList } from '@/components/home'
import { CountryFlagAndName } from '@/components/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FormContainer } from '@/components/form'
import { IconButton } from '@/components/form/Buttons'

//actions
import { fetchBookings, deleteBookingAction } from '@/utils/actions/bookingsActions'

// helpers
import { formatDate, formatCurrency } from '@/utils/format'

async function BookingsPage() {
  const bookings = await fetchBookings()
  if (bookings.length === 0)
    return (
      <EmptyList
        heading='You have no bookings yet!'
        btnText='Homepage'
      />
    )
  return (
    <div className='mt-16'>
      <h4 className='font-bold text-xl mb-4 capitalize'>total bookings : {bookings.length}</h4>
      <Table>
        <TableCaption>A list of your recent bookings</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(({ id, orderTotal, totalNights, checkIn, checkOut, property }) => {
            const { id: propertyId, name: propertyName, country } = property
            const startDate = formatDate(checkIn)
            const endDate = formatDate(checkOut)
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link
                    href={`/properties/${propertyId}`}
                    className='underline text-muted-foreground tracking-wide'
                  >
                    {propertyName}
                  </Link>
                </TableCell>
                <TableCell>
                  <CountryFlagAndName countryCode={country} />
                </TableCell>
                <TableCell>{totalNights}</TableCell>
                <TableCell>{formatCurrency(orderTotal)}</TableCell>
                <TableCell>{startDate}</TableCell>
                <TableCell>{endDate}</TableCell>
                <TableCell>
                  <DeleteBooking bookingId={id} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function DeleteBooking({ bookingId }: { bookingId: string }) {
  const deleteBooking = deleteBookingAction.bind(null, { bookingId })
  return (
    <FormContainer action={deleteBooking}>
      <IconButton actionType='delete' />
    </FormContainer>
  )
}

export default BookingsPage
