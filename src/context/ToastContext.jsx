import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext({})

const COLORS = {
  success: 'var(--color-success, #22C55E)', error: 'var(--color-error, #EF4444)',
  info: 'var(--color-primary, #1E3A5F)', warning: '#F59E0B', coin: 'var(--color-accent, #D4AF37)',
}
const ICONS = {
  success:'✅', error:'❌', info:'ℹ️', warning:'⚠️', coin:'🪙',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((type = 'info', message = '') => {
    const id = Date.now()
    setToasts(p => [...p, { id, type, message }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const dismiss = (id) => setToasts(p => p.filter(t => t.id !== id))

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24,
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        gap: 8, zIndex: 9999, pointerEvents: 'none',
        width: 320,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: COLORS[t.type] || COLORS.info,
            color: '#fff', padding: '12px 16px',
            borderRadius: 16, display: 'flex',
            alignItems: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            pointerEvents: 'auto',
            animation: 'slideUp 0.3s ease',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[t.type]}</span>
            <span style={{ fontSize: 13, fontWeight: 600,
              fontFamily: 'Poppins,sans-serif', flex: 1 }}>
              {t.message}
            </span>
            <button onClick={() => dismiss(t.id)} style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.7)', fontSize: 18,
              cursor: 'pointer', flexShrink: 0,
            }}>×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
