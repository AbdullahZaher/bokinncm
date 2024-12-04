import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId
    console.log('Processing room ID:', roomId)

    // جلب روابط التقويم من Supabase
    const { data: room, error } = await supabase
      .from('rooms')
      .select('calendar_url, bookingdotcom_xml_url, name')
      .eq('id', roomId)
      .single()

    if (error) throw error

    const calendars = []

    // جلب تقويم Bokinn
    if (room.calendar_url) {
      try {
        const response = await fetch(room.calendar_url)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.text()
        calendars.push({ data, source: 'bokinn.app' })
      } catch (error) {
        console.error('Error fetching Bokinn calendar:', error)
      }
    }

    // جلب تقويم Booking.com
    if (room.bookingdotcom_xml_url) {
      try {
        const response = await fetch(room.bookingdotcom_xml_url)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.text()
        calendars.push({ data, source: 'bookingdotcom' })
      } catch (error) {
        console.error('Error fetching Booking.com calendar:', error)
      }
    }

    // تجميع الأحداث
    const allEvents = calendars.flatMap(calendar => {
      try {
        const events = parseICSData(calendar.data)
        return events.map(event => ({
          ...event,
          source: calendar.source
        }))
      } catch (error) {
        console.error(`Error parsing ${calendar.source} calendar:`, error)
        return []
      }
    })

    // إنشاء ملف ICS
    const ics = generateICS(allEvents, room.name)

    // تسجيل الوصول
    await supabase
      .from('xml_access_logs')
      .insert({
        room_id: roomId,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
        source: request.headers.get('referer') || 'direct',
        response_status: 200,
        room_name: room.name
      })

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename="${roomId}.ics"`,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error generating calendar:', error)
    // تسجيل الخطأ
    await supabase
      .from('xml_access_logs')
      .insert({
        room_id: params.roomId,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
        source: request.headers.get('referer') || 'direct',
        response_status: 500,
        room_name: params.roomId
      })
    return new NextResponse('ERROR: Failed to generate calendar', { status: 500 })
  }
}

function generateICS(events: any[], roomName: string): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:.]/g, '')

  const icsEvents = events.map(event => {
    const start = formatICSDate(event.start)
    const end = formatICSDate(event.end)
    const created = formatICSDate(now)
    const uid = `${start}-${end}-${Math.random().toString(36).substring(2, 15)}`

    return `BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
DTSTAMP:${created}
UID:${uid}
CREATED:${created}
DESCRIPTION:Booked from ${event.source}
LAST-MODIFIED:${created}
LOCATION:${roomName}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:UNAVAILABLE
TRANSP:OPAQUE
END:VEVENT`
  }).join('\n')

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bokinn//Calendar ${roomName}//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${roomName} Calendar
X-WR-TIMEZONE:UTC
${icsEvents}
END:VCALENDAR`
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:.]/g, '').split('T')[0]
}

function parseICSData(icsData: string): any[] {
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
          title: currentEvent.title || 'UNAVAILABLE',
        })
      }
      currentEvent = null
    } else if (currentEvent && line.includes(':')) {
      let fullLine = line
      // معالجة الأسطر المتعددة
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

  return events
}

function parseICSDate(value: string): Date {
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
  
  return new Date(value)
} 