'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { supabase } from "../lib/supabase"
import { useToast } from "./ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"

const BookingsClient = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    roomId: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchBookings = async () => {
    try {
      // 1. جلب الحجوزات المباشرة من قاعدة البيانات
      const { data: dbBookings, error: dbError } = await supabase
        .from('reservations')
        .select('*, rooms(name)')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      // 2. جلب الغرف مع روابط XML
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .or('calendar_url.neq.null,bookingdotcom_xml_url.neq.null');

      if (roomsError) throw roomsError;

      // 3. جلب وتحويل بيانات XML من جميع المصادر
      const xmlBookings = await Promise.all(
        rooms.map(async (room) => {
          const bookings = [];

          // جلب من Bokinn.app
          if (room.calendar_url) {
            try {
              const response = await fetch(`/api/calendar?url=${encodeURIComponent(room.calendar_url)}`);
              const xmlData = await response.text();
              const parsedBookings = parseXMLtoBookings(xmlData);
              bookings.push(...parsedBookings.map(booking => ({
                ...booking,
                source: 'bokinn.app',
                rooms: { name: room.name }
              })));
            } catch (error) {
              console.error('Error fetching Bokinn.app calendar:', error);
            }
          }

          // جلب من Booking.com
          if (room.bookingdotcom_xml_url) {
            try {
              const response = await fetch(`/api/calendar?url=${encodeURIComponent(room.bookingdotcom_xml_url)}`);
              const xmlData = await response.text();
              const parsedBookings = parseXMLtoBookings(xmlData);
              bookings.push(...parsedBookings.map(booking => ({
                ...booking,
                source: 'booking.com',
                rooms: { name: room.name }
              })));
            } catch (error) {
              console.error('Error fetching Booking.com calendar:', error);
            }
          }

          return bookings;
        })
      );

      // 4. دمج جميع الحجوزات
      const allBookings = [
        ...(dbBookings || []),
        ...xmlBookings.flat()
      ];

      setBookings(allBookings);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Failed to fetch bookings
        </div>
      });
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('available', true)

      if (error) {
        throw error
      }

      setRooms(data || [])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Failed to fetch rooms
        </div>
      })
      console.error('Error fetching rooms:', error)
    }
  }

  useEffect(() => {
    fetchBookings()
    fetchRooms()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.roomId) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Please select a room
          </div>
        })
        return
      }

      if (!formData.guestName) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Please enter guest name
          </div>
        })
        return
      }

      if (!formData.guestEmail) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Please enter guest email
          </div>
        })
        return
      }

      if (!formData.checkIn || !formData.checkOut) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Please select check-in and check-out dates
          </div>
        })
        return
      }

      const selectedRoom = rooms.find(room => room.id === formData.roomId)
      const nights = Math.ceil(
        (formData.checkOut.getTime() - formData.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      )
      const totalPrice = selectedRoom.price * nights

      const { error } = await supabase
        .from('reservations')
        .insert([
          {
            room_id: formData.roomId,
            guest_name: formData.guestName,
            guest_email: formData.guestEmail,
            check_in: format(formData.checkIn, 'yyyy-MM-dd'),
            check_out: format(formData.checkOut, 'yyyy-MM-dd'),
            total_price: totalPrice,
            status: 'confirmed'
          }
        ])

      if (error) {
        console.error('Insertion error:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error.message}
          </div>
        })
        return
      }

      toast({
        title: "Booking Successful",
        description: <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          {`Reservation created for ${formData.guestName}`}
        </div>
      })
      
      fetchBookings()
      setDialogOpen(false)
      setFormData({
        guestName: '',
        guestEmail: '',
        roomId: '',
        checkIn: undefined,
        checkOut: undefined,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          An unexpected error occurred. Please try again.
        </div>
      })
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.rooms.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const parseXMLtoBookings = (xmlData: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const reservations = xmlDoc.getElementsByTagName("reservation");
    
    return Array.from(reservations).map(res => ({
      guest_name: res.getElementsByTagName("guest")[0]?.textContent || '',
      check_in: res.getElementsByTagName("start_date")[0]?.textContent || '',
      check_out: res.getElementsByTagName("end_date")[0]?.textContent || '',
      status: res.getElementsByTagName("status")[0]?.textContent || 'confirmed',
      room_name: res.getElementsByTagName("room_name")[0]?.textContent || ''
    }));
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="max-w-sm space-y-1.5">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by guest name or room"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id || `${booking.guest_name}-${booking.check_in}`}>
                  <TableCell className="font-medium">{booking.guest_name}</TableCell>
                  <TableCell>{booking.rooms.name}</TableCell>
                  <TableCell>{format(new Date(booking.check_in), 'PPP')}</TableCell>
                  <TableCell>{format(new Date(booking.check_out), 'PPP')}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    <Badge variant={booking.source === 'booking.com' ? 'default' : 'secondary'}>
                      {booking.source || 'direct'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  )
}

export default BookingsClient 