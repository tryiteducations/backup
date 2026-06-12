import { checkTestLimit } from '../../lib/security'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const TEST_TYPES = [
  { id:'practice', label:'📝 Practice',    desc:'Learn at your own pace',    badge:'FREE',      bc:'bg-green-100 text-green-700' },
  { id:'mock',     label:'⏱️ Mock Test',   desc:'Simulate real exam',        badge:'Most Used', bc:'bg-blue-100 text-blue-700'  },
  { id:'speed',    label:'🏃 Speed Drill', desc:'20 Q · 10 min challenge',   badge:'FREE',      bc:'bg-green-100 text-green-700' },
  { id:'custom',   label:'🎯 Custom',      desc:'You choose everything',      badge:'PRO',       bc:'bg-[#D4AF37]/20 text-[#1E3A5F]'},
]
const SUBJECTS = ['All Subjects','Maths','Reasoning','English','GK','Science']
const TIMES    = ['No Limit','30s / Q','45s / Q','60s / Q','90s / Q']
const RECENT   = [
  { exam:'SSC CGL', type:'Mock',        score:'142/200', duration:'26:34', rank:'#1,243',  date:'2 hours ago'  },
  { exam:'SSC CGL', type:'Practice',    score:'8/10',    duration:'9:12',  rank:'—',       date:'Yesterday'    },
  { exam:'IBPS PO', type:'Speed Drill', score:'15/20',   duration:'10:00', rank:'—',       date:'2 days ago'   },
]

export default function TestLauncher() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selType, setSelType] = useState('practice')
  const [subj,    setSubj]    = useState('All Subjects')
  const [qCount,  setQCount]  = useState(25)
  const [timing,  setTiming]  = useState('60s / Q')

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">

        {/* Active exam banner */}
        <div className="glass-gold rounded-2xl px-5 py-3 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#1E3A5F]/60 font-semibold uppercase tracking-wide">Currently preparing</p>
            <p className="text-[#1E3A5F] font-bold text-lg">{user?.exams[0]?.name}</p>
          </div>
          <button className="text-[#1E3A5F] text-sm font-semibold hover:underline">Switch exam →</button>
        </div>

        {/* Test type grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {TEST_TYPES.map(t => (
            <button key={t.id} onClick={() => setSelType(t.id)}
              className={`clay rounded-2xl p-5 text-left transition-all hover:-translate-y-1 ${selType === t.id ? 'ring-2 ring-[#D4AF37] -translate-y-1' : ''}`}>
              <p className="text-2xl mb-2">{t.label.split(' ')[0]}</p>
              <p className="font-bold text-[#1E3A5F] text-sm font-poppins">{t.label.slice(3)}</p>
              <p className="text-slate-500 text-xs mt-1">{t.desc}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mt-2 ${t.bc}`}>{t.badge}</span>
            </button>
          ))}
        </div>

        {/* Settings */}
        <div className="clay rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-[#1E3A5F] mb-4 font-poppins">Quick Settings</h3>
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-600 mb-2">Subject</p>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => setSubj(s)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${subj === s ? 'bg-[#1E3A5F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-600">Questions</p>
              <span className="text-2xl font-bold text-[#D4AF37] font-poppins w-10 text-center">{qCount}</span>
            </div>
            <input type="range" min={5} max={100} step={5} value={qCount}
              onChange={e => setQCount(+e.target.value)}
              className="w-full accent-[#D4AF37]" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>5</span><span>100</span></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-2">Time per Question</p>
            <div className="flex flex-wrap gap-2">
              {TIMES.map(t => (
                <button key={t} onClick={() => setTiming(t)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${timing === t ? 'bg-[#1E3A5F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/test-engine/active', { state: { type: selType, subject: subj, count: qCount, time: timing } })}
          className="btn-gold w-full py-5 rounded-2xl font-bold text-xl mb-6">
          Start Test Now →
        </button>

        {/* Recent tests */}
        <div className="clay rounded-3xl overflow-hidden">
          <div className="bg-[#1E3A5F] px-5 py-3">
            <p className="text-white font-bold font-poppins">Recent Tests</p>
          </div>
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 last:border-0">
              <div>
                <p className="font-semibold text-[#1E3A5F] text-sm">{r.exam} · {r.type}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#D4AF37] text-sm">{r.score}</p>
                <p className="text-xs text-slate-500">{r.duration} · {r.rank}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
