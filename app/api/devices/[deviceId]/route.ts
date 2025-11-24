import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

interface Params {
  deviceId: string
}

export async function GET(request: NextRequest, context: { params: Params }) {
  const { params } = context
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('device_id', params.deviceId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  // Update last_seen to mark device as online
  await supabase
    .from('devices')
    .update({ last_seen: new Date().toISOString(), is_online: true })
    .eq('device_id', params.deviceId)

  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest, context: { params: Params }) {
  const { params } = context
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
