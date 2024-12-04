import { NextResponse } from 'next/server'
import { Booking } from '@/types/booking'

export async function GET() {
  const mockBookings: Booking[] = [
    {
      id: '1',
      guestName: 'John Doe',
      roomNumber: '101',
      checkIn: '2023-06-01',
      checkOut: '2023-06-05',
    },
    {
      id: '2',
      guestName: 'Jane Smith',
      roomNumber: '202',
      checkIn: '2023-06-03',
      checkOut: '2023-06-07',
    },
    // Add more mock bookings as needed
  ]

  return NextResponse.json(mockBookings)
}

