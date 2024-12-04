'use client'

import { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Booking } from '../../types/booking'

moment.locale('en-GB')
const localizer = momentLocalizer(moment)

interface BookingCalendarProps {
  bookings: Booking[]
}

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [date, setDate] = useState(new Date())

  const events = bookings.map(booking => ({
    title: `Room ${booking.roomNumber}`,
    start: new Date(booking.checkIn),
    end: new Date(booking.checkOut),
  }))

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        onNavigate={newDate => setDate(newDate)}
        views={['month', 'week', 'day']}
      />
    </div>
  )
}

