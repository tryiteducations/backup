// FILE: src/pages/Onboarding.jsx
// TryIT - Unified Multi-Role Onboarding Pipeline
// Route: /onboarding (Triggers dynamically post role-select to configure profile details)

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, onboardingKey } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

// --- Primitives & Master Catalogs ---

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli and Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
]

const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिन्दी' },
  { code: 'ta', native: 'தமிழ்' },
  { code: 'te', native: 'తెలుగు' },
  { code: 'kn', native: 'ಕನ್ನಡ' },
  { code: 'ml', native: 'മലയാളം' },
  { code: 'bn', native: 'বাংলা' },
  { code: 'mr', native: 'मराठी' },
  { code: 'gu', native: 'ગુજરાતી' }
]

const SUBJECTS = [
  { name: 'Quantitative Aptitude', emoji: '🔢' },
  { name: 'Logical Reasoning',     emoji: '🧩' },
  { name: 'English Language',      emoji: '📝' },
  { name: 'General Knowledge',     emoji: '🌍' },
  { name: 'Current Affairs',       emoji: '📰' },
  { name: 'Mathematics',           emoji: '📐' },
  { name: 'Science',               emoji: '🔬' },
  { name: 'Computer Awareness',    emoji: '💻' },
]

const MENTOR_SUBJECTS = [
  'Quantitative Aptitude','Logical Reasoning','English Language',
  'General Knowledge','Mathematics','Science','Computer Awareness',
  'Banking Awareness','Economy','History','Geography','Polity',
]

const QUALIFICATIONS = [
  'Graduate','Post Graduate','PhD','CA/CMA/CS','Teaching Professional','Other',
]

const INSTITUTION_TYPES = ['Coaching Centre','School','College','Online Platform','Other']
const RELATIONS = ['Parent','Guardian','Grandparent','Sibling','Other']

const FALLBACK_EXAMS = [
  { id: 'ssc_cgl',    name: 'SSC CGL',         category: 'SSC',         level: 'Graduate' },
  { id: 'ssc_chsl',   name: 'SSC CHSL',        category: 'SSC',         level: '12th Pass' },
  { id: 'ibps_po',    name: 'IBPS PO',         category: 'Banking',     level: 'Graduate' },
  { id: 'ibps_clerk', name: 'IBPS Clerk',      category: 'Banking',     level: 'Graduate' },
  { id: 'sbi_po',     name: 'SBI PO',          category: 'Banking',     level: 'Graduate' },
  { id: 'upsc_cse',   name: 'UPSC CSE',        category: 'UPSC',        level: 'Graduate' },
  { id: 'rrb_ntpc',   name: 'RRB NTPC',        category: 'Railway',     level: 'Graduate' },
  { id: 'neet_ug',    name: 'NEET',            category: 'Medical',     level: '12th Pass' },
  { id: 'jee_main',   name: 'JEE Main',        category: 'Engineering', level: '12th Pass' },
  { id: 'cat',        name: 'CAT',             category: 'MBA',         level: 'Graduate' },
  { id: 'clat',       name: 'CLAT',            category: 'Law',         level: '12th Pass' },
  { id: 'gate',       name: 'GATE',            category: 'Graduate',    level: 'Graduate' },
]

// --- Core Shared UI Helper Nodes ---

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Other'
    ;(acc[k] = acc[k] || []).push(item)
    return acc
  }, {})
}

function ProgressBar({ current, total }) {
  const widthPercentage = (current / total) * 100
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs mb-1.5" style={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
        <span>Step {current} of {total}</span>
        <span>{Math.round(widthPercentage)}%</span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: 'var(--color-border, #E2E8F0)' }}>
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${widthPercentage}%`, background: 'linear-gradient(90deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))' }}
        />
      </div>
    </div>
  )
}

function StepTitle({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary, #1E3A5F)', fontFamily: 'Poppins, sans-serif' }}>{title}</h2>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--color-muted, #64748B)', fontFamily: 'Inter, sans-serif' }}>{subtitle}</p>}
    </div>
  )
}

function ToggleChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
      style={{
        borderColor: selected ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)',
        background: selected ? '#FFFBF0' : '#fff',
        color: selected ? 'var(--color-primary, #1E3A5F)' : 'var(--color-muted, #64748B)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {label}
    </button>
  )
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-primary, #1E3A5F)', fontFamily: 'Inter, sans-serif' }}>
      {children}
    </label>
  )
}

const inputStyle = {
  borderColor: 'var(--color-border, #E2E8F0)',
  background: '#fff',
  color: 'var(--color-primary, #1E3A5F)',
  fontFamily: 'Inter, sans-serif',
}

function TextInput({ label, value, onChange, placeholder, type = 'text', optional }) {
  return (
    <div>
      <FieldLabel>{label}{optional && <span className="ml-1 normal-case font-normal text-xs" style={{ color: '#94A3B8' }}>(optional)</span>}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all"
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'var(--color-accent, #D4AF37)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-border, #E2E8F0)'}
      />
    </div>
  )
}

function SelectInput({ label, value, onChange, options, placeholder, optional }) {
  return (
    <div>
      <FieldLabel>{label}{optional && <span className="ml-1 normal-case font-normal text-xs" style={{ color: '#94A3B8' }}>(optional)</span>}</FieldLabel>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all appearance-none"
        style={{ ...inputStyle, borderColor: value ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)' }}
        onFocus={e => e.target.style.borderColor = 'var(--color-accent, #D4AF37)'}
        onBlur={e => e.target.style.borderColor = value ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)'}
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// --- STUDENT SUB-COMPONENTS ---

function StudentStep1({ data, setData }) {
  return (
    <div className="space-y-4">
      <StepTitle title="Tell us about yourself" subtitle="Helps us personalise your experience. All optional." />
      <TextInput label="Full Name" value={data.name || ''} onChange={v => setData(d => ({...d, name: v}))} placeholder="Your name" optional />
      <TextInput label="Age" type="number" value={data.age || ''} onChange={v => setData(d => ({...d, age: v}))} placeholder="e.g. 22" optional />
      <SelectInput label="Gender" value={data.gender || ''} onChange={v => setData(d => ({...d, gender: v}))} options={['Male','Female','Non-binary','Prefer not to say']} optional />
    </div>
  )
}

function StudentStep2({ data, setData }) {
  return (
    <div className="space-y-4">
      <StepTitle title="Where are you based?" subtitle="We'll show you state-specific exam notification data structures." />
      <SelectInput label="State / UT" value={data.state || ''} onChange={v => setData(d => ({...d, state: v}))} options={INDIA_STATES} placeholder="Select state..." />
      <TextInput label="City" value={data.city || ''} onChange={v => setData(d => ({...d, city: v}))} placeholder="Your city" optional />
    </div>
  )
}

function StudentStep3({ data, setData, exams }) {
  const [search, setSearch] = useState('')
  const selected = data.exams || []

  const filtered = useMemo(() => {
    if (!search.trim()) return exams
    const q = search.toLowerCase()
    return exams.filter(e => e.name.toLowerCase().includes(q) || (e.category || '').toLowerCase().includes(q))
  }, [search, exams])

  const grouped = groupBy(filtered, 'category')

  function toggle(exam) {
    const already = selected.find(e => e.id === exam.id)
    if (already) {
      setData(d => ({...d, exams: selected.filter(e => e.id !== exam.id)}))
    } else if (selected.length < 3) {
      setData(d => ({...d, exams: [...selected, exam]}))
    }
  }

  return (
    <div>
      <StepTitle title="Which exams are you targeting?" subtitle="Pick up to 3 exams. You can change these later." />

      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search target exams..."
          className="w-full rounded-xl border-2 pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--color-accent, #D4AF37)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border, #E2E8F0)'}
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map(e => (
            <span key={e.id} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#FFFBF0', border: '1.5px solid var(--color-accent, #D4AF37)', color: 'var(--color-primary, #1E3A5F)' }}>
              {e.name}
              <button onClick={() => toggle(e)} className="ml-1 hover:opacity-60">✕</button>
            </span>
          ))}
          {selected.length < 3 && (
            <span className="text-xs flex items-center" style={{ color: '#94A3B8' }}>{3 - selected.length} more allowed</span>
          )}
        </div>
      )}

      <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>{cat}</p>
            <div className="flex flex-wrap gap-2">
              {items.map(exam => {
                const isSel = !!selected.find(e => e.id === exam.id)
                const disabled = !isSel && selected.length >= 3
                return (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => !disabled && toggle(exam)}
                    className="px-3 py-1.5 rounded-xl text-sm border-2 transition-all"
                    style={{
                      borderColor: isSel ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)',
                      background: isSel ? '#FFFBF0' : disabled ? '#F8FAFC' : '#fff',
                      color: isSel ? 'var(--color-primary, #1E3A5F)' : disabled ? '#CBD5E1' : '#475569',
                      fontFamily: 'Inter, sans-serif',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {exam.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StudentStep4({ data, setData }) {
  const selectedLang = data.preferred_language || 'en'
  return (
    <div>
      <StepTitle title="Choose your language" subtitle="Questions, explanations, and the app engine will deploy this setting." />
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            type="button"
            onClick={() => setData(d => ({...d, preferred_language: l.code}))}
            className="p-3.5 rounded-xl text-center border-2 transition-all cursor-pointer"
            style={{
              borderColor: selectedLang === l.code ? 'var(--color-accent, #D4AF37)' : 'var(--color-border, #E2E8F0)',
              background: selectedLang === l.code ? '#FFFBF0' : '#fff',
            }}
          >
            <p className="text-sm font-bold" style={{ color: 'var(--color-primary, #1E3A5F)', margin: 0 }}>{l.native}</p>
          </button>
        ))}
      </div>
      <p className="text-xs mt-3 px-3 py-2 rounded-lg" style={{ background: '#FEF3C7', color: '#92400E', fontFamily: 'Inter, sans-serif' }}>
        ✨ Dynamic translations serving 40 regional variants rolling out weekly.
      </p>
    </div>
  )
}

function StudentStep5({ data, setData }) {
  const strong = data.strongSubjects || []
  const weak   = data.weakSubjects   || []
  function toggleStrong(s) {
    if (strong.includes(s)) setData(d => ({...d, strongSubjects: strong.filter(x => x !== s)}))
    else setData(d => ({...d, strongSubjects: [...strong, s], weakSubjects: weak.filter(x => x !== s)}))
  }
  function toggleWeak(s) {
    if (weak.includes(s)) setData(d => ({...d, weakSubjects: weak.filter(x => x !== s)}))
    else setData(d => ({...d, weakSubjects: [...weak, s], strongSubjects: strong.filter(x => x !== s)}))
  }
  return (
    <div>
      <StepTitle title="Your strengths & weak areas" subtitle="Optional - helps us parameterize your adaptive study map." />
      <div className="mb-5">
        <p className="text-sm font-semibold mb-2" style={{ color: '#16A34A', fontFamily: 'Inter, sans-serif' }}>💪 Strong in</p>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map(s => (
            <ToggleChip key={s.name} label={`${s.emoji} ${s.name}`} selected={strong.includes(s.name)} onClick={() => toggleStrong(s.name)} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: '#DC2626', fontFamily: 'Inter, sans-serif' }}>📌 Need to improve</p>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map(s => (
            <ToggleChip key={s.name} label={`${s.emoji} ${s.name}`} selected={weak.includes(s.name)} onClick={() => toggleWeak(s.name)} />
          ))}
        </div>
      </div>
    </div>
  )
}

// --- MENTOR SUB-COMPONENTS ---

function MentorStep1({ data, setData }) {
  return (
    <div className="space-y-4">
      <StepTitle title="Your credentials" subtitle="Establish your verification domain profiles." />
      <TextInput label="Full Name" value={data.name || ''} onChange={v => setData(d => ({...d, name: v}))} placeholder="Your name" />
      <SelectInput label="Highest Qualification" value={data.qualification || ''} onChange={v => setData(d => ({...d, qualification: v}))} options={QUALIFICATIONS} />
      <div>
        <FieldLabel>Years of experience</FieldLabel>
        <input
          type="number"
          min="0"
          max="50"
          value={data.experience || ''}
          onChange={e => setData(d => ({...d, experience: e.target.value}))}
          placeholder="e.g. 5"
          className="w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all"
          style={inputStyle}
        />
      </div>
    </div>
  )
}

function MentorStep2({ data, setData }) {
  const selected = data.mentorSubjects || []
  function toggle(s) {
    if (selected.includes(s)) setData(d => ({...d, mentorSubjects: selected.filter(x => x !== s)}))
    else setData(d => ({...d, mentorSubjects: [...selected, s]}))
  }
  return (
    <div>
      <StepTitle title="Subjects you can mentor" subtitle="Select all fields that match your domain expertise." />
      <div className="flex flex-wrap gap-2">
        {MENTOR_SUBJECTS.map(s => (
          <ToggleChip key={s} label={s} selected={selected.includes(s)} onClick={() => toggle(s)} />
        ))}
      </div>
    </div>
  )
}

function MentorStep3({ data, setData }) {
  const selected = data.mentorLanguages || []
  function toggle(l) {
    if (selected.includes(l.code)) setData(d => ({...d, mentorLanguages: selected.filter(x => x !== l.code)}))
    else setData(d => ({...d, mentorLanguages: [...selected, l.code]}))
  }
  return (
    <div>
      <StepTitle title="Languages you can resolve doubts in" subtitle="Affects ticket queue allocation workflows." />
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map(l => (
          <ToggleChip key={l.code} label={l.native} selected={selected.includes(l.code)} onClick={() => toggle(l)} />
        ))}
      </div>
    </div>
  )
}

// --- INSTITUTION SUB-COMPONENTS ---

function InstitutionStep1({ data, setData }) {
  return (
    <div className="space-y-4">
      <StepTitle title="About your institution" />
      <TextInput label="Institution Name" value={data.institutionName || ''} onChange={v => setData(d => ({...d, institutionName: v}))} placeholder="e.g. Bright Future Coaching" />
      <SelectInput label="Type" value={data.institutionType || ''} onChange={v => setData(d => ({...d, institutionType: v}))} options={INSTITUTION_TYPES} />
      <TextInput label="City" value={data.city || ''} onChange={v => setData(d => ({...d, city: v}))} placeholder="City where you operate" optional />
    </div>
  )
}

function InstitutionStep2({ data, setData }) {
  return (
    <div className="space-y-4">
      <StepTitle title="Your student base" subtitle="Helps optimize dynamic package pricing tiers." />
      <SelectInput
        label="Number of active students enrolled"
        value={data.studentCount || ''}
        onChange={v => setData(d => ({...d, studentCount: v}))}
        options={['1-50','51-200','201-500','501-1000','1000+']}
      />
    </div>
  )
}

function InstitutionStep3({ data, setData }) {
  const selected = data.institutionExams || []
  const all = FALLBACK_EXAMS
  function toggle(name) {
    if (selected.includes(name)) setData(d => ({...d, institutionExams: selected.filter(x => x !== name)}))
    else setData(d => ({...d, institutionExams: [...selected, name]}))
  }
  return (
    <div>
      <StepTitle title="Exams you curate curricula for" />
      <div className="flex flex-wrap gap-2">
        {all.map(e => (
          <ToggleChip key={e.id} label={e.name} selected={selected.includes(e.name)} onClick={() => toggle(e.name)} />
        ))}
      </div>
    </div>
  )
}

// --- FAMILY SUB-COMPONENTS ---

function FamilyStep1({ data, setData }) {
  return (
    <div className="space-y-4">
      <StepTitle title="About you" />
      <TextInput label="Your Parent Profile Name" value={data.name || ''} onChange={v => setData(d => ({...d, name: v}))} placeholder="Your name" />
      <SelectInput label="Relation context to student" value={data.relation || ''} onChange={v => setData(d => ({...d, relation: v}))} options={RELATIONS} />
    </div>
  )
}

function FamilyStep2({ data, setData }) {
  return (
    <div className="space-y-4">
      <StepTitle title="Connect to student node dashboard" subtitle="Enter your child's tracking token alias email descriptor link." />
      <TextInput
        label="Child's registered TryIT email"
        type="email"
        value={data.childEmail || ''}
        onChange={v => setData(d => ({...d, childEmail: v}))}
        placeholder="child@phone.tryiteducations.net"
        optional
      />
      <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#EFF6FF', color: '#1D4ED8', fontFamily: 'Inter, sans-serif' }}>
        You can securely sync or alter bindings post-onboarding inside Settings configuration controls.
      </p>
    </div>
  )
}

// --- MAIN MASTER CLASS WORKFLOW ---

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  // Admin role must not override the selected role from RoleSelect
  const rawRole = user?.role === 'admin' ? null : user?.role
  const role = rawRole || localStorage.getItem('tryit_role') || 'student'

  const [step, setStep] = useState(0)
  const [data, setData] = useState({ preferred_language: 'en', exams: [], strongSubjects: [], weakSubjects: [] })
  const [exams, setExams] = useState(FALLBACK_EXAMS)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    fetch('/data/exams.json')
      .then(r => r.ok ? r.json() : null)
      .then(json => { if (json?.exams?.length) setExams(json.exams) })
      .catch(() => {})
  }, [])

  // Establish sequential layout dynamic routing index
  const steps = useMemo(() => {
    if (role === 'student') return [
      { label: 'About you',     Component: StudentStep1 },
      { label: 'Location',      Component: StudentStep2 },
      { label: 'Target exams',  Component: StudentStep3 },
      { label: 'Language',      Component: StudentStep4 },
      { label: 'Subjects',      Component: StudentStep5 },
    ]
    if (role === 'mentor') return [
      { label: 'Credentials',   Component: MentorStep1 },
      { label: 'Subjects',      Component: MentorStep2 },
      { label: 'Languages',     Component: MentorStep3 },
    ]
    if (role === 'institution') return [
      { label: 'Institution',   Component: InstitutionStep1 },
      { label: 'Student base',  Component: InstitutionStep2 },
      { label: 'Exams',         Component: InstitutionStep3 },
    ]
    if (role === 'family') return [
      { label: 'About you',     Component: FamilyStep1 },
      { label: 'Connect',       Component: FamilyStep2 },
    ]
    return []
  }, [role])

  const total = steps.length

  // Safety: unknown role gets redirected
  useEffect(() => {
    if (total === 0 && role) {
      const home = role === 'institution' ? '/institution'
        : role === 'mentor' ? '/mentor-hub'
        : role === 'family' ? '/student'
        : '/student'
      navigate(home, { replace: true })
    }
  }, [total, role])

  const current = step + 1
  const isLast = step === total - 1
  const { Component } = steps[step] || {}

  async function handleFinish() {
    setFinishing(true)
    const patch = { onboarding_complete: true }

    if (role === 'student') {
      patch.name = data.name || ''
      patch.state = data.state || ''
      patch.city = data.city || ''
      patch.preferred_language = data.preferred_language || 'en'
      
      if (data.exams?.length) {
        patch.exams = data.exams.map(e => ({ id: e.id, name: e.name, readiness: 0, examDate: null }))
      }

      const subjectMap = {}
      ;(data.strongSubjects || []).forEach(name => {
        const meta = SUBJECTS.find(s => s.name === name)
        subjectMap[name] = { name, accuracy: 0, trend: 'up', emoji: meta?.emoji || '📚' }
      })
      ;(data.weakSubjects || []).forEach(name => {
        const meta = SUBJECTS.find(s => s.name === name)
        subjectMap[name] = { name, accuracy: 0, trend: 'steady', emoji: meta?.emoji || '📚' }
      })
      const subjectList = Object.values(subjectMap)
      if (subjectList.length) patch.subjects = subjectList
    }

    if (role === 'mentor') {
      patch.name = data.name || ''
      patch.qualification = data.qualification || ''
      patch.experience = data.experience || 0
      patch.mentorSubjects = data.mentorSubjects || []
      patch.mentorLanguages = data.mentorLanguages || []
    }

    if (role === 'institution') {
      patch.institutionName = data.institutionName || ''
      patch.institutionType = data.institutionType || ''
      patch.city = data.city || ''
      patch.studentCount = data.studentCount || ''
      patch.institutionExams = data.institutionExams || []
    }

    if (role === 'family') {
      patch.name = data.name || ''
      patch.relation = data.relation || ''
      patch.childEmail = data.childEmail || ''
    }

    try {
      // Step 1: Commit metadata modifications locally into active application memory
      await updateUser?.(patch)

    // Step 2: Push database state sync transactions downstream directly into Supabase server storage pools
      if (user?.id) {
        await supabase
          .from('profiles')
          .update({
            name: patch.name || user.name,
            state: patch.state,
            preferred_language: patch.preferred_language || 'en',
            metadata: patch
          })
          .eq('id', user.id)
      }
      // Step 3: Flag storage local references to avoid onboarding recycle loops
      const email = user?.email || localStorage.getItem('tryit_email') || `${user?.id}@tryiteducations.net`
      localStorage.setItem(onboardingKey(email), '1')

      // Step 4: Perform explicit multi-role target workspace navigation routing matches
      const ROLE_HOME = {
        student: '/dashboard',
        mentor: '/mentor-hub',
        institution: '/centre/dashboard',
        family: '/family',
      }
      navigate(ROLE_HOME[role] || '/dashboard')
    } catch (err) {
      console.error('Onboarding synchronization failure:', err)
    } finally {
      setFinishing(false)
    }
  }

  function handleNext() {
    if (isLast) handleFinish()
    else setStep(s => s + 1)
  }

  function handleBack() {
    if (step === 0) navigate('/login')
    else setStep(s => s - 1)
  }

  if (!Component) return null

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-primary-dark, #0F2140) 0%, var(--color-primary, #1E3A5F) 55%, #162d4a 100%)' }}
    >
      {/* Decorative ambient background visual graphics panels */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full opacity-10" style={{ width: 700, height: 700, top: '50%', left: '50%', transform: 'translate(-50%, -60%)', border: '1.5px solid var(--color-accent, #D4AF37)' }} />
        <div className="absolute rounded-full opacity-5"  style={{ width: 420, height: 420, top: '50%', left: '50%', transform: 'translate(-50%, -55%)', border: '1.5px solid var(--color-accent, #D4AF37)' }} />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="rounded-2xl p-8 shadow-2xl transition-all duration-300" style={{ background: 'var(--color-background, #F8FAFC)' }}>
          
          {/* Top Brand Block Header */}
          <div className="flex flex-col items-center mb-6">
            <Logo dark={false} height={40} />
            <p className="mt-2 text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--color-accent, #D4AF37)', fontFamily: 'Poppins, sans-serif' }}>
              Setting up your workspace profile
            </p>
          </div>

          {/* Active Pipeline Progress Node Indicators */}
          <ProgressBar current={current} total={total} />

          {/* Configuration Steps Category Tab Nodes Tracker */}
          <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex-1 min-w-[65px] text-center text-xs px-2 py-1 rounded-lg truncate transition-colors duration-150"
                style={{
                  background: i < step ? '#FFFBF0' : i === step ? 'var(--color-primary, #1E3A5F)' : 'var(--color-bg-muted-2, #F1F5F9)',
                  color: i < step ? 'var(--color-accent, #D4AF37)' : i === step ? '#fff' : '#94A3B8',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: i === step ? 600 : 400,
                  fontSize: '0.7rem',
                }}
              >
                {i < step ? '✓' : s.label}
              </div>
            ))}
          </div>

          {/* Core Content Pipeline Component Display Port */}
          <div className="min-h-[280px]">
            <Component data={data} setData={setData} exams={exams} />
          </div>

          {/* Navigation Control Toolbar Module */}
          <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border, #E2E8F0)' }}>
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70 cursor-pointer"
              style={{ color: 'var(--color-muted, #64748B)', fontFamily: 'Inter, sans-serif' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
              Back
            </button>

            <div className="flex items-center gap-3">
              {!isLast && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-sm font-medium transition-opacity hover:opacity-70 cursor-pointer"
                  style={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}
                >
                  Skip
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={finishing}
                className="rounded-xl px-6 py-2.5 font-semibold text-sm transition-all hover:shadow-md disabled:opacity-60 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
                  color: 'var(--color-primary-dark, #0F2140)',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                {finishing ? 'Saving Profiles...' : isLast ? 'Finish & Launch 🚀' : 'Next →'}
              </button>
            </div>
          </div>
        </div>

        {/* Footnote Copyright Node */}
        <p className="text-center mt-4 text-xs opacity-40" style={{ color: '#fff', fontFamily: 'Inter, sans-serif' }}>
          TryIT Educations © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}