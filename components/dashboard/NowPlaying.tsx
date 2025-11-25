'use client'

import { Music, Pause, Play } from 'lucide-react'
import { NowPlaying as NowPlayingType } from '@/types'

interface NowPlayingProps {
  nowPlaying: NowPlayingType | null
}

export default function NowPlaying({ nowPlaying }: NowPlayingProps) {
  if (!nowPlaying) {
    return (
      <div className="border border-gray-300 rounded p-6 text-center bg-white">
        <Music size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">No music playing</p>
        <p className="text-xs text-gray-400 mt-1">Connect Spotify in Settings</p>
      </div>
    )
  }
  
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="flex items-center gap-2 mb-3">
        {nowPlaying.is_playing ? (
          <Play size={14} className="text-black" />
        ) : (
          <Pause size={14} className="text-gray-400" />
        )}
        <span className="text-xs font-semibold tracking-wide">
          {nowPlaying.is_playing ? 'NOW PLAYING' : 'PAUSED'}
        </span>
      </div>
      <h3 className="font-semibold text-base mb-1 line-clamp-1">{nowPlaying.track_name}</h3>
      <p className="text-sm text-gray-600 line-clamp-1">{nowPlaying.artist_name}</p>
      {nowPlaying.album_name && (
        <p className="text-xs text-gray-400 mt-2 line-clamp-1">{nowPlaying.album_name}</p>
      )}
    </div>
  )
}