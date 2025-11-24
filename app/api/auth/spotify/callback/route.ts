import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=spotify_auth_failed', request.url))
  }
  
  try {
    // Exchange code for tokens
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
      },
      body: new URLSearchParams({
        code,
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error('Failed to get Spotify tokens')
    }
    
    // Get Spotify user info
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
      },
    })
    
    const spotifyUser = await userResponse.json()
    
    // Save tokens to Supabase
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase
        .from('profiles')
        .update({
          spotify_access_token: data.access_token,
          spotify_refresh_token: data.refresh_token,
          spotify_user_id: spotifyUser.id,
        })
        .eq('id', user.id)
    }
    
    return NextResponse.redirect(new URL('/settings?spotify=connected', request.url))
  } catch (error) {
    console.error('Spotify auth error:', error)
    return NextResponse.redirect(new URL('/settings?error=spotify_auth_failed', request.url))
  }
}
