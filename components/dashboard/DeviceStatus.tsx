'use client'

import { Monitor, Wifi, WifiOff } from 'lucide-react'
import { Device } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface DeviceStatusProps {
  device: Device
}

export default function DeviceStatus({ device }: DeviceStatusProps) {
  const lastSeenText = formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })
  
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded">
            <Monitor size={24} />
          </div>
          <div>
            <h3 className="font-semibold">{device.device_name}</h3>
            <p className="text-xs text-gray-500 font-mono">{device.device_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {device.is_online ? (
            <>
              <Wifi size={16} className="text-green-600" />
              <span className="text-sm text-green-600">Online</span>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-600" />
              <span className="text-sm text-red-600">Offline</span>
            </>
          )}
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Last seen: {lastSeenText}
      </div>
    </div>
  )
}