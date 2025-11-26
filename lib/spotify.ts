/**
 * Spotify API utilities
 */

export interface SpotifyTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface SpotifyUser {
  id: string
  display_name: string
  email: string
}

export interface SpotifyTrack {
  name: string
  artists: Array<{ name: string }>
  album: { name: string }
}

export interface SpotifyCurrentlyPlaying {
  item: SpotifyTrack | null
  is_playing: boolean
}

/**
 * Exchange Spotify authorization code for access tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
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

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens')
  }

  return await response.json()
}

/**
 * Refresh expired Spotify access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
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

  if (!response.ok) {
    throw new Error('Failed to refresh access token')
  }

  return await response.json()
}

/**
 * Get Spotify user profile
 */
export async function getSpotifyUser(accessToken: string): Promise<SpotifyUser> {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get Spotify user')
  }

  return await response.json()
}

/**
 * Get currently playing track
 */
export async function getCurrentlyPlaying(accessToken: string): Promise<SpotifyCurrentlyPlaying | null> {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (response.status === 204) {
    // Nothing is playing
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to get currently playing track')
  }

  return await response.json()
}

/**
 * Generate Spotify authorization URL
 */
export function generateAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI

  if (!clientId || !redirectUri) {
    throw new Error('Missing Spotify environment variables')
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

  return `https://accounts.spotify.com/authorize?${params}`
}
