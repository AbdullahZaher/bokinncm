'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  RefreshCw, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Hotel,
  Globe,
  Calendar as CalendarIcon
} from "lucide-react"
import { supabase } from '../lib/supabase'
import { useToast } from "./ui/use-toast"
import { fetchIcalEvents } from '../services/icalService'
import XMLParser from 'fast-xml-parser'

moment.locale('en-GB')
const localizer = momentLocalizer(moment)

// Constants and configurations
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
const eventCache = new Map<string, { events: any[], timestamp: number }>()

const sourceColors = {
  'bokinn.app': '#8b5cf6', // Purple
  booking: '#10b981', // Emerald
  airbnb: '#ef4444', // Red
  expedia: '#f59e0b', // Amber
  default: '#6b7280', // Gray
}

// Improved Stats Card with icons
const StatsCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: any }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// Enhanced Legend Component
const Legend = () => (
  <Card className="hover:shadow-md transition-shadow">
    <div className="p-4 border-b">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Booking Sources
      </h3>
    </div>
    <div className="p-4 space-y-3">
      {Object.entries(sourceColors).map(([source, color]) => (
        source !== 'default' && (
          <div key={source} className="flex items-center gap-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div 
              className={`w-3 h-3 rounded-full ring-2 ring-offset-2 group-hover:ring-offset-4 transition-all ring-[${color}]`}
              style={{ backgroundColor: color }}
            />
            <span className="text-sm capitalize">{source}</span>
          </div>
        )
      ))}
    </div>
  </Card>
)

// Modern Calendar Toolbar
const CustomToolbar = ({ onView, onNavigate, label }: any) => (
  <div className="flex items-center justify-between mb-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 py-4">
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onNavigate('PREV')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => onNavigate('TODAY')}
      >
        Today
      </Button>
      <Button 
        variant="outline"
        size="icon"
        onClick={() => onNavigate('NEXT')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <span className="text-lg font-semibold ml-4">{label}</span>
    </div>
    <Tabs defaultValue="month" className="w-[300px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="month" onClick={() => onView('month')}>Month</TabsTrigger>
        <TabsTrigger value="week" onClick={() => onView('week')}>Week</TabsTrigger>
        <TabsTrigger value="day" onClick={() => onView('day')}>Day</TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
)

// Cache management functions
const clearCache = () => {
  eventCache.clear()
  console.log('Event cache cleared')
}

const isCacheValid = (url: string) => {
  const cached = eventCache.get(url)
  if (!cached) return false
  return (Date.now() - cached.timestamp) < CACHE_DURATION
}

const fetchEvents = async (url: string) => {
  try {
    // التحقق من وجود بيانات مخزنة مؤقتاً
    const cached = eventCache.get(url)
    const now = Date.now()
    
    // استخدام البيانات المخزنة إذا كانت حديثة
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log('Using cached events for:', url)
      return cached.events
    }

    // جلب البيانات الجديدة إذا لم تكن هناك بيانات مخزنة أو كانت قديمة
    console.log('Fetching fresh events for:', url)
    const response = await fetch(`/api/fetch-calendar?url=${encodeURIComponent(url)}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // تخزين البيانات الجديدة في الذاكرة المؤقتة
    eventCache.set(url, {
      events: data,
      timestamp: now
    })
    
    return data
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

// Add this interface before the CalendarClient component
interface CalendarEvent {
  title: string
  start: Date
  end: Date
  resourceId?: string
  source?: string
  color?: string
}

// Main Calendar Component
export default function CalendarClient() {
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<keyof typeof Views>('month')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const parseXMLtoJSON = useCallback((xmlData: string) => {
    try {
      const parser = new XMLParser.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        parseAttributeValue: true
      })
      return parser.parse(xmlData)
    } catch (error) {
      console.error('XML parsing error:', error)
      return null
    }
  }, [])

  const fetchExternalData = useCallback(async (url: string) => {
    // Check cache first
    const cached = eventCache.get(url)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.events
    }

    const response = await fetch(`/api/calendar?url=${encodeURIComponent(url)}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.text()
    const isXML = data.trim().startsWith('<?xml') || data.trim().startsWith('<')
    
    let parsedData
    if (isXML) {
      parsedData = parseXMLtoJSON(data)
      // Add XML to JSON transformation logic here
    } else {
      parsedData = JSON.parse(data)
    }

    // Cache the result
    eventCache.set(url, { events: parsedData, timestamp: Date.now() })
    return parsedData
  }, [parseXMLtoJSON])

  const fetchCalendarData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch rooms with calendar URLs
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .not('calendar_url', 'is', null)

      if (roomsError) throw roomsError

      // Fetch channel connections
      const { data: bookingConnections, error: connectionError } = await supabase
        .from('channel_connections')
        .select('*')
        .eq('status', 'connected')

      if (connectionError) throw connectionError

      // Process Bokinn.app events
      const bokinnEvents = await Promise.all(
        (rooms || []).map(async (room) => {
          try {
            if (!room.calendar_url) return []
            
            const events = await fetchIcalEvents(room.calendar_url)
            return events.map(event => ({
              ...event,
              title: `${room.name} - ${event.title}`,
              resourceId: room.id,
              source: 'bokinn.app',
              color: sourceColors['bokinn.app']
            }))
          } catch (error) {
            console.error(`Error fetching calendar for room ${room.name}:`, error)
            return []
          }
        })
      )

      // Process external channel events
      const externalEvents = await Promise.all(
        (bookingConnections || []).map(async (connection) => {
          try {
            if (!connection.calendar_url) return []
            
            const events = await fetchIcalEvents(connection.calendar_url)
            return events.map(event => ({
              ...event,
              title: `${connection.room_name} - ${event.title}`,
              resourceId: connection.room_name,
              color: sourceColors[connection.channel_name.toLowerCase() as keyof typeof sourceColors] || sourceColors.default
            }))
          } catch (error) {
            console.error(`Error fetching calendar for ${connection.channel_name}:`, error)
            return []
          }
        })
      )

      // Combine all events
      const allEvents = [
        ...bokinnEvents.flat(),
        ...externalEvents.flat()
      ]

      console.log('Calendar Events:', allEvents) // Debug log
      setEvents(allEvents)
    } catch (error) {
      console.error('Error fetching calendar data:', error)
      setError('Failed to load calendar data')
      toast({
        title: "Calendar sync error",
        description: "Failed to sync calendar data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCalendarData()

    // Subscribe to local reservation changes
    const reservationsChannel = supabase
      .channel('calendar_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => fetchCalendarData()
      )
      .subscribe()

    // Set up periodic refresh for external calendars
    const refreshInterval = setInterval(fetchCalendarData, 5 * 60 * 1000) // Refresh every 5 minutes

    return () => {
      supabase.removeChannel(reservationsChannel)
      clearInterval(refreshInterval)
    }
  }, [fetchCalendarData])

  // Add stats calculation
  const getStats = useCallback(() => {
    const today = new Date()
    const thisMonth = events.filter(event => 
      new Date(event.start).getMonth() === today.getMonth()
    )

    return {
      totalEvents: events.length,
      thisMonth: thisMonth.length,
      bokinnApp: events.filter(e => e.source === 'bokinn.app').length,
      external: events.filter(e => e.source !== 'bokinn.app').length,
    }
  }, [events])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar data...</p>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reservation Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage all your bookings in one place</p>
        </div>
        <Button 
          onClick={fetchCalendarData}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Sync Calendar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Reservations" value={stats.totalEvents} icon={CalendarIcon} />
        <StatsCard title="This Month" value={stats.thisMonth} icon={Users} />
        <StatsCard title="Bokinn.app" value={stats.bokinnApp} icon={Hotel} />
        <StatsCard title="Channel Bookings" value={stats.external} icon={Globe} />
      </div>

      {/* Calendar Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '700px' }}
                views={['month', 'week', 'day']}
                defaultView="month"
                components={{
                  toolbar: CustomToolbar
                }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.color || sourceColors.default,
                    borderRadius: '6px',
                    border: 'none',
                    padding: '2px 6px'
                  }
                })}
              />
            </div>
            <div className="w-full lg:w-72 space-y-6">
              <Legend />
              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

