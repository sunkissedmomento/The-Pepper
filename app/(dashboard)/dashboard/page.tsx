'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Reminder, Device, NowPlaying } from '@/types'
import ReminderCard from '@/components/dashboard/ReminderCard'
import DeviceStatus from '@/components/dashboard/DeviceStatus'
import NowPlayingComponent from '@/components/dashboard/NowPlaying'
import AddReminderModal from '@/components/dashboard/AddReminderModal'
import Button from '@/components/ui/Button'
import { Plus, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  
  const supabase = createClient()
  
  useEffect(() => {
    fetchData()
    
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reminders' }, () => {
        fetchReminders()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
        fetchDevices()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'now_playing' }, () => {
        fetchNowPlaying()
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  async function fetchData() {
    setLoading(true)
    await Promise.all([fetchReminders(), fetchDevices(), fetchNowPlaying()])
    setLoading(false)
  }
  
  async function fetchReminders() {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('is_active', true)
      .order('reminder_time', { ascending: true })
    
    if (error) {
      toast.error('Failed to load reminders')
    } else {
      setReminders(data || [])
    }
  }
  
  async function fetchDevices() {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error('Failed to load devices')
    } else {
      setDevices(data || [])
    }
  }
  
  async function fetchNowPlaying() {
    const { data, error } = await supabase
      .from('now_playing')
      .select('*')
      .single()
    
    if (!error && data) {
      setNowPlaying(data)
    }
  }
  
  async function deleteReminder(id: string) {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
    
    if (error) {
      toast.error('Failed to delete reminder')
    } else {
      toast.success('Reminder deleted')
      fetchReminders()
    }
  }
  
  function getDeviceName(deviceId: string) {
    const device = devices.find(d => d.id === deviceId)
    return device?.device_name || 'Unknown Device'
  }
  
  function getReminderCountForDevice(deviceId: string) {
    return reminders.filter(r => r.device_id === deviceId).length
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your reminders and devices</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} className="inline mr-2" />
            New Reminder
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xs font-bold tracking-wide text-gray-500 mb-3">DEVICES</h2>
              <div className="space-y-3">
                {devices.length === 0 ? (
                  <div className="border border-dashed border-gray-400 rounded p-6 text-center bg-white">
                    <p className="text-sm text-gray-500">No devices yet</p>
                  </div>
                ) : (
                  devices.map(device => (
                    <DeviceStatus 
                      key={device.id} 
                      device={device}
                      reminderCount={getReminderCountForDevice(device.id)}
                    />
                  ))
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xs font-bold tracking-wide text-gray-500 mb-3">NOW PLAYING</h2>
              <NowPlayingComponent nowPlaying={nowPlaying} />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-gray-500" />
              <h2 className="text-xs font-bold tracking-wide text-gray-500">UPCOMING REMINDERS</h2>
            </div>
            <div className="space-y-3">
              {reminders.length === 0 ? (
                <div className="border border-dashed border-gray-400 rounded p-12 text-center bg-white">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2 font-medium">No reminders scheduled</p>
                  <p className="text-sm text-gray-500 mb-4">Create your first reminder to get started</p>
                  <Button variant="outline" onClick={() => setShowAddModal(true)}>
                    <Plus size={16} className="inline mr-2" />
                    Create Reminder
                  </Button>
                </div>
              ) : (
                reminders.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    deviceName={getDeviceName(reminder.device_id)}
                    onEdit={(r) => console.log('Edit', r)}
                    onDelete={deleteReminder}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AddReminderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchReminders}
      />
    </>
  )
}
