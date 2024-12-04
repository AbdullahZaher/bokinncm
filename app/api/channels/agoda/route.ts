import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)

    const { roomName, calendarUrl } = body

    if (!roomName || !calendarUrl) {
      console.log('Missing required fields:', { roomName, calendarUrl })
      return NextResponse.json(
        { error: 'Room name and calendar URL are required' },
        { status: 400 }
      )
    }

    // First, check if the room exists
    const { data: existingRoom, error: fetchError } = await supabase
      .from('rooms')
      .select('id, name')
      .eq('name', roomName)
      .single()

    if (fetchError || !existingRoom) {
      console.error('Error fetching room:', fetchError)
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    console.log('Found room:', existingRoom)

    // Update the room with the Agoda calendar URL
    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({ 
        agoda_calendar_url: calendarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingRoom.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating room:', updateError)
      return NextResponse.json(
        { error: 'Failed to update room' },
        { status: 500 }
      )
    }

    console.log('Successfully updated room:', updatedRoom)

    // Log successful connection
    const { error: logError } = await supabase
      .from('sync_logs')
      .insert({
        channel_id: '5', // Agoda's channel ID
        channel_name: 'Agoda',
        room_id: existingRoom.id,
        timestamp: new Date().toISOString(),
        status: 'success',
        details: 'Connected via calendar URL'
      })

    if (logError) {
      console.error('Error logging sync:', logError)
      // Don't return error here as the main operation succeeded
    }

    return NextResponse.json({
      message: 'Successfully connected to Agoda',
      room: updatedRoom
    })

  } catch (error) {
    console.error('Error in Agoda connection:', error)
    
    // Log error
    await supabase
      .from('sync_logs')
      .insert({
        channel_id: '5',
        channel_name: 'Agoda',
        timestamp: new Date().toISOString(),
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      })

    return NextResponse.json(
      { 
        error: 'Failed to connect with Agoda',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
} 