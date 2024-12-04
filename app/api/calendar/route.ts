import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'Calendar URL is required' }, { status: 400 })
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'text/calendar',
        'User-Agent': 'Mozilla/5.0 (compatible; Calendar/1.0)',
      },
      responseType: 'text',
      timeout: 10000
    })

    if (response.status !== 200) {
      throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}`)
    }

    return NextResponse.json({ data: response.data })

  } catch (error) {
    console.error('Calendar API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch calendar',
      details: error.message 
    }, { 
      status: 500 
    })
  }
} 