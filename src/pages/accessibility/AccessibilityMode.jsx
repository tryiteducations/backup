// src/pages/accessibility/AccessibilityMode.jsx
import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const TEXT_SIZES = ['Normal', 'Large', 'Extra Large']
const SIZE_CLASSES = { Normal: 'text-base', Large: 'text-lg', 'Extra Large': 'text-xl' }

function Toggle({ checked, onChange, id }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[var(--color-accent, #D4AF37)]' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

export default function AccessibilityMode() {
  const { user } = useAuth()
  const { setActiveTheme } = useTheme()

  const [textSize, setTextSize] = useState(() => localStorage.getItem('tryit_text_size') || 'Normal')
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('tryit_high_contrast') === 'true')
  const [screenReader, setScreenReader] = useState(() => localStorage.getItem('tryit_screen_reader') === 'true')
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('tryit_reduced_motion') === 'true')

  if (!user) return null

  const handleHighContrast = (val) => {
    setHighContrast(val)
    localStorage.setItem('tryit_high_contrast', String(val))
    if (val) setActiveTheme('high-contrast')
  }

  const handleTextSize = (size) => {
    setTextSize(size)
    localStorage.setItem('tryit_text_size', size)
    document.documentElement.className = document.documentElement.className
      .replace(/\btryit-text-\S+/g, '')
    if (size !== 'Normal') document.documentElement.classList.add(`tryit-text-${size.toLowerCase().replace(' ', '-')}`)
  }

  const handleReducedMotion = (val) => {
    setReducedMotion(val)
    localStorage.setItem('tryit_reduced_motion', String(val))
    if (val) document.documentElement.classList.add('tryit-reduced-motion')
    else document.documentElement.classList.remove('tryit-reduced-motion')
  }

  const handleScreenReader = (val) => {
    setScreenReader(val)
    localStorage.setItem('tryit_screen_reader', String(val))
  }

  const settings = [
    {
      id: 'high-contrast',
      emoji: '🔳',
      title: 'High Contrast Theme',
      desc: 'Switches to a high-contrast black/white theme for better text visibility.',
      control: <Toggle checked={highContrast} onChange={handleHighContrast} id="hc" />,
    },
    {
      id: 'reduced-motion',
      emoji: '🎞️',
      title: 'Reduced Motion',
      desc: 'Disables page transitions, particle animations, and other motion effects.',
      control: <Toggle checked={reducedMotion} onChange={handleReducedMotion} id="rm" />,
    },
    {
      id: 'screen-reader',
      emoji: '🔊',
      title: 'Screen Reader Optimised Mode',
      desc: 'Adds aria-live regions and optimises focus order for screen readers (NVDA, TalkBack, VoiceOver).',
      control: <Toggle checked={screenReader} onChange={handleScreenReader} id="sr" />,
    },
  ]

  return (
    <AppLayout title="Accessibility">
      {screenReader && (
        <div aria-live="polite" className="sr-only">Accessibility settings page loaded.</div>
      )}
      <div className="max-w-xl mx-auto space-y-6 p-4">

        <div className="bg-gradient-to-r from-[var(--color-primary, #1E3A5F)] to-[var(--color-primary-dark, #0F2140)] rounded-2xl p-5 text-white">
          <p className="text-lg font-bold">♿ Accessibility Settings</p>
          <p className="text-sm opacity-70 mt-1">Customise TryIT to work best for your needs. Settings are saved automatically.</p>
        </div>

        {/* Text size */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-[var(--color-primary, #1E3A5F)] mb-1">🔤 Text Size</p>
          <p className="text-sm text-gray-500 mb-3">Adjusts the base font size across the app.</p>
          <div className="flex gap-2">
            {TEXT_SIZES.map(size => (
              <button
                key={size}
                onClick={() => handleTextSize(size)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition ${textSize === size ? 'border-[var(--color-accent, #D4AF37)] bg-[#FDF6E3] text-[var(--color-accent, #D4AF37)]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle settings */}
        {settings.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            <span className="text-2xl">{s.emoji}</span>
            <div className="flex-1">
              <label htmlFor={s.id} className="font-bold text-[var(--color-primary, #1E3A5F)] cursor-pointer">{s.title}</label>
              <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
            </div>
            {s.control}
          </div>
        ))}

        <p className="text-xs text-center text-gray-400 pb-4">
          Need additional support? Email <span className="text-[var(--color-accent, #D4AF37)]">accessibility@tryiteducations.net</span>
        </p>
      </div>
    </AppLayout>
  )
}