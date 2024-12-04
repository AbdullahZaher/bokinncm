'use client'

import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { Loader2, RefreshCw, Link2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { createClient } from '@supabase/supabase-js'
import { Badge } from "./ui/badge"
import { PLATFORM_COLORS } from '@/app/constants/colors'

interface CalendarEvent {
  start: Date
  end: Date
  title: string
  allDay?: boolean
  source?: 'bokinn.app' | 'bookingdotcom'
}

interface RoomCalendarProps {
  roomId: string
  roomName: string
  roomPrice: number
  calendarUrl: string
  calendarFilter: 'all' | 'bokinn' | 'booking'
}

export default function RoomCalendar({ roomId, roomName, roomPrice, calendarUrl, calendarFilter }: RoomCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const localizer = momentLocalizer(moment)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const calendarStyles = {
    height: 500,
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
  }

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: event.source === 'bookingdotcom' ? PLATFORM_COLORS.BOOKING : PLATFORM_COLORS.BOKINN,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block'
    }
  })

  const parseICSToEvents = (icsData: string): CalendarEvent[] => {
    console.log('Raw ICS data:', icsData);
    
    const events = []
    const lines = icsData.split('\n').map(line => line.trim())
    let currentEvent = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {}
      } else if (line.startsWith('END:VEVENT') && currentEvent) {
        if (currentEvent.start && currentEvent.end) {
          events.push({
            ...currentEvent,
            title: currentEvent.title || 'Booked',
          })
        }
        currentEvent = null
      } else if (currentEvent && line.includes(':')) {
        let fullLine = line
        while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
          fullLine += lines[i + 1].trim()
          i++
        }

        const [key, ...valueParts] = fullLine.split(':')
        const value = valueParts.join(':')

        switch (key) {
          case 'DTSTART':
          case 'DTSTART;VALUE=DATE':
            currentEvent.start = parseICSDate(value)
            break
          case 'DTEND':
          case 'DTEND;VALUE=DATE':
            currentEvent.end = parseICSDate(value)
            break
          case 'SUMMARY':
            currentEvent.title = value
            break
        }
      }
    }

    console.log('Parsed events:', events);
    return events
  }

  const parseICSDate = (value: string): Date | null => {
    const cleaned = value.replace(/\D/g, '')
    
    if (cleaned.length === 8) {
      const year = cleaned.substring(0, 4)
      const month = cleaned.substring(4, 6)
      const day = cleaned.substring(6, 8)
      return new Date(Date.UTC(+year, +month - 1, +day))
    } else if (cleaned.length === 14) {
      const year = cleaned.substring(0, 4)
      const month = cleaned.substring(4, 6)
      const day = cleaned.substring(6, 8)
      const hour = cleaned.substring(8, 10)
      const minute = cleaned.substring(10, 12)
      const second = cleaned.substring(12, 14)
      return new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute, +second))
    }
    
    console.warn('Failed to parse date:', value)
    return null
  }

  const fetchCalendarData = async (url: string, retries = 3): Promise<string> => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(`/api/calendar?url=${encodeURIComponent(url)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`)
        }

        return data.data
      } catch (error) {
        if (attempt === retries - 1) throw error
        await delay(Math.pow(2, attempt) * 1000)
      }
    }
    throw new Error('Failed to fetch calendar data')
  }

  const loadCalendarData = async (showToast = true) => {
    try {
      setIsRefreshing(true)
      
      console.log('Calendar URL:', calendarUrl)
      
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('bookingdotcom_xml_url')
        .eq('id', roomId)
        .single()

      if (roomError) throw roomError

      const [bokinnData, bookingData] = await Promise.all([
        fetchCalendarData(calendarUrl),
        roomData.bookingdotcom_xml_url ? fetchCalendarData(roomData.bookingdotcom_xml_url) : null
      ])

      console.log('Bokinn Data:', bokinnData)
      console.log('Booking Data:', bookingData)

      const bokinnEvents = parseICSToEvents(bokinnData).map(event => ({
        ...event,
        source: 'bokinn.app'
      }))

      const bookingEvents = bookingData 
        ? parseICSToEvents(bookingData).map(event => ({
            ...event,
            source: 'bookingdotcom'
          }))
        : []

      console.log('Bokinn Events:', bokinnEvents)
      console.log('Booking Events:', bookingEvents)

      const allEvents = [...bokinnEvents, ...bookingEvents]
      
      console.log('All Events:', allEvents)
      
      setEvents(allEvents as CalendarEvent[])
      
      if (showToast) {
        toast({
          title: "Calendar Updated",
          description: "Successfully refreshed calendar data",
        })
      }
    } catch (error) {
      console.error('Calendar Load Error:', error)
      toast({
        title: "Error",
        description: "Failed to load calendar data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadCalendarData(false)
  }, [calendarUrl])

  const filterEvents = (events: CalendarEvent[]) => {
    console.log('Filtering events with filter:', calendarFilter)
    console.log('Events before filter:', events)
    
    const filtered = events.filter(event => {
      switch (calendarFilter) {
        case 'bokinn':
          return event.source === 'bokinn.app'
        case 'booking':
          return event.source === 'bookingdotcom'
        default:
          return true
      }
    })
    
    console.log('Filtered events:', filtered)
    return filtered
  }

  return (
    <div>
      <div className="space-y-4">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {roomName} Calendar
              <span className="text-sm text-muted-foreground">
                (${roomPrice}/night)
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadCalendarData()}
                disabled={isRefreshing}
                className={cn(
                  "transition-all duration-200",
                  isRefreshing && "opacity-50"
                )}
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={filterEvents(events)}
                startAccessor="start"
                endAccessor="end"
                style={calendarStyles}
                views={['month']}
                defaultView="month"
                allDayAccessor="allDay"
                tooltipAccessor={(event) => event.title}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => {
                  toast({
                    title: "Event Details",
                    description: `${event.title}\nFrom: ${moment(event.start).format('LLL')}\nTo: ${moment(event.end).format('LLL')}`,
                  })
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 