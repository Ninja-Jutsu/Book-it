import Link from 'next/link'
//Compo
import { EmptyList } from '@/components/home'
import { CountryFlagAndName } from '@/components/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Stats from '@/components/reservations/Stats'

//Actions
import { fetchReservations } from '@/utils/actions/reservationsActions'
//Help
import { formatDate, formatCurrency } from '@/utils/format'

async function ReservationPage() {
  const reservations = await fetchReservations()

  if (reservations.length === 0) {
    return (
      <EmptyList
        heading='You have no reservations yet yet!'
        btnText='Edit your properties?'
        btnLink='/rentals'
      />
    )
  }
  return (
    <>
      <Stats />
      <div className='mt-16'>
        <h4 className='mb-4 capitalize'>total reservations : {reservations.length}</h4>
        <Table>
          <TableCaption>A list of your recent reservations.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Property Name</TableHead>
              <TableHead>Reservation Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Nights</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map(({ id, orderTotal, totalNights, checkIn, checkOut, property }) => {
              const {
                id: propertyId,
                name,
                country,
                profile: { lastName },
              } = property

              const startDate = formatDate(checkIn)
              const endDate = formatDate(checkOut)
              return (
                <TableRow key={id}>
                  <TableCell>
                    <Link
                      href={`/properties/${propertyId}`}
                      className='underline text-muted-foreground tracking-wide'
                    >
                      {name}
                    </Link>
                  </TableCell>
                  <TableCell>{lastName}</TableCell>
                  <TableCell>
                    <CountryFlagAndName countryCode={country} />
                  </TableCell>
                  <TableCell>{totalNights}</TableCell>
                  <TableCell>{formatCurrency(orderTotal)}</TableCell>
                  <TableCell>{startDate}</TableCell>
                  <TableCell>{endDate}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default ReservationPage
