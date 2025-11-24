'use client'

import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-white px-6">
      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">Welcome to ReminderSync</h1>
        <p className="text-gray-600 text-lg mb-8">
          Keep your reminders, devices, and Spotify in sync — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={() => router.push('/signup')}>
            Get Started
          </Button>
          <Button variant="outline" onClick={() => router.push('/login')}>
            Log In
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl">
        <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
          <h2 className="font-bold text-xl mb-2">Smart Reminders</h2>
          <p className="text-gray-600">
            Schedule reminders and get real-time alerts on your ESP32 devices.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
          <h2 className="font-bold text-xl mb-2">Spotify Integration</h2>
          <p className="text-gray-600">
            See what's playing on Spotify and sync your music experience.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
          <h2 className="font-bold text-xl mb-2">Multi-Device Support</h2>
          <p className="text-gray-600">
            Connect multiple ESP32 devices and manage them from your dashboard.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} ReminderSync. All rights reserved.
      </footer>
    </div>
  )
}
