import { calculateTotals } from '@/utils/calculateTotals'
import { Card, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useProperty } from '@/utils/store'
import { formatCurrency } from '@/utils/format'
function BookingForm() {
  const { range, price } = useProperty((state) => state)
  const checkIn = range?.from as Date
  const checkOut = range?.to as Date

  const { orderTotal, GST, cleaning, service, subTotal, totalNights } = calculateTotals({ checkIn, checkOut, price })

  return (
    <Card className='p-8 mb-4'>
      <CardTitle className='mb-8'>Summary</CardTitle>
      <FormRow
        label={`${price} x ${totalNights} nights`}
        amount={subTotal}
      />
      <FormRow
        label='Cleaning fee'
        amount={cleaning}
      />
      <FormRow
        label='Service fee'
        amount={service}
      />
      <FormRow
        label='GST'
        amount={GST}
      />
      <Separator />
      <CardTitle className='mt-4'>
        <FormRow
          label='Total Amount'
          amount={orderTotal}
        />
      </CardTitle>
    </Card>
  )
}

function FormRow({ label, amount }: { label: string; amount: number }) {
  return (
    <p className='flex justify-between text-sm mb-2'>
      <span className='font-semibold'>{label}</span>
      <span className='font-semibold'>{amount}</span>
    </p>
  )
}

export default BookingForm
