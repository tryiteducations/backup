import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

const LANGUAGE_GROUPS = [
  {
    region: 'Neutral',
    langs: [
      { value: 'en',        label: 'English', tone: 'English (neutral)' },
    ],
  },
  {
    region: 'North India',
    langs: [
      { value: 'hi-bhai',   label: 'Hindi',   tone: 'Hindi (bhai / dost)' },
      { value: 'pa-paaji',  label: 'Punjabi', tone: 'Punjabi (paaji / veer)' },
      { value: 'ur-yaar',   label: 'Urdu',    tone: 'Urdu (yaar / janaab)' },
      { value: 'gu-bhai',   label: 'Gujarati',tone: 'Gujarati (bhai / ben)' },
      { value: 'mr-bhau',   label: 'Marathi', tone: 'Marathi (bhau / tai)' },
      { value: 'raj-bhai',  label: 'Rajasthani', tone: 'Rajasthani (bhai)' },
    ],
  },
  {
    region: 'South India',
    langs: [
      { value: 'ta-machan', label: 'Tamil',    tone: 'Tamil (machan / akka)' },
      { value: 'te-anna',   label: 'Telugu',   tone: 'Telugu (annayya / tammudu)' },
      { value: 'kn-anna',   label: 'Kannada',  tone: 'Kannada (anna / thamma)' },
      { value: 'ml-ikka',   label: 'Malayalam',tone: 'Malayalam (ikka / chetta)' },
    ],
  },
  {
    region: 'East & Northeast',
    langs: [
      { value: 'bn-dada',   label: 'Bengali',  tone: 'Bengali (dada / bhai)' },
      { value: 'or-bhaina', label: 'Odia',     tone: 'Odia (bhaina / bhai)' },
      { value: 'as-koka',   label: 'Assamese', tone: 'Assamese (koka / bhati)' },
      { value: 'mni-bhai',  label: 'Manipuri', tone: 'Manipuri (bhai)' },
      { value: 'mizo-bro',  label: 'Mizo',     tone: 'Mizo (bro / pu)' },
    ],
  },
  {
    region: 'Central & Tribal',
    langs: [
      { value: 'cg-bhai',   label: 'Chhattisgarhi', tone: 'Chhattisgarhi (bhai)' },
      { value: 'maitei',    label: 'Meitei',         tone: 'Meitei (bhai)' },
    ],
  },
]

export default function LanguageSelector({ compact = false }) {
  const { langTone, setLangTone } = useContext(LanguageContext)

  // Find current display label
  const current = LANGUAGE_GROUPS.flatMap(g => g.langs).find(l => l.value === langTone)
  const label = current ? current.tone : 'English (neutral)'

  if (compact) {
    return (
      <select
        value={langTone}
        onChange={e => setLangTone(e.target.value)}
        style={{
          border: '1.5px solid rgba(212,175,55,0.5)',
          borderRadius: 10, padding: '6px 10px',
          background: 'rgba(255,255,255,0.9)',
          fontFamily: 'Poppins,sans-serif', fontWeight: 600,
          fontSize: 12, color: '#1E3A5F', cursor: 'pointer', outline: 'none',
        }}
      >
        {LANGUAGE_GROUPS.map(group => (
          <optgroup key={group.region} label={group.region}>
            {group.langs.map(l => (
              <option key={l.value} value={l.value}>{l.tone}</option>
            ))}
          </optgroup>
        ))}
      </select>
    )
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.9)',
        border: '1.5px solid rgba(212,175,55,0.4)',
        borderRadius: 12, padding: '8px 14px',
      }}>
        <span style={{ fontSize: 16 }}>🌐</span>
        <select
          value={langTone}
          onChange={e => setLangTone(e.target.value)}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'Poppins,sans-serif', fontWeight: 600,
            fontSize: 13, color: '#1E3A5F', cursor: 'pointer', minWidth: 140,
          }}
        >
          {LANGUAGE_GROUPS.map(group => (
            <optgroup key={group.region} label={`── ${group.region} ──`}>
              {group.langs.map(l => (
                <option key={l.value} value={l.value}>{l.tone}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  )
}
