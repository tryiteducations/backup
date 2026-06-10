import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'

const TABS = ['Account','Notifications','Language','Theme','Privacy','About']
const NOTIFS = ['Daily Quiz reminder','Streak alerts','Scholarship deadlines','Hall activity','Guru Hub replies','Tournament invites','Badge unlocked','Weekly report']
const LANGS = ['Tamil','Hindi','Telugu','Kannada','Malayalam','Marathi','Bengali','Gujarati','Punjabi','Odia']

const THEME_PREVIEWS = {
  'classic-navy':  { sidebar:'#1E3A5F', accent:'#D4AF37', bg:'#F8FAFC', label:'Classic Navy'  },
  'midnight-dark': { sidebar:'#0F2140', accent:'#D4AF37', bg:'#0A0F1E', label:'Midnight Dark' },
  'forest-green':  { sidebar:'#065F46', accent:'#D4AF37', bg:'#F0FDF4', label:'Forest Green'  },
  'royal-purple':  { sidebar:'#4C1D95', accent:'#D4AF37', bg:'#FAF5FF', label:'Royal Purple'  },
}

export default function Settings() {
  const { user } = useAuth()
  const { activeTheme, setActiveTheme } = useTheme()
  const { showToast } = useToast()
  const [tab, setTab] = useState('Account')
  const [name, setName] = useState(user.name)
  const [notifs, setNotifs] = useState(() => Object.fromEntries(NOTIFS.map(t => [t, true])))
  const toggleNotif = (t) => setNotifs(p => ({ ...p, [t]: !p[t] }))

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-6">⚙️ Settings</h1>
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar tabs */}
        <div className="clay rounded-3xl p-3 lg:w-48 flex lg:flex-col gap-1 overflow-x-auto scrollbar-hide flex-shrink-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap text-left transition-all
                ${tab === t ? 'bg-[#1E3A5F] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="clay rounded-3xl p-6 flex-1">

          {tab === 'Account' && (
            <div className="space-y-5">
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins">Account Details</h2>
              <div>
                <label className="block text-sm font-semibold text-[#1E3A5F] mb-2">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="clay-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1E3A5F] mb-2">Email Address</label>
                <input value={user.email} readOnly className="clay-input opacity-60 cursor-not-allowed" />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
              </div>
              <button onClick={() => showToast('success','Profile saved!')} className="btn-gold px-8 py-3 rounded-2xl font-bold">
                Save Changes
              </button>
            </div>
          )}

          {tab === 'Theme' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">Choose Theme</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(THEME_PREVIEWS).map(([key, t]) => (
                  <button key={key}
                    onClick={() => { setActiveTheme(key); showToast('success', `${t.label} applied!`) }}
                    className={`rounded-2xl overflow-hidden border-4 transition-all
                      ${activeTheme === key ? 'border-[#D4AF37] scale-105' : 'border-transparent hover:border-slate-300'}`}>
                    <div className="flex" style={{ height: 64 }}>
                      <div style={{ width: 20, backgroundColor: t.sidebar }} className="flex-shrink-0" />
                      <div style={{ backgroundColor: t.bg }} className="flex-1 flex flex-col justify-between p-2">
                        <div className="h-2 rounded" style={{ backgroundColor: t.accent, width: '60%' }} />
                        <div className="space-y-1">
                          {[80, 60, 40].map((w, i) => (
                            <div key={i} className="h-1.5 rounded bg-slate-300" style={{ width: `${w}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-700">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'Notifications' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">Notifications</h2>
              <div className="space-y-3">
                {NOTIFS.map(t => (
                  <div key={t} className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-700 text-sm font-medium">{t}</span>
                    <button onClick={() => toggleNotif(t)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifs[t] ? 'bg-[#D4AF37]' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notifs[t] ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Language' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">Study Languages</h2>
              <div className="clay rounded-2xl p-3 mb-4 flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold text-[#1E3A5F]">English — Always Included</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">Add up to 3 regional languages.</p>
              <div className="flex flex-wrap gap-2">
                {LANGS.map(l => (
                  <button key={l} onClick={() => showToast('success', `${l} added!`)}
                    className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-[#D4AF37] transition-colors">
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'Privacy' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">Privacy & Security</h2>
              <div className="glass-gold rounded-2xl p-4 mb-5">
                <p className="text-sm font-semibold text-[#1E3A5F] mb-1">🔒 Parent Connect Code</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-bold font-mono text-[#1E3A5F] tracking-widest">472918</span>
                  <button onClick={() => showToast('success','Code copied!')}
                    className="text-sm text-[#1E3A5F] font-semibold hover:underline">Copy</button>
                </div>
                <p className="text-xs text-[#1E3A5F]/70 mt-2">Share with your parent to connect their view.</p>
              </div>
              <button onClick={() => showToast('error','Account deletion requested. Takes 30 days.')}
                className="border-2 border-red-300 text-red-500 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          )}

          {tab === 'About' && (
            <div>
              <h2 className="font-bold text-[#1E3A5F] text-xl font-poppins mb-4">About TryIT Educations</h2>
              <p className="text-slate-500 text-sm mb-2">Version 1.0.0 · June 2026</p>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                India's most complete exam preparation platform. 75,000+ exam pathways,
                40+ languages, real All-India rankings after every test.
              </p>
              <div className="space-y-2">
                {['Privacy Policy','Terms of Service','Community Standards','Contact Support'].map(l => (
                  <a key={l} href="#" className="block text-[#D4AF37] text-sm font-semibold hover:underline">{l} →</a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  )
}
