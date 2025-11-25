'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Settings, Home, Monitor } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const [username, setUsername] = useState('')
  
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
        if (data) setUsername(data.username)
      }
    }
    getUser()
  }, [])
  
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }
  
  return (
    <nav className="border-b border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold">ReminderSync</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
            >
              <Home size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => router.push('/devices')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
            >
              <Monitor size={18} />
              <span className="text-sm font-medium">Devices</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">@{username}</span>
          <button 
            onClick={() => router.push('/settings')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}