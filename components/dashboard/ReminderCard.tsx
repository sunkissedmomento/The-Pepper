'use client'

import { Trash2, Edit, Clock } from 'lucide-react'
import { Reminder } from '@/types'
import { format } from 'date-fns'

interface ReminderCardProps {
  reminder: Reminder
  onEdit: (reminder: Reminder) => void
  onDelete: (id: string) => void
}

export default function ReminderCard({ reminder, onEdit, onDelete }: ReminderCardProps) {
  const formattedTime = format(new Date(reminder.reminder_time), 'h:mm a, MMM d')
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{reminder.title}</h3>
          {reminder.message && (
            <p className="text-sm text-gray-600 mt-1">{reminder.message}</p>
          )}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <Clock size={14} />
            <span>{formattedTime}</span>
            {reminder.is_recurring && (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                {reminder.recurrence_pattern}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(reminder)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(reminder.id)}
            className="p-2 hover:bg-red-50 rounded text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}