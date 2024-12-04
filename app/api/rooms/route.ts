import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('id, name, calendar_url')
      .not('calendar_url', 'is', null)

    if (error) throw error

    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('Error fetching room calendar URLs:', error)
    return NextResponse.json({ error: 'Failed to fetch room calendar URLs' }, { status: 500 })
  }
} 