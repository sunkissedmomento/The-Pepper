
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import '../globals.css'

export const metadata: Metadata = {
  title: 'ReminderSync - Smart Reminders',
  description: 'Sync reminders across all your devices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}