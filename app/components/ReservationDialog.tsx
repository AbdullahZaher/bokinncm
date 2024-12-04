'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { supabase } from "../lib/supabase"
import { useToast } from "./ui/use-toast"
import { z } from "zod"
import { addDays } from "date-fns"

const reservationSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Invalid email address"),
  checkIn: z.date(),
  checkOut: z.date(),
})

interface ReservationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId: string
  roomPrice: number
  onReservationAdded: () => void
}

export default function ReservationDialog({
  open,
  onOpenChange,
  roomId,
  roomPrice,
  onReservationAdded
}: ReservationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time part to midnight

  const handleCheckInSelect = (date: Date | undefined) => {
    if (!date) return
    setFormData(prev => ({
      ...prev,
      checkIn: date,
      // Reset checkout if it's before or equal to the new check-in date
      checkOut: prev.checkOut && prev.checkOut <= date ? undefined : prev.checkOut
    }))
  }

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (!date) return
    setFormData(prev => ({
      ...prev,
      checkOut: date
    }))
  }

  const checkAvailability = async (checkIn: Date, checkOut: Date) => {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('room_id', roomId)
      .gte('check_out', format(checkIn, 'yyyy-MM-dd'))
      .lte('check_in', format(checkOut, 'yyyy-MM-dd'))
      .neq('status', 'cancelled')

    if (error) throw error
    return data.length === 0
  }

  const calculateTotalPrice = (checkIn: Date, checkOut: Date) => {
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return days * roomPrice
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validate form data
      reservationSchema.parse(formData)

      if (!formData.checkIn || !formData.checkOut) {
        throw new Error("Please select check-in and check-out dates")
      }

      // Check if dates are valid
      if (formData.checkIn >= formData.checkOut) {
        throw new Error("Check-out date must be after check-in date")
      }

      // Check availability
      const isAvailable = await checkAvailability(formData.checkIn, formData.checkOut)
      if (!isAvailable) {
        throw new Error("Room is not available for selected dates")
      }

      // Calculate total price
      const totalPrice = calculateTotalPrice(formData.checkIn, formData.checkOut)

      // Insert reservation
      const { error } = await supabase
        .from('reservations')
        .insert([
          {
            room_id: roomId,
            guest_name: formData.guestName,
            guest_email: formData.guestEmail,
            check_in: format(formData.checkIn, 'yyyy-MM-dd'),
            check_out: format(formData.checkOut, 'yyyy-MM-dd'),
            total_price: totalPrice,
            status: 'confirmed',
            source: 'direct'
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Reservation added successfully",
      })
      
      onReservationAdded()
      onOpenChange(false)
      setFormData({
        guestName: '',
        guestEmail: '',
        checkIn: undefined,
        checkOut: undefined,
      })
    } catch (error: any) {
      const message = error.message || "An error occurred"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(newErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Reservation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
              className={errors.guestName ? "border-red-500" : ""}
            />
            {errors.guestName && (
              <p className="text-sm text-red-500">{errors.guestName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestEmail">Guest Email</Label>
            <Input
              id="guestEmail"
              type="email"
              value={formData.guestEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, guestEmail: e.target.value }))}
              className={errors.guestEmail ? "border-red-500" : ""}
            />
            {errors.guestEmail && (
              <p className="text-sm text-red-500">{errors.guestEmail}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkIn ? format(formData.checkIn, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.checkIn}
                  onSelect={(date) => {
                    handleCheckInSelect(date)
                  }}
                  fromDate={today}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkOut ? format(formData.checkOut, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.checkOut}
                  onSelect={(date) => {
                    handleCheckOutSelect(date)
                  }}
                  fromDate={formData.checkIn || today}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {formData.checkIn && formData.checkOut && (
            <div className="text-sm text-muted-foreground">
              Total: ${calculateTotalPrice(formData.checkIn, formData.checkOut).toFixed(2)}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Reservation"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 