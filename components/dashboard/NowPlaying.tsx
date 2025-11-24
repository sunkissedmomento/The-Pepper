'use client'

import { Music, Pause, Play } from 'lucide-react'
import { NowPlaying as NowPlayingType } from '@/types'

interface NowPlayingProps {
  nowPlaying: NowPlayingType | null
}

export default function NowPlaying({ nowPlaying }: NowPlayingProps) {
  if (!nowPlaying) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 text-center">
        <Music size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">Connect Spotify to see what's playing</p>
      </div>
    )
  }
  
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        {nowPlaying.is_playing ? (
          <Play size={16} className="text-green-600" />
        ) : (
          <Pause size={16} className="text-gray-400" />
        )}
        <span className="text-xs font-medium text-gray-500">
          {nowPlaying.is_playing ? 'NOW PLAYING' : 'PAUSED'}
        </span>
      </div>
      <h3 className="font-semibold text-lg mb-1">{nowPlaying.track_name}</h3>
      <p className="text-sm text-gray-600">{nowPlaying.artist_name}</p>
      {nowPlaying.album_name && (
        <p className="text-xs text-gray-400 mt-2">{nowPlaying.album_name}</p>
      )}
    </div>
  )
}