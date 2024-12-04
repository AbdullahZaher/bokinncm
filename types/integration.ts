import { TypeIcon as type, LucideIcon, Globe, Calendar, HotelIcon } from 'lucide-react'

export interface OTAConnection {
  id: string
  name: string
  status: 'connected' | 'disconnected'
  lastSync: string | null
  propertyCount: number
  icon: LucideIcon
}

export const initialConnections: OTAConnection[] = [
  {
    id: '0',
    name: 'Bokinn.app',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Calendar
  },
  {
    id: '1',
    name: 'Booking.com',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '2',
    name: 'Expedia',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Globe
  },
  {
    id: '3',
    name: 'Airbnb',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Globe
  },
  {
    id: '4',
    name: 'Google Calendar',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Globe
  },
  {
    id: '5',
    name: 'Agoda',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Globe
  },
  {
    id: '6',
    name: 'TripAdvisor',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Globe
  },
  {
    id: '7',
    name: 'Gathern',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: Globe
  },
  {
    id: '8',
    name: 'Trip.com',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '9',
    name: 'Hotels.com',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  },
  {
    id: '10',
    name: 'Kayak.sa',
    status: 'disconnected',
    lastSync: null,
    propertyCount: 0,
    icon: HotelIcon
  }
]

export interface SyncLog {
  id: string
  channel: string
  timestamp: string
  status: 'success' | 'error'
  details: string
}

