'use client'

import { useState, useEffect } from 'react'
import BookingCalendar from './BookingCalendar'
import BookingList from './BookingList'
import { Booking } from '../../types/booking'

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    fetchBookings()
  }, [])

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BookingCalendar bookings={bookings} />
        <BookingList bookings={bookings} />
      </div>
    </div>
  )
}

