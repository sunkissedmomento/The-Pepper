'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Device } from '@/types'
import { Monitor, Wifi, WifiOff, Trash2, Edit2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  
  useEffect(() => {
    fetchDevices()
    
    const channel = supabase
      .channel('devices-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
        fetchDevices()
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  async function fetchDevices() {
    setLoading(true)
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error('Failed to load devices')
    } else {
      setDevices(data || [])
    }
    setLoading(false)
  }
  
  async function deleteDevice(id: string) {
    if (!confirm('Are you sure you want to remove this device?')) return
    
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id)
    
    if (error) {
      toast.error('Failed to delete device')
    } else {
      toast.success('Device removed')
      fetchDevices()
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    )
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Devices</h1>
        <p className="text-sm text-gray-600">Manage your connected ESP32 devices</p>
      </div>
      
      {devices.length === 0 ? (
        <div className="border border-dashed border-gray-400 rounded p-12 text-center bg-white">
          <Monitor size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="font-bold text-lg mb-2">No Devices Connected</h3>
          <p className="text-sm text-gray-600 mb-4">
            Power on your ESP32 device to automatically register it here
          </p>
          <div className="max-w-md mx-auto bg-gray-50 border border-gray-300 rounded p-4 text-left">
            <p className="text-xs font-bold mb-2 text-gray-500">QUICK SETUP:</p>
            <ol className="text-xs text-gray-600 space-y-1">
              <li>1. Flash ESP32 with provided firmware</li>
              <li>2. Configure WiFi credentials</li>
              <li>3. Power on device</li>
              <li>4. Device will appear here automatically</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {devices.map(device => (
            <div key={device.id} className="border border-gray-300 rounded bg-white overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded border ${device.is_online ? 'bg-black text-white border-black' : 'bg-gray-100 border-gray-300'}`}>
                      <Monitor size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{device.device_name}</h3>
                      <p className="text-xs text-gray-500 font-mono mb-3">{device.device_id}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          {device.is_online ? (
                            <>
                              <Wifi size={14} className="text-green-600" />
                              <span className="font-medium text-green-600">Online</span>
                            </>
                          ) : (
                            <>
                              <WifiOff size={14} className="text-red-600" />
                              <span className="font-medium text-red-600">Offline</span>
                            </>
                          )}
                        </div>
                        <span className="text-gray-500">
                          Last seen {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded border border-gray-300"
                      onClick={() => toast('Edit feature coming soon')}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded border border-gray-300"
                      onClick={() => deleteDevice(device.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 border-t border-gray-300 px-6 py-3">
                <p className="text-xs text-gray-600">
                  Created {formatDistanceToNow(new Date(device.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}