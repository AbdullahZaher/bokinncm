'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { supabase } from "../lib/supabase"
import { useToast } from "./ui/use-toast"

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookingAdded: () => void
}

export default function BookingDialog({
  open,
  onOpenChange,
  onBookingAdded
}: BookingDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [rooms, setRooms] = useState([])
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    roomId: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
  })

  const fetchRooms = async () => {
    const { data } = await supabase.from('rooms').select('*').eq('available', true)
    setRooms(data || [])
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const checkAvailability = async (roomId: string, checkIn: Date, checkOut: Date) => {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('room_id', roomId)
      .neq('status', 'cancelled')
      .or(`and(check_in.lte.${format(checkOut, 'yyyy-MM-dd')},check_out.gte.${format(checkIn, 'yyyy-MM-dd')})`)

    if (error) throw error
    return data.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.checkIn || !formData.checkOut) {
        throw new Error("Please select check-in and check-out dates")
      }

      // Check if dates are valid
      if (formData.checkIn >= formData.checkOut) {
        throw new Error("Check-out date must be after check-in date")
      }

      // Check availability
      const isAvailable = await checkAvailability(formData.roomId, formData.checkIn, formData.checkOut)
      if (!isAvailable) {
        throw new Error("Room is not available for selected dates")
      }

      const { error } = await supabase
        .from('reservations')
        .insert([
          {
            room_id: formData.roomId,
            guest_name: formData.guestName,
            guest_email: formData.guestEmail,
            check_in: format(formData.checkIn, 'yyyy-MM-dd'),
            check_out: format(formData.checkOut, 'yyyy-MM-dd'),
            status: 'confirmed'
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Booking added successfully",
      })
      
      onBookingAdded()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Room</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, roomId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - ${room.price}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rest of the form fields similar to ReservationDialog */}
          {/* ... */}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 