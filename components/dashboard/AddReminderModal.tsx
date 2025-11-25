'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Device } from '@/types'
import toast from 'react-hot-toast'

interface AddReminderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddReminderModal({ isOpen, onClose, onSuccess }: AddReminderModalProps) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [reminderTime, setReminderTime] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState('daily')
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()
  
  useEffect(() => {
    if (isOpen) {
      fetchDevices()
    }
  }, [isOpen])
  
  async function fetchDevices() {
    const { data } = await supabase.from('devices').select('*')
    if (data) {
      setDevices(data)
      if (data.length > 0) setDeviceId(data[0].id)
    }
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase.from('reminders').insert({
      user_id: user.id,
      device_id: deviceId,
      title,
      message: message || null,
      reminder_time: new Date(reminderTime).toISOString(),
      is_recurring: isRecurring,
      recurrence_pattern: isRecurring ? recurrencePattern : null,
      is_active: true,
      is_dismissed: false
    })
    
    setLoading(false)
    
    if (error) {
      toast.error('Failed to create reminder')
    } else {
      toast.success('Reminder created!')
      onSuccess()
      onClose()
      resetForm()
    }
  }
  
  function resetForm() {
    setTitle('')
    setMessage('')
    setReminderTime('')
    setIsRecurring(false)
    setRecurrencePattern('daily')
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Reminder">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Message (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Date & Time *</label>
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Device *</label>
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            required
          >
            {devices.map(device => (
              <option key={device.id} value={device.id}>
                {device.device_name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Repeat</span>
          </label>
        </div>
        
        {isRecurring && (
          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <select
              value={recurrencePattern}
              onChange={(e) => setRecurrencePattern(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={onClose} type="button" className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create Reminder'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
