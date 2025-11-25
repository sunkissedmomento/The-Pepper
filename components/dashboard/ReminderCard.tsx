'use client'

import { Trash2, Edit, Clock, Repeat } from 'lucide-react'
import { Reminder } from '@/types'
import { format } from 'date-fns'

interface ReminderCardProps {
  reminder: Reminder
  deviceName?: string
  onEdit: (reminder: Reminder) => void
  onDelete: (id: string) => void
}

export default function ReminderCard({ reminder, deviceName, onEdit, onDelete }: ReminderCardProps) {
  const formattedTime = format(new Date(reminder.reminder_time), 'h:mm a, MMM d, yyyy')
  
  return (
    <div className="border border-gray-300 rounded p-4 hover:border-black transition-colors bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{reminder.title}</h3>
          {reminder.message && (
            <p className="text-sm text-gray-600 mb-2">{reminder.message}</p>
          )}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formattedTime}</span>
            </div>
            {reminder.is_recurring && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                <Repeat size={12} />
                <span className="text-xs font-medium">{reminder.recurrence_pattern}</span>
              </div>
            )}
          </div>
          {deviceName && (
            <p className="text-xs text-gray-400 mt-2">Device: {deviceName}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(reminder)}
            className="p-2 hover:bg-gray-100 rounded border border-gray-300"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(reminder.id)}
            className="p-2 hover:bg-gray-100 rounded border border-gray-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}