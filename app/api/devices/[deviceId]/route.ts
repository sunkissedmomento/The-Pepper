import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { deviceId: string } }
) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('device_id', params.deviceId)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  
  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { deviceId: string } }
) {
  const supabase = createServerClient()
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('devices')
    .update(body)
    .eq('device_id', params.deviceId)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

// (Spotify now-playing API route moved to app/api/spotify/now-playing/route.ts)