import { useState, useEffect, useRef } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { rewardFocusSession } from '../../lib/coinVault'

const DURATIONS = [15,25,45,60]
const SOUNDS    = [
  { id:'rain',    label:'🌧️ Rain',    desc:'Gentle rain on a tin roof'    },
  { id:'forest',  label:'🌿 Forest',  desc:'Birds & rustling leaves'      },
  { id:'cafe',    label:'☕ Café',    desc:'Soft café chatter'            },
  { id:'silence', label:'🤫 Silence', desc:'Pure focus — no sound'        },
  { id:'ocean',   label:'🌊 Ocean',  desc:'Slow ocean waves'             },
]
const SUBJECTS  = ['Quantitative Aptitude','Reasoning','English','General Knowledge','Current Affairs','Mock Test','Custom']

export default function FocusMode() {
  const { user }   = useAuth()
  const { earn, balance } = useCoins()
  const [duration, setDuration] = useState(25)
  const [sound,    setSound]    = useState('rain')
  const [subject,  setSubject]  = useState('Quantitative Aptitude')
  const [running,  setRunning]  = useState(false)
  const [remaining,setRemain]   = useState(25*60)
  const [sessions, setSessions] = useState(0)
  const [earned,   setEarned]   = useState(0)
  const intervalRef = useRef(null)
  const pct = ((duration*60-remaining)/(duration*60))*100
  const mins = Math.floor(remaining/60), secs = remaining%60

  const start = () => {
    setRemain(duration*60); setRunning(true)
  }
  const stop = () => { setRunning(false); clearInterval(intervalRef.current) }

  const finish = async () => {
    setRunning(false); clearInterval(intervalRef.current)
    setSessions(s=>s+1)
    const result = await rewardFocusSession({ minutes:duration, userId:user?.id })
    if (result?.coins) {
      earn({ source:'focus', amount:result.coins, description:`Focus ${duration}min — ${subject}` })
      setEarned(e => e + result.coins)
    }
  }

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(()=>{
      setRemain(r => {
        if (r<=1) { clearInterval(intervalRef.current); finish(); return 0 }
        return r-1
      })
    },1000)
    return ()=>clearInterval(intervalRef.current)
  },[running])

  const circumference = 2*Math.PI*88

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:4 }}>🎯 Focus Mode</h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>Study smart · Earn coins · Build discipline</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap:20 }}>
        {/* Timer */}
        <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:24, padding:28, display:'flex', flexDirection:'column', alignItems:'center', gap:18, border:'1.5px solid rgba(212,175,55,0.3)' }}>
          <div style={{ position:'relative', width:200, height:200 }}>
            <svg width="200" height="200" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
              <circle cx="100" cy="100" r="88" fill="none" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={circumference-(pct/100)*circumference}
                style={{ transition:'stroke-dashoffset 1s linear' }}/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:44, lineHeight:1 }}>
                {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
              </p>
              <p style={{ color:'#D4AF37', fontSize:12, marginTop:4 }}>{subject.slice(0,16)}</p>
            </div>
          </div>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
            {DURATIONS.map(d=>(
              <button key={d} onClick={()=>{ if(!running){ setDuration(d); setRemain(d*60) }}}
                disabled={running}
                style={{ padding:'7px 14px', borderRadius:20, border:'none', cursor:running?'not-allowed':'pointer', background:duration===d?'rgba(212,175,55,0.2)':'rgba(255,255,255,0.08)', color:duration===d?'#D4AF37':'rgba(255,255,255,0.5)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13 }}>
                {d}min
              </button>
            ))}
          </div>

          {!running
            ? <button onClick={start} style={{ width:'100%', padding:14, borderRadius:14, border:'none', background:'linear-gradient(135deg,#D4AF37,#E8C44A)', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, color:'#1E3A5F', cursor:'pointer' }}>▶ Start</button>
            : <div style={{ display:'flex', gap:10, width:'100%' }}>
                <button onClick={stop} style={{ flex:1, padding:12, borderRadius:12, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700 }}>⏸ Pause</button>
                <button onClick={finish} style={{ flex:1, padding:12, borderRadius:12, border:'1px solid rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.15)', color:'#4ADE80', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700 }}>✓ Done</button>
              </div>
          }

          <div style={{ display:'flex', gap:16 }}>
            {[['📅',sessions,'Sessions'],['🪙',earned,'Coins earned'],['💰',balance,'Balance']].map(([e,v,l])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <p style={{ fontSize:18 }}>{e}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:16 }}>{v}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Subject */}
          <div style={{ background:'#fff', borderRadius:20, padding:18, border:'1.5px solid #E2E8F0' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>📚 Studying</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {SUBJECTS.map(s=>(
                <button key={s} onClick={()=>setSubject(s)} style={{ padding:'7px 14px', borderRadius:20, border:'none', cursor:'pointer', background:subject===s?'#1E3A5F':'#F1F5F9', color:subject===s?'#fff':'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12 }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Sounds */}
          <div style={{ background:'#fff', borderRadius:20, padding:18, border:'1.5px solid #E2E8F0' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:10 }}>🎵 Ambient Sound</p>
            {SOUNDS.map(s=>(
              <button key={s.id} onClick={()=>setSound(s.id)}
                style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px', borderRadius:12, border:`1.5px solid ${sound===s.id?'#D4AF37':'#E2E8F0'}`, background:sound===s.id?'rgba(212,175,55,0.06)':'#F8FAFC', cursor:'pointer', marginBottom:6, textAlign:'left' }}>
                <span style={{ fontSize:18 }}>{s.label.split(' ')[0]}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E293B', fontSize:13 }}>{s.label}</p>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>{s.desc}</p>
                </div>
                {sound===s.id && <span style={{ color:'#D4AF37', fontWeight:800 }}>✓</span>}
              </button>
            ))}
          </div>

          <div style={{ background:'rgba(212,175,55,0.08)', borderRadius:18, padding:14, border:'1.5px solid rgba(212,175,55,0.2)' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14, marginBottom:6 }}>🪙 Discipline Reward</p>
            <p style={{ color:'#64748B', fontSize:12, lineHeight:1.6 }}>
              25min = +25 coins · 45min = +40 coins<br/>
              4 sessions today = +50 bonus coins<br/>
              Score below minimum in tests = coins deducted
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
