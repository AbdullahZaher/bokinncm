'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { supabase } from "../lib/supabase"
import { useToast } from "./ui/use-toast"
import { z } from "zod"

interface EditRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoomUpdated: () => void
  room: Room | null
}

interface Room {
  id: string
  name: string
  calendar_url: string
  description?: string
  updated_at?: string
}

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  calendar_url: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
  updated_at: z.string().optional()
})

export default function EditRoomDialog({
  open,
  onOpenChange,
  onRoomUpdated,
  room
}: EditRoomDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    calendar_url: '',
    description: ''
  })

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || '',
        calendar_url: room.calendar_url || '',
        description: room.description || ''
      })
    }
  }, [room])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!room) return

    setIsLoading(true)

    try {
      const updateData = {
        name: formData.name,
        calendar_url: formData.calendar_url,
        description: formData.description,
        updated_at: new Date().toISOString()
      }

      const validationResult = roomSchema.safeParse(updateData)
      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0].message)
      }

      const { error } = await supabase
        .from('rooms')
        .update(updateData)
        .eq('id', room.id)
        .select()

      if (error) throw error

      toast({
        title: "Success",
        description: "Room updated successfully",
      })
      
      onRoomUpdated()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Update error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update room",
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
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>
            Update room details and calendar synchronization
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendar_url">Bokinn.app XML URL</Label>
            <Input
              id="calendar_url"
              value={formData.calendar_url}
              onChange={(e) => setFormData(prev => ({ ...prev, calendar_url: e.target.value }))}
              placeholder="https://ical.bokinn.app/v1/export?t=..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter room description"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 