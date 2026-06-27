// src/components/layout/AppLayout.jsx
import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../context/AuthContext'
import ImpersonationBanner from '../ImpersonationBanner'

export default function AppLayout({ children, title = 'Dashboard' }) {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'linear-gradient(135deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))' }}>
      <p style={{ color:'var(--color-accent, #D4AF37)', fontFamily:'Poppins,sans-serif', fontSize:18, fontWeight:700 }}>
        Loading...
      </p>
    </div>
  )

  if (!user) { window.location.href = "/login"; return null }

  return (
    <>
      <ImpersonationBanner />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
      <main
        className="lg:ml-[260px]"
        style={{ paddingTop: '68px', minHeight: '100vh', background: 'var(--color-background, #F8FAFC)', color: 'var(--color-text, #1E293B)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px 40px' }}>
          {children}
        </div>
      </main>
    </>
  )
}

