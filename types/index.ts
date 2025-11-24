export interface Device {
  id: string
  device_id: string
  device_name: string
  is_online: boolean
  last_seen: string
  created_at: string
}

export interface Reminder {
  id: string
  title: string
  message?: string
  reminder_time: string
  is_recurring: boolean
  recurrence_pattern?: string
  is_active: boolean
  is_dismissed: boolean
  device_id: string
  created_at: string
}

export interface NowPlaying {
  track_name: string
  artist_name: string
  album_name: string
  is_playing: boolean
  updated_at: string
}

export interface Profile {
  id: string
  username: string
  spotify_user_id?: string
}
