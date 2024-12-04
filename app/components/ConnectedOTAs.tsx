import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Plus, Eye, Copy, Trash2, Pencil, Check, Loader2 } from 'lucide-react'
import { OTAConnection } from '../../types/integration'
import { formatDateTime } from '../utils/dateFormatting'
import ConnectionDialog from './ConnectionDialog'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { cn } from '../../lib/utils'
import { useToast } from "./ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import AgodaConnectionDialog from './AgodaConnectionDialog'
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface ConnectedOTAsProps {
  connections: OTAConnection[]
  onConnectionUpdate: (updatedConnections: OTAConnection[]) => void
}

// Add utility function to shorten URL
const shortenUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    return `${domain}${urlObj.pathname.slice(0, 15)}...`
  } catch {
    // If URL is invalid, return shortened original string
    return url.length > 30 ? `${url.slice(0, 30)}...` : url
  }
}

export default function ConnectedOTAs({ connections, onConnectionUpdate }: ConnectedOTAsProps) {
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)
  const [showAgodaDialog, setShowAgodaDialog] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<OTAConnection | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [isAddingUrl, setIsAddingUrl] = useState(false)
  const [viewPropertiesDialog, setViewPropertiesDialog] = useState(false)
  const [selectedProperties, setSelectedProperties] = useState<any[]>([])
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null)
  const [editedRoomName, setEditedRoomName] = useState("")
  const [editedCalendarUrl, setEditedCalendarUrl] = useState("")
  const [availableRooms, setAvailableRooms] = useState<string[]>([])

  useEffect(() => {
    const fetchPropertyCounts = async () => {
      try {
        const { data: channelConnections, error } = await supabase
          .from('channel_connections')
          .select('channel_id, id')

        if (error) throw error

        // Update connections with property counts
        const updatedConnections = connections.map(conn => ({
          ...conn,
          propertyCount: channelConnections.filter(c => c.channel_id === conn.id).length
        }))

        onConnectionUpdate(updatedConnections)
      } catch (error) {
        console.error('Error fetching property counts:', error)
      }
    }

    fetchPropertyCounts()
  }, []) // Run on component mount

  const handleConnect = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId)
    if (connection) {
      setSelectedConnection(connection)
      setShowConnectionDialog(true)
    }
  }

  const handleDisconnect = async (connectionId: string) => {
    setIsLoading(true)
    try {
      // Delete connection data from Supabase
      const { error: deleteError } = await supabase
        .from('channel_connections')
        .delete()
        .eq('channel_id', connectionId)

      if (deleteError) throw deleteError

      // Log the disconnection
      const connection = connections.find(c => c.id === connectionId)
      const { error: logError } = await supabase
        .from('sync_logs')
        .insert([
          {
            channel_id: connectionId,
            channel_name: connection?.name || '',
            timestamp: new Date().toISOString(),
            status: 'success',
            details: `Disconnected from ${connection?.name}`
          }
        ])

      if (logError) throw logError

      // Update local state
      const updatedConnections = connections.map(conn =>
        conn.id === connectionId
          ? {
              ...conn,
              status: 'disconnected',
              lastSync: null,
              propertyCount: 0
            }
          : conn
      )

      onConnectionUpdate(updatedConnections as OTAConnection[])
      
      toast({
        title: "Disconnected successfully",
        description: `Successfully disconnected from ${connection?.name}`,
      })
    } catch (error) {
      console.error('Error disconnecting:', error)
      toast({
        title: "Disconnection failed",
        description: "There was an error disconnecting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProperty = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId)
    if (connection) {
      setSelectedConnection(connection)
      setIsAddingUrl(true)
      setShowConnectionDialog(true)
    }
  }

  const handleConnectionSubmit = async (data: { roomName: string, calendarUrl: string }) => {
    if (!selectedConnection) return

    setIsLoading(true)
    try {
      // Get room ID
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id')
        .eq('name', data.roomName)
        .single()

      if (roomError) throw roomError
      if (!roomData) throw new Error('Room not found')

      // Update room based on channel
      let updateData = {}
      if (selectedConnection.id === '1') { // Booking.com
        updateData = { bookingdotcom_xml_url: data.calendarUrl }
      } else if (selectedConnection.id === '3') { // Airbnb
        updateData = { airbnb_calendar_url: data.calendarUrl }
      } else if (selectedConnection.id === '2') { // Expedia
        updateData = { expedia_calendar_url: data.calendarUrl }
      } else if (selectedConnection.id === '4') { // Google Calendar
        updateData = { google_calendar_url: data.calendarUrl }
      } else if (selectedConnection.id === '6') { // TripAdvisor
        updateData = { tripadvisor_calendar_url: data.calendarUrl }
      } else if (selectedConnection.id === '7') { // Gathern
        updateData = { gathern_calendar_url: data.calendarUrl }
      } else if (selectedConnection.id === '8') { // Trip.com
        updateData = { tripcom_calendar_url: data.calendarUrl }
      }

      // Update room with channel-specific URL
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('rooms')
          .update({ 
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', roomData.id)

        if (updateError) throw updateError
      }

      // Add connection to channel_connections
      const { error: connectionError } = await supabase
        .from('channel_connections')
        .insert([
          {
            channel_id: selectedConnection.id,
            channel_name: selectedConnection.name,
            room_name: data.roomName,
            calendar_url: data.calendarUrl,
            status: 'connected',
            last_sync: new Date().toISOString()
          }
        ])

      if (connectionError) throw connectionError

      // تسجيل العملية
      const { error: logError } = await supabase
        .from('sync_logs')
        .insert([
          {
            channel_id: selectedConnection.id,
            channel_name: selectedConnection.name,
            timestamp: new Date().toISOString(),
            status: 'success',
            details: isAddingUrl 
              ? `Added new property for ${selectedConnection.name}`
              : `Connected to ${selectedConnection.name}`
          }
        ])

      if (logError) throw logError

      // تحديث الحالة المحلية
      const updatedConnections = connections.map(conn =>
        conn.id === selectedConnection.id
          ? {
              ...conn,
              status: 'connected',
              lastSync: new Date().toISOString(),
              propertyCount: isAddingUrl ? conn.propertyCount + 1 : 1
            }
          : conn
      )

      onConnectionUpdate(updatedConnections as OTAConnection[])
      
      toast({
        title: isAddingUrl ? "Property added successfully" : "Connected successfully",
        description: isAddingUrl 
          ? `Successfully added new property for ${selectedConnection.name}`
          : `Successfully connected to ${selectedConnection.name}`,
      })

      // تحديث الصفحة بعد الإضافة بنجاح
      window.location.reload()

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: isAddingUrl ? "Failed to add property" : "Connection failed",
        description: "There was an error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowConnectionDialog(false)
      setIsAddingUrl(false)
    }
  }

  const handleViewProperties = async (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId)
    if (connection) {
      try {
        // Get all properties for this channel
        const { data: channelProperties, error } = await supabase
          .from('channel_connections')
          .select('*')
          .eq('channel_id', connectionId)

        if (error) throw error

        setSelectedProperties(channelProperties || [])
        setSelectedConnection(connection)
        setViewPropertiesDialog(true)

        // Update the property count in connections
        const updatedConnections = connections.map(conn =>
          conn.id === connectionId
            ? { ...conn, propertyCount: channelProperties.length }
            : conn
        )
        onConnectionUpdate(updatedConnections)

      } catch (error) {
        console.error('Error fetching properties:', error)
        toast({
          title: "Error",
          description: "Failed to fetch properties",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      // Get property details before deletion
      const { data: property, error: fetchError } = await supabase
        .from('channel_connections')
        .select('channel_id, room_name')
        .eq('id', propertyId)
        .single()

      if (fetchError) throw fetchError

      // Delete from channel_connections
      const { error: deleteError } = await supabase
        .from('channel_connections')
        .delete()
        .eq('id', propertyId)

      if (deleteError) throw deleteError

      // Update rooms table based on channel
      if (property) {
        let updateData = {}
        
        if (property.channel_id === '1') { // Booking.com
          updateData = { bookingdotcom_xml_url: null }
        } else if (property.channel_id === '5') { // Agoda
          updateData = { agoda_calendar_url: null }
        }

        const { error: updateError } = await supabase
          .from('rooms')
          .update(updateData)
          .eq('name', property.room_name)

        if (updateError) throw updateError
      }

      setSelectedProperties(prev => prev.filter(p => p.id !== propertyId))
      
      // Update property count
      const updatedConnections = connections.map(conn =>
        conn.id === selectedConnection?.id
          ? { ...conn, propertyCount: conn.propertyCount - 1 }
          : conn
      )
      onConnectionUpdate(updatedConnections)

      toast({
        title: "Property deleted",
        description: "Property has been removed successfully",
      })

      // تحديث الصفحة بعد الحذف بنجاح
      window.location.reload()

    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      })
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied",
      description: "Calendar URL copied to clipboard",
    })
  }

  const handleConnectionClick = (connection: OTAConnection) => {
    setSelectedConnection(connection)
    if (connection.id === '5') { // Agoda
      setShowAgodaDialog(true)
    } else {
      setShowConnectionDialog(true)
    }
  }

  const handleAgodaConnect = async (data: { roomName: string; calendarUrl: string }) => {
    if (!selectedConnection) return

    setIsLoading(true)
    try {
      // Get room ID from the room name
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id')
        .eq('name', data.roomName)
        .single()

      if (roomError) throw roomError
      if (!roomData) throw new Error('Room not found')

      // Update the room with Agoda calendar URL
      const { error: updateError } = await supabase
        .from('rooms')
        .update({ 
          agoda_calendar_url: data.calendarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', roomData.id)

      if (updateError) throw updateError

      // Add connection to channel_connections
      const { error: connectionError } = await supabase
        .from('channel_connections')
        .insert([
          {
            channel_id: selectedConnection.id,
            channel_name: selectedConnection.name,
            room_name: data.roomName,
            calendar_url: data.calendarUrl,
            status: 'connected',
            last_sync: new Date().toISOString()
          }
        ])

      if (connectionError) throw connectionError

      // Update local state
      const updatedConnections = connections.map(conn =>
        conn.id === selectedConnection.id
          ? {
              ...conn,
              status: 'connected',
              lastSync: new Date().toISOString(),
              propertyCount: (conn.propertyCount || 0) + 1
            }
          : conn
      )

      onConnectionUpdate(updatedConnections as OTAConnection[])
      setShowAgodaDialog(false)
      toast({
        title: "Connected successfully",
        description: `Successfully connected Agoda for ${data.roomName}`,
      })

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Connection failed",
        description: "Failed to connect Agoda. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewPropertyXML = async (propertyId: string) => {
    try {
      let xmlUrlField = ''
      if (selectedConnection?.id === '1') {
        xmlUrlField = 'bookingdotcom_xml_url'
      } else if (selectedConnection?.id === '2') {
        xmlUrlField = 'expedia_calendar_url'
      }

      if (!xmlUrlField) return

      const { data: roomData, error } = await supabase
        .from('rooms')
        .select(`id, ${xmlUrlField}`)
        .eq('id', propertyId)
        .single()

      if (error) throw error

      const xmlUrl = roomData[xmlUrlField]
      if (xmlUrl) {
        window.open(xmlUrl, '_blank')
      } else {
        toast({
          title: "No XML URL Found",
          description: "No XML feed URL is available for this property",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching XML URL:', error)
      toast({
        title: "Error",
        description: "Failed to fetch XML URL",
        variant: "destructive",
      })
    }
  }

  const handleEditProperty = async (propertyId: string) => {
    const property = selectedProperties.find(p => p.id === propertyId)
    if (!property) return

    setEditingPropertyId(propertyId)
    setEditedRoomName(property.room_name)
    setEditedCalendarUrl(property.calendar_url)
    await fetchAvailableRooms()
  }

  const handleSaveEdit = async (propertyId: string) => {
    try {
      setIsLoading(true)

      // Validate inputs
      if (!editedRoomName || !editedCalendarUrl) {
        toast({
          title: "Validation Error",
          description: "Room name and Calendar URL are required",
          variant: "destructive",
        })
        return
      }

      console.log('Updating property:', {
        id: propertyId,
        roomName: editedRoomName,
        calendarUrl: editedCalendarUrl
      })

      // Update channel_connections table without updated_at
      const { data: connectionData, error: connectionError } = await supabase
        .from('channel_connections')
        .update({
          room_name: editedRoomName,
          calendar_url: editedCalendarUrl
        })
        .eq('id', propertyId)
        .select()

      if (connectionError) {
        console.error('Connection update error:', connectionError)
        throw new Error(`Failed to update connection: ${connectionError.message}`)
      }

      console.log('Connection updated:', connectionData)

      // Get room ID
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id')
        .eq('name', editedRoomName)
        .single()

      if (roomError) {
        console.error('Room fetch error:', roomError)
        throw new Error(`Failed to fetch room: ${roomError.message}`)
      }

      if (!roomData) {
        throw new Error('Room not found')
      }

      // Determine which URL field to update
      const channelUrlFields: { [key: string]: string } = {
        '1': 'bookingdotcom_xml_url',
        '2': 'expedia_calendar_url',
        '3': 'airbnb_calendar_url',
        '4': 'google_calendar_url',
        '5': 'agoda_calendar_url',
        '6': 'tripadvisor_calendar_url',
        '7': 'gathern_calendar_url',
        '8': 'tripcom_calendar_url',
        '9': 'hostels_calendar_url',
        '10': 'hotels_calendar_url'
      }

      const updateField = selectedConnection?.id ? channelUrlFields[selectedConnection.id] : null
      if (!updateField) {
        throw new Error('Invalid channel selected')
      }

      // Update room with new calendar URL
      const { data: roomUpdateData, error: updateError } = await supabase
        .from('rooms')
        .update({
          [updateField]: editedCalendarUrl
        })
        .eq('id', roomData.id)
        .select()

      if (updateError) {
        console.error('Room update error:', updateError)
        throw new Error(`Failed to update room: ${updateError.message}`)
      }

      console.log('Room updated:', roomUpdateData)

      // Update local state
      const updatedProperties = selectedProperties.map(prop => 
        prop.id === propertyId 
          ? {
              ...prop,
              room_name: editedRoomName,
              calendar_url: editedCalendarUrl
            }
          : prop
      )
      setSelectedProperties(updatedProperties)

      // Clear editing state
      setEditingPropertyId(null)
      setEditedRoomName('')
      setEditedCalendarUrl('')

      toast({
        title: "Success",
        description: "Property updated successfully"
      })

    } catch (error) {
      console.error('Detailed error:', error)
      toast({
        title: "Update Failed",
        description: error instanceof Error 
          ? `Error: ${error.message}`
          : "Failed to update property. Please check the console for details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch available rooms when editing starts
  const fetchAvailableRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('name')
        .order('name')

      if (error) throw error
      setAvailableRooms(data.map(room => room.name))
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {connections.map((connection) => {
          const ConnectionIcon = connection.icon // Get the icon component from connection
          
          return (
            <Card 
              key={connection.id}
              className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                connection.status === 'connected' && "border-green-500"
              )}
              onClick={() => handleConnectionClick(connection)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ConnectionIcon className="h-5 w-5" /> {/* Use the connection icon */}
                    <CardTitle>{connection.name}</CardTitle>
                  </div>
                  <Badge
                    variant={connection.status === 'connected' ? 'default' : 'secondary'}
                  >
                    {connection.status === 'connected' ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Last Sync: {connection.lastSync ? formatDateTime(connection.lastSync) : 'Never'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Properties: {connection.propertyCount}
                  </div>
                  {connection.status === 'connected' && (
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProperties(connection.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Regular connection dialog */}
      <ConnectionDialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
        channelName={selectedConnection?.name || ''}
        channelId={selectedConnection?.id || ''}
        onConnect={handleConnectionSubmit}
        isLoading={isLoading}
        isBookingCom={selectedConnection?.id === '1'}
      />

      {/* Agoda connection dialog */}
      <AgodaConnectionDialog
        open={showAgodaDialog}
        onOpenChange={setShowAgodaDialog}
        onConnect={handleAgodaConnect}
        isLoading={isLoading}
      />

      {/* Properties List Dialog */}
      <Dialog open={viewPropertiesDialog} onOpenChange={setViewPropertiesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedConnection?.name} Properties</DialogTitle>
          </DialogHeader>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Calendar URL</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    {editingPropertyId === property.id ? (
                      <Select
                        value={editedRoomName}
                        onValueChange={setEditedRoomName}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>{editedRoomName}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {availableRooms.map((room) => (
                            <SelectItem key={room} value={room}>
                              {room}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      property.room_name
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {editingPropertyId === property.id ? (
                      <Input
                        value={editedCalendarUrl}
                        onChange={(e) => setEditedCalendarUrl(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span 
                          className="truncate cursor-help"
                          title={property.calendar_url} // Show full URL on hover
                        >
                          {shortenUrl(property.calendar_url)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyUrl(property.calendar_url)}
                          title="Copy Calendar URL"
                          className="ml-auto"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(property.last_sync)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingPropertyId === property.id ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveEdit(property.id)}
                          title="Save Changes"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProperty(property.id)}
                          title="Edit Property"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProperty(property.id)}
                        title="Delete Property"
                        disabled={editingPropertyId === property.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  )
}

