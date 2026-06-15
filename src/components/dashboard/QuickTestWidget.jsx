import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TYPES = ['Practice','Mock','Speed']
const SUBJECTS = ['All','Maths','Reasoning','English','GK','Science']

export default function QuickTestWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = useState('Practice')
  const [subj, setSubj] = useState('All')

  return (
    <div className="clay-dark rounded-3xl p-6">
      <h3 className="font-bold text-white text-lg font-poppins mb-1">⚡ Quick Test</h3>
      <p className="text-white/60 text-sm mb-4">{user?.exams[0]?.name}</p>
      <div className="flex gap-2 mb-3 flex-wrap">
        {TYPES.map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
              ${type === t ? 'bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
        {SUBJECTS.map(s => (
          <button key={s} onClick={() => setSubj(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all
              ${subj === s ? 'bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)]' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={() => navigate('/test-engine')} className="btn-gold w-full py-3.5 rounded-2xl font-bold text-base">
        Start Test Now →
      </button>
      <p className="text-white/40 text-xs text-center mt-3">Last: Reasoning · 8/10 · 78%</p>
    </div>
  )
}
