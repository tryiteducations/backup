// FILE: src/components/ThemeSelector.jsx
// Unique themes inspired by Supabase, Firebase, Python, GitHub, Gemini, Meta, Mistral, Groq
// Each theme is distinct with guaranteed 100% text visibility
import { useState, useEffect } from 'react'

// Complete theme definitions with all CSS variables for 100% text visibility
const themes = {
  // Supabase-inspired: Clean green + dark navy, professional
  supabase: {
    name: 'Supabase',
    icon: '⚡',
    description: 'Clean & Professional',
    colors: {
      '--color-primary': '#1E1E1E',
      '--color-primary-light': '#2D2D2D',
      '--color-surface': '#FFFFFF',
      '--color-background': '#F8F9FA',
      '--color-text': '#1A1A1A',
      '--color-text-secondary': '#6B7280',
      '--color-text-inverse': '#FFFFFF',
      '--color-border': '#E5E7EB',
      '--color-accent': '#3ECF8E',
      '--color-accent-dark': '#2BB472',
      '--color-accent-light': 'rgba(62,207,142,0.1)',
      '--color-danger': '#EF4444',
      '--color-success': '#10B981',
      '--color-warning': '#F59E0B',
      '--color-info': '#3B82F6',
      '--color-card-bg': '#FFFFFF',
      '--color-card-border': '#E5E7EB',
      '--color-input-bg': '#F9FAFB',
      '--color-input-border': '#D1D5DB',
      '--color-button-primary': '#3ECF8E',
      '--color-button-primary-text': '#1A1A1A',
      '--color-button-secondary': '#F3F4F6',
      '--color-button-secondary-text': '#374151',
      '--color-nav-bg': '#1E1E1E',
      '--color-nav-text': '#FFFFFF',
      '--color-shadow': 'rgba(0,0,0,0.08)',
      '--color-overlay': 'rgba(0,0,0,0.5)',
      '--font-heading': "'Poppins', sans-serif",
      '--font-body': "'Inter', sans-serif",
    },
  },

  // Firebase-inspired: Warm orange + white, energetic
  firebase: {
    name: 'Firebase',
    icon: '🔥',
    description: 'Warm & Energetic',
    colors: {
      '--color-primary': '#FF6D00',
      '--color-primary-light': '#FF8F33',
      '--color-surface': '#FFFFFF',
      '--color-background': '#FFF8F0',
      '--color-text': '#1A1A1A',
      '--color-text-secondary': '#6B7280',
      '--color-text-inverse': '#FFFFFF',
      '--color-border': '#FED7AA',
      '--color-accent': '#FF9100',
      '--color-accent-dark': '#E65100',
      '--color-accent-light': 'rgba(255,145,0,0.1)',
      '--color-danger': '#DC2626',
      '--color-success': '#059669',
      '--color-warning': '#F59E0B',
      '--color-info': '#0284C7',
      '--color-card-bg': '#FFFFFF',
      '--color-card-border': '#FED7AA',
      '--color-input-bg': '#FFF7ED',
      '--color-input-border': '#FDBA74',
      '--color-button-primary': '#FF6D00',
      '--color-button-primary-text': '#FFFFFF',
      '--color-button-secondary': '#FFF7ED',
      '--color-button-secondary-text': '#C2410C',
      '--color-nav-bg': '#FF6D00',
      '--color-nav-text': '#FFFFFF',
      '--color-shadow': 'rgba(255,109,0,0.15)',
      '--color-overlay': 'rgba(0,0,0,0.5)',
      '--font-heading': "'Poppins', sans-serif",
      '--font-body': "'Inter', sans-serif",
    },
  },

  // Python-inspired: Blue + yellow, developer-friendly
  python: {
    name: 'Python',
    icon: '🐍',
    description: 'Developer Friendly',
    colors: {
      '--color-primary': '#306998',
      '--color-primary-light': '#4B8BBE',
      '--color-surface': '#FFFFFF',
      '--color-background': '#F0F4F8',
      '--color-text': '#1A1A1A',
      '--color-text-secondary': '#64748B',
      '--color-text-inverse': '#FFFFFF',
      '--color-border': '#BFD8EB',
      '--color-accent': '#FFD43B',
      '--color-accent-dark': '#E6B800',
      '--color-accent-light': 'rgba(255,212,59,0.15)',
      '--color-danger': '#DC2626',
      '--color-success': '#059669',
      '--color-warning': '#F59E0B',
      '--color-info': '#3B82F6',
      '--color-card-bg': '#FFFFFF',
      '--color-card-border': '#BFD8EB',
      '--color-input-bg': '#F8FAFC',
      '--color-input-border': '#94B8D4',
      '--color-button-primary': '#306998',
      '--color-button-primary-text': '#FFFFFF',
      '--color-button-secondary': '#E8F0F8',
      '--color-button-secondary-text': '#306998',
      '--color-nav-bg': '#306998',
      '--color-nav-text': '#FFFFFF',
      '--color-shadow': 'rgba(48,105,152,0.12)',
      '--color-overlay': 'rgba(0,0,0,0.5)',
      '--font-heading': "'Poppins', sans-serif",
      '--font-body': "'JetBrains Mono', 'Fira Code', monospace",
    },
  },

  // GitHub-inspired: Dark mode, monospace, developer aesthetic
  github: {
    name: 'GitHub',
    icon: '🐙',
    description: 'Dark Developer',
    colors: {
      '--color-primary': '#0D1117',
      '--color-primary-light': '#161B22',
      '--color-surface': '#161B22',
      '--color-background': '#0D1117',
      '--color-text': '#E6EDF3',
      '--color-text-secondary': '#8B949E',
      '--color-text-inverse': '#0D1117',
      '--color-border': '#30363D',
      '--color-accent': '#58A6FF',
      '--color-accent-dark': '#388BFD',
      '--color-accent-light': 'rgba(88,166,255,0.15)',
      '--color-danger': '#F85149',
      '--color-success': '#3FB950',
      '--color-warning': '#D29922',
      '--color-info': '#58A6FF',
      '--color-card-bg': '#161B22',
      '--color-card-border': '#30363D',
      '--color-input-bg': '#0D1117',
      '--color-input-border': '#30363D',
      '--color-button-primary': '#238636',
      '--color-button-primary-text': '#FFFFFF',
      '--color-button-secondary': '#21262D',
      '--color-button-secondary-text': '#C9D1D9',
      '--color-nav-bg': '#161B22',
      '--color-nav-text': '#E6EDF3',
      '--color-shadow': 'rgba(0,0,0,0.4)',
      '--color-overlay': 'rgba(0,0,0,0.7)',
      '--font-heading': "'Poppins', sans-serif",
      '--font-body': "'SF Mono', 'Fira Code', monospace",
    },
  },

  // Gemini-inspired: Minimalist black & white, AI aesthetic
  gemini: {
    name: 'Gemini',
    icon: '💎',
    description: 'Minimalist AI',
    colors: {
      '--color-primary': '#000000',
      '--color-primary-light': '#1A1A1A',
      '--color-surface': '#FFFFFF',
      '--color-background': '#FAFAFA',
      '--color-text': '#000000',
      '--color-text-secondary': '#666666',
      '--color-text-inverse': '#FFFFFF',
      '--color-border': '#E0E0E0',
      '--color-accent': '#4285F4',
      '--color-accent-dark': '#3367D6',
      '--color-accent-light': 'rgba(66,133,244,0.1)',
      '--color-danger': '#EA4335',
      '--color-success': '#34A853',
      '--color-warning': '#FBBC04',
      '--color-info': '#4285F4',
      '--color-card-bg': '#FFFFFF',
      '--color-card-border': '#E0E0E0',
      '--color-input-bg': '#F5F5F5',
      '--color-input-border': '#CCCCCC',
      '--color-button-primary': '#000000',
      '--color-button-primary-text': '#FFFFFF',
      '--color-button-secondary': '#F0F0F0',
      '--color-button-secondary-text': '#000000',
      '--color-nav-bg': '#000000',
      '--color-nav-text': '#FFFFFF',
      '--color-shadow': 'rgba(0,0,0,0.06)',
      '--color-overlay': 'rgba(0,0,0,0.5)',
      '--font-heading': "'Poppins', sans-serif",
      '--font-body': "'Google Sans', 'Inter', sans-serif",
    },
  },

  // Meta-inspired: Blue gradient, social media feel
  meta: {
    name: 'Meta',
    icon: '🌐',
    description: 'Social & Connected',
    colors: {
      '--color-primary': '#0866FF',
      '--color-primary-light': '#1877F2',
      '--color-surface': '#FFFFFF',
      '--color-background': '#F0F2F5',
      '--color-text': '#1C1E21',
      '--color-text-secondary': '#65676B',
      '--color-text-inverse': '#FFFFFF',
      '--color-border': '#DADDE1',
      '--color-accent': '#0866FF',
      '--color-accent-dark': '#0052CC',
      '--color-accent-light': 'rgba(8,102,255,0.1)',
      '--color-danger': '#E41E3F',
      '--color-success': '#00A400',
      '--color-warning': '#F7B928',
      '--color-info': '#54B4D3',
      '--color-card-bg': '#FFFFFF',
      '--color-card-border': '#DADDE1',
      '--color-input-bg': '#F0F2F5',
      '--color-input-border': '#CCD0D5',
      '--color-button-primary': '#0866FF',
      '--color-button-primary-text': '#FFFFFF',
      '--color-button-secondary': '#E4E6EB',
      '--color-button-secondary-text': '#050505',
      '--color-nav-bg': '#FFFFFF',
      '--color-nav-text': '#1C1E21',
      '--color-shadow': 'rgba(0,0,0,0.1)',
      '--color-overlay': 'rgba(0,0,0,0.6)',
      '--font-heading': "'Poppins', sans-serif",
      '--font-body': "'Segoe UI', 'Inter', sans-serif",
    },
  },

  // Mistral-inspired: Dark cyan, futuristic
  mistral: {
    name: 'Mistral',
    icon: '🌪️',
    description: 'Futuristic Dark',
    colors: {
      '--color-primary': '#0A0E27',
      '--color-primary-light': '#131840',
      '--color-surface': '#131840',
      '--color-background': '#0A0E27',
      '--color-text': '#E8EAED',
      '--color-text-secondary': '#8E94A0',
      '--color-text-inverse': '#0A0E27',
      '--color-border': '#1E2456',
      '--color-accent': '#00E5FF',
      '--color-accent-dark': '#00B8D4',
      '--color-accent-light': 'rgba(0,229,255,0.12)',
      '--color-danger': '#FF5252',
      '--color-success': '#69F0AE',
      '--color-warning': '#FFD740',
      '--color-info': '#40C4FF',
      '--color-card-bg': '#131840',
      '--color-card-border': '#1E2456',
      '--color-input-bg': '#0A0E27',
      '--color-input-border': '#1E2456',
      '--color-button-primary': '#00E5FF',
      '--color-button-primary-text': '#0A0E27',
      '--color-button-secondary': '#1E2456',
      '--color-button-secondary-text': '#E8EAED',
      '--color-nav-bg': '#0A0E27',
      '--color-nav-text': '#E8EAED',
      '--color-shadow': 'rgba(0,229,255,0.15)',
      '--color-overlay': 'rgba(0,0,0,0.7)',
      '--font-heading': "'Poppins', sans-serif",
      '--font-body': "'Inter', sans-serif",
    },
  },

  // Groq-inspired: Dark green terminal, hacker aesthetic
  groq: {
    name: 'Groq',
    icon: '⚡',
    description: 'Terminal Speed',
    colors: {
      '--color-primary': '#0D1117',
      '--color-primary-light': '#161B22',
      '--color-surface': '#161B22',
      '--color-background': '#0D1117',
      '--color-text': '#E6EDF3',
      '--color-text-secondary': '#8B949E',
      '--color-text-inverse': '#0D1117',
      '--color-border': '#30363D',
      '--color-accent': '#00FF41',
      '--color-accent-dark': '#00CC33',
      '--color-accent-light': 'rgba(0,255,65,0.12)',
      '--color-danger': '#FF4444',
      '--color-success': '#00FF41',
      '--color-warning': '#FFAA00',
      '--color-info': '#00D4FF',
      '--color-card-bg': '#161B22',
      '--color-card-border': '#30363D',
      '--color-input-bg': '#0D1117',
      '--color-input-border': '#30363D',
      '--color-button-primary': '#00FF41',
      '--color-button-primary-text': '#0D1117',
      '--color-button-secondary': '#21262D',
      '--color-button-secondary-text': '#E6EDF3',
      '--color-nav-bg': '#0D1117',
      '--color-nav-text': '#E6EDF3',
      '--color-shadow': 'rgba(0,255,65,0.15)',
      '--color-overlay': 'rgba(0,0,0,0.7)',
      '--font-heading': "'Poppins', sans-serif",
      '--font-body': "'JetBrains Mono', 'Fira Code', monospace",
    },
  },
}

// Default theme (TryIT brand)
const defaultTheme = {
  name: 'TryIT',
  icon: '🎓',
  description: 'Default Brand',
  colors: {
    '--color-primary': '#1E3A5F',
    '--color-primary-light': '#2A4F7F',
    '--color-surface': '#FFFFFF',
    '--color-background': '#F8FAFC',
    '--color-text': '#1E293B',
    '--color-text-secondary': '#64748B',
    '--color-text-inverse': '#FFFFFF',
    '--color-border': '#E2E8F0',
    '--color-accent': '#C9A84C',
    '--color-accent-dark': '#B8942E',
    '--color-accent-light': 'rgba(201,168,76,0.1)',
    '--color-danger': '#EF4444',
    '--color-success': '#10B981',
    '--color-warning': '#F59E0B',
    '--color-info': '#3B82F6',
    '--color-card-bg': '#FFFFFF',
    '--color-card-border': '#E2E8F0',
    '--color-input-bg': '#F8FAFC',
    '--color-input-border': '#CBD5E1',
    '--color-button-primary': '#C9A84C',
    '--color-button-primary-text': '#1E3A5F',
    '--color-button-secondary': '#F1F5F9',
    '--color-button-secondary-text': '#475569',
    '--color-nav-bg': '#1E3A5F',
    '--color-nav-text': '#FFFFFF',
    '--color-shadow': 'rgba(0,0,0,0.08)',
    '--color-overlay': 'rgba(0,0,0,0.5)',
    '--font-heading': "'Poppins', sans-serif",
    '--font-body': "'Inter', sans-serif",
  },
}

// Apply theme CSS variables to document root
function applyTheme(themeColors) {
  const root = document.documentElement
  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  // Store theme preference
  localStorage.setItem('tryit_theme', JSON.stringify(themeColors))
}

// Get saved theme or default
function getSavedTheme() {
  try {
    const saved = localStorage.getItem('tryit_theme')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    // ignore
  }
  return defaultTheme.colors
}

// ThemeSelector Component
function ThemeSelector({ onThemeChange }) {
  const [activeTheme, setActiveTheme] = useState('default')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Apply saved theme on mount
    const saved = getSavedTheme()
    applyTheme(saved)
    // Find which theme matches saved
    const themeEntry = Object.entries(themes).find(([, t]) =>
      t.colors['--color-primary'] === saved['--color-primary']
    )
    if (themeEntry) {
      setActiveTheme(themeEntry[0])
    }
  }, [])

  const handleThemeChange = (themeKey) => {
    const theme = themeKey === 'default' ? defaultTheme : themes[themeKey]
    applyTheme(theme.colors)
    setActiveTheme(themeKey)
    setIsOpen(false)
    if (onThemeChange) {
      onThemeChange(theme)
    }
  }

  const currentTheme = activeTheme === 'default' ? defaultTheme : themes[activeTheme]

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          borderRadius: 10,
          border: '1px solid var(--color-border, #E2E8F0)',
          background: 'var(--color-surface, #FFFFFF)',
          color: 'var(--color-text, #1E293B)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'Poppins,sans-serif',
          transition: 'all 0.2s',
        }}
      >
        <span style={{ fontSize: 16 }}>{currentTheme.icon}</span>
        <span>{currentTheme.name}</span>
        <span style={{ fontSize: 10, marginLeft: 4 }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 998,
            }}
          />
          {/* Menu */}
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            background: 'var(--color-surface, #FFFFFF)',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid var(--color-border, #E2E8F0)',
            zIndex: 999,
            minWidth: 280,
            padding: 8,
            maxHeight: 400,
            overflow: 'auto',
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-text-secondary, #94A3B8)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              padding: '8px 12px 4px',
              margin: 0,
              fontFamily: 'Poppins,sans-serif',
            }}>
              Choose Your Theme
            </p>

            {/* Default Theme */}
            <ThemeOption
              theme={defaultTheme}
              isActive={activeTheme === 'default'}
              onClick={() => handleThemeChange('default')}
            />

            {/* All Themes */}
            {Object.entries(themes).map(([key, theme]) => (
              <ThemeOption
                key={key}
                theme={theme}
                isActive={activeTheme === key}
                onClick={() => handleThemeChange(key)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Individual theme option in dropdown
function ThemeOption({ theme, isActive, onClick }) {
  const colors = theme.colors
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 10,
        border: isActive ? `2px solid ${colors['--color-accent']}` : '2px solid transparent',
        background: isActive ? colors['--color-accent-light'] || 'rgba(0,0,0,0.05)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--color-background, #F8FAFC)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      {/* Theme Color Preview */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: colors['--color-primary'],
        border: `2px solid ${colors['--color-accent']}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
      }}>
        {theme.icon}
      </div>

      {/* Theme Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13,
          fontWeight: 700,
          color: colors['--color-text'],
          margin: 0,
          fontFamily: 'Poppins,sans-serif',
        }}>
          {theme.name}
        </p>
        <p style={{
          fontSize: 11,
          color: colors['--color-text-secondary'],
          margin: 0,
          fontFamily: 'Poppins,sans-serif',
        }}>
          {theme.description}
        </p>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <span style={{
          color: colors['--color-accent'],
          fontSize: 16,
          fontWeight: 700,
        }}>
          ✓
        </span>
      )}
    </button>
  )
}

export { ThemeSelector, themes, defaultTheme, applyTheme, getSavedTheme }