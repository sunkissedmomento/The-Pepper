'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Music, CheckCircle, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'

function SettingsContent() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [spotifyConnected, setSpotifyConnected] = useState(false)
  const [spotifyUserId, setSpotifyUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    fetchUserData()
    
    if (searchParams.get('spotify') === 'connected') {
      toast.success('Spotify connected successfully!')
      router.replace('/settings')
    }
    
    if (searchParams.get('error') === 'spotify_auth_failed') {
      toast.error('Failed to connect Spotify')
      router.replace('/settings')
    }
  }, [])
  
  async function fetchUserData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setEmail(user.email || '')
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, spotify_user_id')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setUsername(profile.username || '')
        setSpotifyConnected(!!profile.spotify_user_id)
        setSpotifyUserId(profile.spotify_user_id || '')
      }
    }
    setLoading(false)
  }
  
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id)
    
    setSaving(false)
    
    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated!')
    }
  }
  
  function handleConnectSpotify() {
    window.location.href = '/api/auth/spotify/connect'
  }
  
  async function handleDisconnectSpotify() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase
      .from('profiles')
      .update({
        spotify_access_token: null,
        spotify_refresh_token: null,
        spotify_user_id: null
      })
      .eq('id', user.id)
    
    if (error) {
      toast.error('Failed to disconnect Spotify')
    } else {
      toast.success('Spotify disconnected')
      setSpotifyConnected(false)
      setSpotifyUserId('')
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-sm text-gray-600">Manage your account and integrations</p>
      </div>
      
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="border border-gray-300 rounded bg-white">
          <div className="border-b border-gray-300 px-6 py-4">
            <h2 className="font-bold text-lg">Profile</h2>
          </div>
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded hover:opacity-90 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
        
        {/* Spotify Integration */}
        <div className="border border-gray-300 rounded bg-white">
          <div className="border-b border-gray-300 px-6 py-4">
            <div className="flex items-center gap-2">
              <Music size={20} />
              <h2 className="font-bold text-lg">Spotify Integration</h2>
            </div>
          </div>
          <div className="p-6">
            {spotifyConnected ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                      <p className="font-medium">Connected</p>
                      <p className="text-sm text-gray-600">User ID: {spotifyUserId}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleDisconnectSpotify}>
                    Disconnect
                  </Button>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded p-4">
                  <p className="text-xs text-gray-600">
                    Your ESP32 device will display your currently playing track on Page 3.
                    Make sure to play music on your Spotify account to see it on your device.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <XCircle size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium">Not Connected</p>
                    <p className="text-sm text-gray-600">Connect to show now playing on your device</p>
                  </div>
                </div>
                <Button variant="primary" onClick={handleConnectSpotify}>
                  <Music size={16} className="inline mr-2" />
                  Connect Spotify
                </Button>
                <div className="bg-gray-50 border border-gray-300 rounded p-4 mt-4">
                  <p className="text-xs font-bold mb-2 text-gray-500">REQUIREMENTS:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Spotify Premium account required</li>
                    <li>• Permission to read playback state</li>
                    <li>• Currently playing track info</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Preferences */}
        <div className="border border-gray-300 rounded bg-white">
          <div className="border-b border-gray-300 px-6 py-4">
            <h2 className="font-bold text-lg">Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Show Spotify on ESP32</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Device auto-discovery</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Email notifications</span>
              <input type="checkbox" className="w-4 h-4" />
            </label>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="border border-red-300 rounded bg-white">
          <div className="border-b border-red-300 px-6 py-4 bg-red-50">
            <h2 className="font-bold text-lg text-red-600">Danger Zone</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. All your reminders and devices will be permanently removed.
            </p>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}