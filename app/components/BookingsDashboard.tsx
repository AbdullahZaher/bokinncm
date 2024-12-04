'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Booking } from '../../types/booking'

const mockBookings: Booking[] = [
  { id: '1', guestName: 'John Doe', roomNumber: '101', checkIn: '2023-06-01', checkOut: '2023-06-05' },
  { id: '2', guestName: 'Jane Smith', roomNumber: '202', checkIn: '2023-06-03', checkOut: '2023-06-07' },
  { id: '3', guestName: 'Bob Johnson', roomNumber: '303', checkIn: '2023-06-05', checkOut: '2023-06-10' },
  { id: '4', guestName: 'Alice Brown', roomNumber: '404', checkIn: '2023-06-07', checkOut: '2023-06-12' },
  { id: '5', guestName: 'Charlie Davis', roomNumber: '505', checkIn: '2023-06-10', checkOut: '2023-06-15' },
]

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBookings = bookings.filter(booking =>
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomNumber.includes(searchTerm)
  )

  const today = new Date().toISOString().split('T')[0]
  const upcomingCheckIns = bookings.filter(booking => booking.checkIn >= today)
  const upcomingCheckOuts = bookings.filter(booking => booking.checkOut >= today)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-
2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCheckIns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Check-outs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCheckOuts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{100 - bookings.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all" className="flex-grow">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-grow">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="flex-grow">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="w-full sm:w-auto space-y-1.5">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by guest name or room number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
            <Button className="w-full sm:w-auto">Add New Booking</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Room Number</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.guestName}</TableCell>
                      <TableCell>{booking.roomNumber}</TableCell>
                      <TableCell>{booking.checkIn}</TableCell>
                      <TableCell>{booking.checkOut}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add a list or table of upcoming bookings here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add a list or table of past bookings here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

