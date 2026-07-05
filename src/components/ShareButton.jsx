// src/components/ShareButton.jsx
// Drop this into any page header to let students share that specific
// page's progress/result as a branded image, instead of only being able
// to share from the main Dashboard.
import { shareProgress } from '../lib/shareImage'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function ShareButton({ headline, stat, subLabel, context, emoji = '🎓', style = {} }) {
  const { theme } = useTheme()
  const { user } = useAuth()

  function handleClick() {
    shareProgress({
      theme,
      name: user?.name || 'Student',
      headline,
      stat,
      subLabel,
      context,
      emoji,
    })
  }

  return (
    <button onClick={handleClick} title="Share this" style={{
      background: 'transparent',
      border: `1px solid ${theme?.border || '#E2E8F0'}`,
      borderRadius: 10,
      width: 38,
      height: 38,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      flexShrink: 0,
      ...style,
    }}>
      📤
    </button>
  )
}
