import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
  
  // Check if env vars exist
  if (!clientId || !redirectUri) {
    console.error('Missing Spotify environment variables')
    return NextResponse.redirect(new URL('/settings?error=spotify_config_missing', request.url))
  }
  
  const scopes = [
    'user-read-playback-state',
    'user-read-currently-playing',
  ].join(' ')
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes,
  })
  
  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`)
}