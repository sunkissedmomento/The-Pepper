'use client'

import { Monitor, Wifi, WifiOff } from 'lucide-react'
import { Device } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface DeviceStatusProps {
  device: Device
  reminderCount?: number
}

export default function DeviceStatus({ device, reminderCount = 0 }: DeviceStatusProps) {
  const lastSeenText = formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })
  
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded border border-gray-300">
            <Monitor size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{device.device_name}</h3>
            <p className="text-xs text-gray-500 font-mono">{device.device_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {device.is_online ? (
            <Wifi size={14} className="text-black" />
          ) : (
            <WifiOff size={14} className="text-gray-400" />
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <p>Last seen: {lastSeenText}</p>
        <p>Active reminders: {reminderCount}</p>
      </div>
    </div>
  )
}