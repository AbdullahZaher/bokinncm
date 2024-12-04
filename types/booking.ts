export interface Booking {
  id: string
  guestName: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled'
}

