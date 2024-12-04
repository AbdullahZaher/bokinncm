import { CalendarEvent } from '../types/calendar'

export async function fetchIcalEvents(icalUrl: string) {
  try {
    const encodedUrl = encodeURIComponent(icalUrl)
    const response = await fetch(`/api/calendar-proxy?url=${encodedUrl}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const icalData = await response.text()
    console.log('iCal Data:', icalData) // Debug log
    
    const events = parseIcalData(icalData)
    console.log('Parsed Events:', events) // Debug log
    return events
  } catch (error) {
    console.error('Error fetching iCal events:', error)
    return []
  }
}

function parseIcalData(icalData: string) {
  const events = []
  const lines = icalData.split('\n')
  let currentEvent: any = null

  for (let line of lines) {
    line = line.trim()

    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {}
    } else if (line.startsWith('END:VEVENT') && currentEvent) {
      // Only add event if we have both start and end dates
      if (currentEvent.dtstart && currentEvent.dtend) {
        try {
          const event = {
            title: currentEvent.summary || 'Booking.com Reservation',
            start: new Date(currentEvent.dtstart),
            end: new Date(currentEvent.dtend),
            source: 'booking.com',
            resourceId: 'booking'
          }
          
          // Validate dates
          if (!isNaN(event.start.getTime()) && !isNaN(event.end.getTime())) {
            events.push(event)
          }
        } catch (error) {
          console.error('Error parsing event dates:', error)
        }
      }
      currentEvent = null
    } else if (currentEvent) {
      try {
        if (line.startsWith('SUMMARY:')) {
          currentEvent.summary = line.substring(8)
        } else if (line.startsWith('DTSTART')) {
          const dateStr = line.split(':')[1]
          currentEvent.dtstart = formatIcalDate(dateStr)
        } else if (line.startsWith('DTEND')) {
          const dateStr = line.split(':')[1]
          currentEvent.dtend = formatIcalDate(dateStr)
        }
      } catch (error) {
        console.error('Error parsing line:', line, error)
      }
    }
  }
  return events
}

function formatIcalDate(icalDate: string) {
  try {
    // Remove any whitespace
    icalDate = icalDate.trim()
    
    // Handle different date formats
    if (icalDate.includes('T')) {
      // Format: YYYYMMDDTHHMMSSZ
      const year = icalDate.substring(0, 4)
      const month = icalDate.substring(4, 6)
      const day = icalDate.substring(6, 8)
      const hour = icalDate.substring(9, 11)
      const minute = icalDate.substring(11, 13)
      const second = icalDate.substring(13, 15)

      return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
    } else {
      // Format: YYYYMMDD
      const year = icalDate.substring(0, 4)
      const month = icalDate.substring(4, 6)
      const day = icalDate.substring(6, 8)

      return `${year}-${month}-${day}T00:00:00Z`
    }
  } catch (error) {
    console.error('Error formatting date:', icalDate, error)
    throw error
  }
} 