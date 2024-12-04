import { Booking } from '../../types/booking'

interface BookingListProps {
  bookings: Booking[]
}

export default function BookingList({ bookings }: BookingListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Guest
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Room
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check-in
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check-out
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap">{booking.guestName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{booking.roomNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.checkIn).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.checkOut).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

