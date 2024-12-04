import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Fetch room reservations
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select(`
        id,
        guest_name,
        check_in,
        check_out,
        status,
        rooms (
          name
        )
      `)
      .eq('room_id', params.roomId)
      .eq('status', 'confirmed')

    if (error) throw error

    // Generate iCal format
    const icalData = generateICalendar(reservations)
    
    return new NextResponse(icalData, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename="room-${params.roomId}.ics"`
      }
    })
  } catch (error) {
    console.error('Calendar generation error:', error)
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 })
  }
}

function generateICalendar(reservations: any[]) {
  const now = new Date()
  const icalLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bokinn.app//Calendar',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ]

  reservations.forEach(reservation => {
    icalLines.push(
      'BEGIN:VEVENT',
      `UID:${reservation.id}`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(new Date(reservation.check_in))}`,
      `DTEND:${formatDate(new Date(reservation.check_out))}`,
      `SUMMARY:${reservation.guest_name} - ${reservation.rooms.name}`,
      'END:VEVENT'
    )
  })

  icalLines.push('END:VCALENDAR')
  return icalLines.join('\r\n')
}

function formatDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
} 