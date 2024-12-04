import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { InfoIcon } from "lucide-react"

interface AgodaConnectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (data: { roomName: string; calendarUrl: string }) => void
  isLoading: boolean
}

interface Room {
  id: string
  name: string
  agoda_calendar_url: string | null
}

export default function AgodaConnectionDialog({
  open,
  onOpenChange,
  onConnect,
  isLoading,
}: AgodaConnectionDialogProps) {
  const supabase = createClientComponentClient()
  const [roomNames, setRoomNames] = useState<string[]>([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [calendarUrl, setCalendarUrl] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)

  // Fetch available rooms
  useEffect(() => {
    async function fetchRoomNames() {
      try {
        setUrlError(null)
        console.log('Fetching rooms...') // Debug log
        
        // Fetch rooms that don't have an Agoda calendar URL yet
        const { data: rooms, error } = await supabase
          .from('rooms')
          .select('id, name, agoda_calendar_url')
          .is('agoda_calendar_url', null)
          .order('name')

        if (error) {
          console.error('Error fetching rooms:', error)
          setUrlError('Failed to fetch rooms')
          return
        }

        if (rooms && rooms.length > 0) {
          console.log('Fetched rooms:', rooms) // Debug log
          const names = rooms.map(room => room.name)
          setRoomNames(names)
        } else {
          console.log('No available rooms found') // Debug log
          setRoomNames([])
        }
      } catch (error) {
        console.error('Error in fetchRoomNames:', error)
        setUrlError('An unexpected error occurred')
      }
    }

    if (open) {
      fetchRoomNames()
    }
  }, [open, supabase])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedRoom("")
      setCalendarUrl("")
    }
  }, [open])

  const validateCalendarUrl = (url: string) => {
    if (!url) {
      setUrlError('Calendar URL is required')
      return false
    }
    if (!url.includes('agoda.com')) {
      setUrlError('URL must be from agoda.com domain')
      return false
    }
    setUrlError(null)
    return true
  }

  const handleCalendarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setCalendarUrl(url)
    if (url) {
      validateCalendarUrl(url)
    } else {
      setUrlError(null)
    }
  }

  const handleConnect = async () => {
    if (!selectedRoom || !calendarUrl) return
    if (!validateCalendarUrl(calendarUrl)) return
    onConnect({ 
      roomName: selectedRoom, 
      calendarUrl 
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect to Agoda</DialogTitle>
          <DialogDescription>
            Connect your property with Agoda using the iCal/ICS calendar URL from your Agoda extranet
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {urlError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{urlError}</AlertDescription>
            </Alert>
          )}

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
            {roomNames.length === 0 && !urlError && (
              <p className="text-sm text-muted-foreground">
                All rooms are already connected to Agoda or no rooms exist.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="calendarUrl">Agoda Calendar URL</Label>
            <Input
              id="calendarUrl"
              value={calendarUrl}
              onChange={handleCalendarUrlChange}
              placeholder="https://agoda.com/calendar/..."
              disabled={isLoading}
              className={urlError ? "border-red-500" : ""}
            />
            {urlError ? (
              <p className="text-sm text-red-500">
                {urlError}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                The calendar URL must be from agoda.com domain and will be used to sync availability
              </p>
            )}
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              To get your Agoda calendar URL:
              <ol className="mt-2 ml-4 list-decimal">
                <li>Log in to your <a href="https://ycs.agoda.com" target="_blank" rel="noopener noreferrer" className="underline">Agoda YCS Portal</a></li>
                <li>Go to Calendar Sync settings</li>
                <li>Copy the iCal/ICS URL for your property</li>
                <li>Make sure the URL contains "agoda.com"</li>
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
            disabled={isLoading || !selectedRoom || !calendarUrl || !!urlError}
          >
            {isLoading ? 'Processing...' : 'Connect to Agoda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 