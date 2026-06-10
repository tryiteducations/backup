import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const PAGE_TITLES = {
  '/dashboard':      'Dashboard',
  '/test-engine':    'Test Engine',
  '/exams':          'All Exams',
  '/subjects':       'Subjects',
  '/games':          'Brain Games',
  '/guru-hub':       'Guru Hub',
  '/hall':           'The Hall',
  '/tournaments':    'Tournaments',
  '/classroom':      'Classroom',
  '/current-affairs':'Current Affairs',
  '/scholarships':   'Scholarships',
  '/analytics':      'My Analytics',
  '/pro':            'Pro Member',
  '/profile':        'My Profile',
  '/settings':       'Settings',
  '/notifications':  'Notifications',
  '/journey':        'My Journey',
  '/ebooks':         'Guru Books',
  '/impact':         'Our Impact',
  '/equity':         'Free Access',
}

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'TryIT'

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Topbar
        onMenuClick={() => setSidebarOpen(true)}
        title={title}
      />
      <main className="lg:ml-[260px] mt-[68px] p-5 md:p-6 min-h-[calc(100vh-68px)]">
        {children}
      </main>
    </div>
  )
}
