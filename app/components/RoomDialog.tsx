'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { supabase } from "../lib/supabase"
import { useToast } from "./ui/use-toast"
import { z } from "zod"

interface RoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoomAdded: () => void
  isAdditionalUrl?: boolean
}

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  calendar_url: z.string().url("Must be a valid URL"),
  description: z.string().optional()
})

export default function RoomDialog({ 
  open, 
  onOpenChange, 
  onRoomAdded,
  isAdditionalUrl = false 
}: RoomDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    calendar_url: '',
    description: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    try {
      roomSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('rooms')
        .insert([
          {
            name: formData.name,
            calendar_url: formData.calendar_url,
            description: formData.description || null,
            status: 'active',
            last_sync: new Date().toISOString()
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: isAdditionalUrl ? "Room URL added successfully" : "Room added successfully",
      })
      
      onRoomAdded()
      onOpenChange(false)
      setFormData({ name: '', calendar_url: '', description: '' })
      setErrors({})
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isAdditionalUrl ? 'Add New Room URL' : 'Add New Room'}
          </DialogTitle>
          <DialogDescription>
            Add a new room with Booking.com calendar synchronization
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter room name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendar_url">Booking.com XML URL</Label>
            <Input
              id="calendar_url"
              value={formData.calendar_url}
              onChange={(e) => setFormData(prev => ({ ...prev, calendar_url: e.target.value }))}
              placeholder="https://ical.booking.com/v1/export?t=..."
              className={errors.calendar_url ? "border-red-500" : ""}
            />
            {errors.calendar_url && (
              <p className="text-sm text-red-500 mt-1">{errors.calendar_url}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter room description"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : isAdditionalUrl ? 'Add URL' : 'Add Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 