import { NextResponse } from 'next/server'

export async function GET() {
  const scopes = [
    'user-read-playback-state',
    'user-read-currently-playing',
  ].join(' ')
  
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
    scope: scopes,
  })
  
  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`)
}