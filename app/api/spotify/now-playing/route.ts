import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

async function refreshSpotifyToken(refreshToken: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(
        process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  
  return await response.json()
}

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Get user's Spotify tokens
  const { data: profile } = await supabase
    .from('profiles')
    .select('spotify_access_token, spotify_refresh_token')
    .eq('id', user.id)
    .single()
  
  if (!profile || !profile.spotify_access_token) {
    return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 })
  }
  
  try {
    // Fetch now playing from Spotify
    let response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${profile.spotify_access_token}`,
      },
    })
    
    // If token expired, refresh it
    if (response.status === 401) {
      const tokens = await refreshSpotifyToken(profile.spotify_refresh_token!)
      
      // Update token in database
      await supabase
        .from('profiles')
        .update({ spotify_access_token: tokens.access_token })
        .eq('id', user.id)
      
      // Retry request
      response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      })
    }
    
    if (response.status === 204) {
      // Nothing is playing
      return NextResponse.json({ is_playing: false })
    }
    
    const data = await response.json()
    
    const nowPlaying = {
      track_name: data.item?.name || 'Unknown',
      artist_name: data.item?.artists?.[0]?.name || 'Unknown',
      album_name: data.item?.album?.name || 'Unknown',
      is_playing: data.is_playing,
    }
    
    // Update cache in database
    await supabase
      .from('now_playing')
      .upsert({
        user_id: user.id,
        ...nowPlaying,
        updated_at: new Date().toISOString(),
      })
    
    return NextResponse.json(nowPlaying)
  } catch (error) {
    console.error('Spotify API error:', error)
    return NextResponse.json({ error: 'Failed to fetch now playing' }, { status: 500 })
  }
}