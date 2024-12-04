'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import RoomDialog from './RoomDialog'
import { supabase } from '../lib/supabase'
import { useToast } from "./ui/use-toast"
import RoomCalendar from './RoomCalendar'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import EditRoomDialog from './EditRoomDialog'
import { Badge } from "./ui/badge"

interface Room {
  id: string
  name: string
  description: string
  available: boolean
  calendar_url: string
  bookingdotcom_xml_url?: string
  distribution_link?: string
  price: number
}

export default function RoomsClient() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null)
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'bokinn' | 'booking'>('all')

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*, bookingdotcom_xml_url')
        .order('name', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      setRooms(data)
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch rooms: " + error.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteRoom = async (roomId: string) => {
    try {
      // First, delete related records from xml_access_logs
      const { error: logsError } = await supabase
        .from('xml_access_logs')
        .delete()
        .eq('room_id', roomId)

      if (logsError) throw logsError

      // Then delete the room
      const { error: roomError } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId)

      if (roomError) throw roomError

      toast({
        title: "Room deleted",
        description: "Room and associated data have been successfully deleted",
      })

      // Refresh the rooms list
      fetchRooms()
    } catch (error: any) {
      console.error('Error deleting room:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete room",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (roomId: string) => {
    setRoomToDelete(roomId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (roomToDelete) {
      await handleDeleteRoom(roomToDelete)
      setDeleteDialogOpen(false)
      setRoomToDelete(null)
    }
  }

  const handleEditClick = (room: Room) => {
    setRoomToEdit(room)
    setEditDialogOpen(true)
  }

  const getFilteredRooms = () => {
    console.log('Calendar Filter:', calendarFilter)
    
    const filtered = filteredRooms.filter(room => {
      switch (calendarFilter) {
        case 'bokinn':
          const hasBokinn = room.calendar_url?.toLowerCase().includes('bokinn.app')
          console.log(`Room ${room.name} has bokinn:`, hasBokinn)
          return hasBokinn
        case 'booking':
          const hasBooking = room.bookingdotcom_xml_url?.toLowerCase().includes('booking.com')
          console.log(`Room ${room.name} has booking:`, hasBooking)
          return hasBooking
        default:
          return true
      }
    })
    
    console.log('Filtered Rooms:', filtered)
    return filtered
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>
      
      <RoomDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onRoomAdded={fetchRooms}
      />

      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="max-w-sm space-y-1.5">
            <Label htmlFor="search">Search Rooms</Label>
            <Input
              id="search"
              placeholder="Search by room name or type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{room.name}</CardTitle>
                </CardHeader>
                <CardContent  className="text-center">
                  <p className="text-sm">{room.description}</p>
                  <p className={`text-sm ${room.available ? "text-green-600" : "text-red-600"}`}>
                    {room.available ? "Available" : "Not Available"}
                  </p>
                  {room.distribution_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        navigator.clipboard.writeText(room.distribution_link!)
                        toast({
                          title: "Copied",
                          description: "Distribution link copied to clipboard",
                        })
                      }}
                    >
                      Copy XML Link
                    </Button>
                  )}
                </CardContent>
                <CardFooter className="mt-auto">
                  <div className="flex justify-center w-full gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(room)}
                      title="Edit Room"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(room.id)}
                      title="Delete Room"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-center justify-end gap-2">
                {calendarFilter !== 'all' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCalendarFilter('all')}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Badge 
                  variant="secondary" 
                  className={`bg-bokinn text-white hover:bg-bokinn cursor-pointer ${
                    calendarFilter === 'bokinn' ? 'ring-2 ring-offset-2' : ''
                  }`}
                  onClick={() => setCalendarFilter(calendarFilter === 'bokinn' ? 'all' : 'bokinn')}
                >
                  bokinn.app {calendarFilter === 'bokinn' && '(active)'}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`bg-booking text-white hover:bg-booking cursor-pointer ${
                    calendarFilter === 'booking' ? 'ring-2 ring-offset-2' : ''
                  }`}
                  onClick={() => setCalendarFilter(calendarFilter === 'booking' ? 'all' : 'booking')}
                >
                  Booking.com {calendarFilter === 'booking' && '(active)'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredRooms().map((room) => (
              <div key={room.id} className="w-full">
                <RoomCalendar
                  roomId={room.id}
                  roomName={room.name}
                  roomPrice={room.price}
                  calendarUrl={room.calendar_url}
                  calendarFilter={calendarFilter}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Room"
        description="This action cannot be undone. This will permanently delete the room and all associated logs and data."
      />

      <EditRoomDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onRoomUpdated={fetchRooms}
        room={roomToEdit}
      />
    </div>
  )
}

