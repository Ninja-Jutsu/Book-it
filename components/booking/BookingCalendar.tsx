'use client'
import { Calendar } from '@/components/ui/calendar'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { DateRange } from 'react-day-picker'
import { useProperty } from '@/utils/store'

import { generateDisabledDates, generateDateRange, defaultSelected, generateBlockedPeriods } from '@/utils/calendar'

function BookingCalendar() {
  const currentDate = new Date()
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected)
  const bookings = useProperty((state) => state.bookings)

  const { toast } = useToast()

  // Force restart calendar if selected range include already reserved dates
  const blockedPeriods = generateBlockedPeriods({ bookings, today: currentDate })
  const unavailableDates = generateDisabledDates(blockedPeriods)

  //! check the outcome
  // console.log(blockedPeriods)
  // console.log(unavailableDates)

  useEffect(() => {
    const alreadySelectedDates = generateDateRange(range)
    alreadySelectedDates.forEach((date) => {
      if (unavailableDates[date]) {
        setRange(defaultSelected)
        toast({
          description: 'Some dates are booked. Please select again.',
        })
        return
      }
    })

    // every time we select a range => update the range in the Zustand state
    useProperty.setState({
      range,
    })
  }, [range])
  return (
    <Calendar
      mode='range'
      defaultMonth={currentDate}
      selected={range}
      onSelect={setRange}
      className='mb-4'
      disabled={blockedPeriods}
    />
  )
}

export default BookingCalendar
