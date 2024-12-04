import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  const testUrl = 'https://bokinn.app/api/calendar/c1e35c0a-d4ac-4762-8652-13f33dd3bc7f/ical'
  
  try {
    const response = await axios.get(testUrl, {
      headers: {
        'Accept': 'text/calendar',
        'User-Agent': 'Mozilla/5.0 (compatible; Calendar/1.0)',
      },
      responseType: 'text',
      timeout: 10000
    })

    return NextResponse.json({
      status: response.status,
      headers: response.headers,
      data: response.data.substring(0, 500) // First 500 chars only
    })

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data
      }
    }, { status: 500 })
  }
} 