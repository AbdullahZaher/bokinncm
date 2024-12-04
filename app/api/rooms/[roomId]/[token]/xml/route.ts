import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'
import { format } from 'date-fns'
import { headers } from 'next/headers'

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 30 // max requests per minute

const rateLimit = new Map<string, { count: number; timestamp: number }>()

export async function GET(
  request: Request,
  { params }: { params: { roomId: string; token: string } }
) {
  const headersList = headers()
  const clientIp = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'
  let responseStatus = 200

  try {
    // Rate limiting
    const now = Date.now()
    const clientRate = rateLimit.get(clientIp) || { count: 0, timestamp: now }

    if (now - clientRate.timestamp > RATE_LIMIT_WINDOW) {
      clientRate.count = 1
      clientRate.timestamp = now
    } else if (clientRate.count >= MAX_REQUESTS) {
      return new NextResponse('Rate limit exceeded', { status: 429 })
    } else {
      clientRate.count++
    }
    rateLimit.set(clientIp, clientRate)

    // Fetch room details with token verification
    const { data: room } = await supabase
      .from('rooms')
      .select('id, name, type, capacity, price, xml_token')
      .eq('id', params.roomId)
      .single()

    if (!room || room.xml_token !== params.token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Log access
    await supabase
      .from('xml_access_logs')
      .insert([{
        room_id: params.roomId,
        ip_address: clientIp,
        user_agent: userAgent,
        response_status: responseStatus
      }])

    // Fetch reservations
    const { data: reservations } = await supabase
      .from('reservations')
      .select('*')
      .eq('room_id', params.roomId)
      .neq('status', 'cancelled')
      .gte('check_out', format(new Date(), 'yyyy-MM-dd'))
      .order('check_in', { ascending: true })

    // Generate XML with more details
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<room id="${room.id}">
  <details>
    <name>${room.name}</name>
    <type>${room.type}</type>
    <capacity>${room.capacity}</capacity>
    <base_rate>${room.price}</base_rate>
  </details>
  <reservations>
    ${reservations?.map(reservation => `
    <reservation>
      <id>${reservation.id}</id>
      <guest>${reservation.guest_name}</guest>
      <start_date>${format(new Date(reservation.check_in), 'yyyy-MM-dd')}</start_date>
      <end_date>${format(new Date(reservation.check_out), 'yyyy-MM-dd')}</end_date>
      <status>${reservation.status}</status>
      ${reservation.total_price ? `<total_price>${reservation.total_price}</total_price>` : ''}
    </reservation>`).join('')}
  </reservations>
  <generated_at>${new Date().toISOString()}</generated_at>
</room>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-RateLimit-Limit': MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': (MAX_REQUESTS - clientRate.count).toString(),
        'X-RateLimit-Reset': (clientRate.timestamp + RATE_LIMIT_WINDOW).toString(),
      },
    })
  } catch (error) {
    responseStatus = 500
    // Log error access
    await supabase
      .from('xml_access_logs')
      .insert([{
        room_id: params.roomId,
        ip_address: clientIp,
        user_agent: userAgent,
        response_status: responseStatus
      }])

    console.error('Error generating XML:', error)
    return new NextResponse('Error generating XML', { status: responseStatus })
  }
} 