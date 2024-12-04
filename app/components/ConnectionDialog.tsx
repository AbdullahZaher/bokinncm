import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
import { InfoIcon } from "lucide-react"

interface ConnectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  channelName: string
  channelId: string
  onConnect: (data: { roomName: string; calendarUrl: string }) => void
  isLoading: boolean
  isAdditionalUrl?: boolean
  isBookingCom?: boolean
}

export default function ConnectionDialog({ 
  open, 
  onOpenChange, 
  channelName,
  channelId,
  onConnect,
  isLoading,
  isAdditionalUrl = false,
  isBookingCom = false,
}: ConnectionDialogProps) {
  const supabase = createClientComponentClient()
  const [roomNames, setRoomNames] = useState<string[]>([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [calendarUrl, setCalendarUrl] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRoomNames() {
      let query = supabase
        .from('rooms')
        .select('name')
        .order('name')
      
      if (isBookingCom) {
        query = query.is('bookingdotcom_xml_url', null)
      } else if (channelId === '5') { // Agoda
        query = query.is('agoda_calendar_url', null)
      } else if (channelId === '3') { // Airbnb
        query = query.is('airbnb_calendar_url', null)
      } else if (channelId === '2') { // Expedia
        query = query.is('expedia_calendar_url', null)
      } else if (channelId === '4') { // Google Calendar
        query = query.is('google_calendar_url', null)
      } else if (channelId === '6') { // TripAdvisor
        query = query.is('tripadvisor_calendar_url', null)
      } else if (channelId === '7') { // Gathern
        query = query.is('gathern_calendar_url', null)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching rooms:', error)
        return
      }

      if (data) {
        const names = data.map(room => room.name)
        setRoomNames(names)
      }
    }

    fetchRoomNames()
  }, [supabase, isBookingCom, channelId])

  const handleConnect = async () => {
    try {
      if (!selectedRoom || !calendarUrl) {
        console.error('Please fill in all fields')
        return
      }

      // Validate URLs based on channel
      if (isBookingCom && !calendarUrl.includes('booking.com')) {
        setUrlError('Please enter a valid Booking.com calendar URL')
        return
      } else if (channelId === '3' && !calendarUrl.includes('airbnb.com')) {
        setUrlError('Please enter a valid Airbnb calendar URL')
        return
      } else if (channelId === '2' && !calendarUrl.includes('expedia.com')) {
        setUrlError('Please enter a valid Expedia calendar URL')
        return
      } else if (channelId === '4' && !calendarUrl.includes('calendar.google.com')) {
        setUrlError('Please enter a valid Google Calendar URL')
        return
      } else if (channelId === '6' && !calendarUrl.includes('tripadvisor.com')) {
        setUrlError('Please enter a valid TripAdvisor calendar URL')
        return
      } else if (channelId === '7' && !calendarUrl.includes('gathern.co')) {
        setUrlError('Please enter a valid Gathern calendar URL')
        return
      }

      setUrlError(null) // مسح رسالة الخطأ إذا كان الرابط صحيحاً

      if (isBookingCom) {
        // Get room ID
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('id')
          .eq('name', selectedRoom)
          .single()

        if (roomError) {
          console.error('Error fetching room:', roomError)
          throw roomError
        }

        if (!roomData) {
          console.error('Room not found')
          return
        }

        // Update Booking.com calendar URL for the selected room
        const { error: updateError } = await supabase
          .from('rooms')
          .update({ 
            bookingdotcom_xml_url: calendarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', roomData.id)

        if (updateError) {
          console.error('Error updating room:', updateError)
          throw updateError
        }
      }

      onConnect({ roomName: selectedRoom, calendarUrl })
      setCalendarUrl("")
      setSelectedRoom("")
    } catch (error) {
      console.error('Error in handleConnect:', error)
      setUrlError('Failed to connect. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect to {channelName}</DialogTitle>
          <DialogDescription>
            Connect your property with {channelName} using the iCal/ICS calendar URL
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {urlError ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{urlError}</AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-muted-foreground">
              The calendar URL will be used to sync availability
            </p>
          )}
          {/* Room Selection */}
          <div className="grid gap-2">
            <Label htmlFor="room">Room</Label>
            <Select
              value={selectedRoom}
              onValueChange={setSelectedRoom}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={roomNames.length > 0 ? "Select a room" : "No rooms available"} />
              </SelectTrigger>
              <SelectContent>
                {roomNames.length > 0 ? (
                  roomNames.map((roomName) => (
                    <SelectItem key={roomName} value={roomName}>
                      {roomName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No available rooms found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {roomNames.length === 0 && (
              <p className="text-sm text-muted-foreground">
                All rooms are already connected or no rooms exist.
              </p>
            )}
          </div>

          {/* Calendar URL Input */}
          <div className="grid gap-2">
            <Label htmlFor="calendarUrl">Calendar URL</Label>
            <Input
              id="calendarUrl"
              value={calendarUrl}
              onChange={(e) => {
                const newUrl = e.target.value;
                setCalendarUrl(newUrl);
                
                // التحقق من الرابط عند التغيير
                if (isBookingCom && newUrl && !newUrl.includes('booking.com')) {
                  setUrlError('Please enter a valid Booking.com calendar URL');
                } else {
                  setUrlError(null);
                }
              }}
              placeholder={`Enter ${channelName} calendar URL`}
              disabled={isLoading}
              className={urlError ? "border-red-500" : ""}
            />
            {urlError ? (
              <p className="text-sm text-red-500">
                {urlError}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                The calendar URL must be from booking.com domain and will be used to sync availability
              </p>
            )}
          </div>

          {/* Instructions Alert */}
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              To get your {channelName} calendar URL:
              <ol className="mt-2 ml-4 list-decimal">
                <li>Log in to your {channelName} account</li>
                <li>Go to Calendar Sync settings</li>
                <li>Copy the iCal/ICS URL for your property</li>
              </ol>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={isLoading || !selectedRoom || !calendarUrl}
          >
            {isLoading ? 'Processing...' : isAdditionalUrl ? 'Add URL' : 'Connect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 