// src/components/layout/DashboardLayout.jsx
// Unified dashboard layout for all 4 roles (student, mentor, institution, family)
import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * DashboardLayout
 * Props:
 *   role: 'student' | 'mentor' | 'institution' | 'family'
 *   navigation: array of nav items [{icon, label, path}, ...]
 *   children: main content
 *   title: page title
 *   headerWidgets: optional right-side widgets
 *   customizableItems: items user can hide/show [{id, label, visible}, ...]
 */
export default function DashboardLayout({
  role = 'student',
  navigation = [],
  children,
  title = 'Dashboard',
  headerWidgets = [],
  customizableItems = [],
  onCustomizationChange = null,
}) {
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const location = useLocation()

  // Colors from theme
  const p = theme?.primary || '#1E3A5F'
  const a = theme?.accent || '#C9A84C'
  const t = theme?.text || '#1E293B'
  const m = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const c = theme?.surface || '#FFFFFF'
  const b = theme?.border || '#E2E8F0'

  // State
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [sideOpen, setSideOpen] = useState(true)
  const [sideHover, setSideHover] = useState(false)
  const sideVisible = isMobile ? true : (sideOpen || sideHover)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [visibleItems, setVisibleItems] = useState(
    customizableItems.reduce((acc, item) => ({ ...acc, [item.id]: item.visible !== false }), {})
  )

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(mobile ? false : true)
    }
    
    // Check initial state on mount
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout()
      nav('/login')
    }
  }

  const handleCustomizationChange = (itemId) => {
    const newVisible = { ...visibleItems, [itemId]: !visibleItems[itemId] }
    setVisibleItems(newVisible)
    if (onCustomizationChange) onCustomizationChange(newVisible)
    // Save to localStorage
    localStorage.setItem(`dashboard_customization_${role}`, JSON.stringify(newVisible))
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: bg,
      fontFamily: 'Inter, sans-serif',
      color: t,
    }}>
      {/* MOBILE OVERLAY */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 250,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* SIDEBAR */}
      <div
        onMouseEnter={() => !isMobile && setSideHover(true)}
        onMouseLeave={() => !isMobile && setSideHover(false)}
        style={{
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (sidebarOpen ? 0 : -260) : 0,
        top: 0,
        width: isMobile ? 260 : (sideVisible ? 260 : 68),
        height: '100vh',
        background: p,
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        transition: 'left 0.3s ease, width 0.28s cubic-bezier(0.23,1,0.32,1)',
        boxShadow: isMobile && sidebarOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px 16px',
          borderBottom: `1px solid rgba(255,255,255,0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: a,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: p,
              fontSize: 14,
            }}>T</div>
            {sideVisible && (
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                TryIT
                <br />
                <span style={{ fontSize: 10, opacity: 0.7 }}>{role.toUpperCase()}</span>
              </div>
            )}
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>✕</button>
          )}
          {!isMobile && (
            <button onClick={() => setSideOpen(o => !o)} style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              width: 28,
              height: 28,
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>{sideOpen ? '←' : '→'}</button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 8px', overflow: 'auto' }}>
          {navigation.map((item, idx) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={idx}
                onClick={() => {
                  nav(item.path)
                  if (isMobile) setSidebarOpen(false)
                }}
                style={{
                  width: '100%',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 14px',
                  borderRadius: 10,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                  marginBottom: 4,
                  borderLeft: isActive ? `3px solid ${a}` : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.background = 'rgba(255,255,255,0.08)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.background = 'transparent'
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {sideVisible && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                {isActive && sideVisible && <span style={{ marginLeft: 'auto', color: a }}>→</span>}
              </button>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div style={{
          padding: '16px',
          borderTop: `1px solid rgba(255,255,255,0.1)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            padding: '12px',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: a,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              {user?.avatar || '👤'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              border: 'none',
              color: '#fff',
              padding: '10px 12px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* HEADER */}
        <header style={{
          background: c,
          borderBottom: `1px solid ${b}`,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 70,
          flexShrink: 0,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}>
          {/* Left: Menu toggle & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: p,
                  padding: 0,
                }}
              >
                ☰
              </button>
            )}
            <h1 style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: p,
              display: isMobile ? 'none' : 'block',
            }}>
              {title}
            </h1>
          </div>

          {/* Right: Widgets & Customizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Header Widgets */}
            {headerWidgets.map((widget, idx) => (
              <div key={idx}>{widget}</div>
            ))}

            {/* Customizer Button */}
            {customizableItems.length > 0 && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowCustomizer(!showCustomizer)}
                  title="Customize Dashboard"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${b}`,
                    borderRadius: 8,
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: p,
                    fontSize: 18,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.05)'
                    e.target.style.borderColor = a
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.borderColor = b
                  }}
                >
                  ⚙️
                </button>

                {/* Customizer Dropdown */}
                {showCustomizer && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    background: c,
                    border: `1px solid ${b}`,
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 1000,
                    minWidth: 220,
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${b}`,
                      fontWeight: 600,
                      fontSize: 13,
                      color: p,
                    }}>
                      Dashboard Items
                    </div>
                    <div style={{ padding: '8px' }}>
                      {customizableItems.map((item) => (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 12px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <input
                            type="checkbox"
                            checked={visibleItems[item.id] || false}
                            onChange={() => handleCustomizationChange(item.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* CONTENT AREA */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          background: bg,
        }}>
          {children}
        </main>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 250,
          }}
        />
      )}
    </div>
  )
}
