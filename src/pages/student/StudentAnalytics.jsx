// src/pages/student/StudentAnalytics.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import ShareButton from '../../components/ShareButton'

function Ring({ pct=0, size=60, stroke=5, color='#C9A84C', children }) {
  const r = (size-stroke*2)/2
  const c = 2*Math.PI*r
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(pct/100)*c} ${c-(pct/100)*c}`} strokeLinecap="round"/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {children}
      </div>
    </div>
  )
}

export default function StudentAnalytics() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user: authUser } = useAuth()
  const isDark = theme?.isDark ?? false
  const accent = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primary = theme?.primary ?? '#1E3A5F'
  const primD = theme?.primaryDark ?? '#0F2140'
  const txt = theme?.text ?? (isDark ? '#F8FAFC' : '#0F1020')
  const muted = theme?.textLight ?? (isDark ? 'rgba(255,255,255,0.55)' : '#64748B')
  const card = theme?.surface ?? (isDark ? 'rgba(255,255,255,0.06)' : '#fff')
  const bdr = theme?.border ?? (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0')
  const bg = theme?.background ?? (isDark ? '#0D1117' : '#F0F4F8')

  const [attempts, setAttempts] = useState([])
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('week')

  useEffect(() => {
    if (!authUser) return
    const uid = authUser.id || authUser.userId
    Promise.all([
      supabase.from('test_attempts').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('user_streaks').select('*').eq('user_id', uid).single(),
    ]).then(([{ data: att }, { data: str }]) => {
      setAttempts(att || [])
      setStreak(str)
      setLoading(false)
    })
  }, [authUser])

  const avg = attempts.length
    ? Math.round(attempts.reduce((s,a) => s + (a.total ? a.score/a.total*100 : 0), 0) / attempts.length)
    : 0
  const best = attempts.length
    ? Math.max(...attempts.map(a => a.total ? Math.round(a.score/a.total*100) : 0))
    : 0
  const recent = attempts.slice(0, 7).reverse()

  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Inter,sans-serif' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
        background:isDark?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.9)',
        backdropFilter:'blur(20px)', borderBottom:`1px solid ${bdr}`,
        position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => navigate('/student')} style={{
          background:card, border:`1px solid ${bdr}`, borderRadius:10,
          width:38, height:38, cursor:'pointer', color:txt, fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        <div style={{ flex: 1 }}>
          <p style={{ color:txt, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, margin:0 }}>
            📊 Analytics
          </p>
          <p style={{ color:muted, fontSize:11, margin:0 }}>Your performance breakdown</p>
        </div>
        <ShareButton
          headline="My Analytics Progress"
          stat={attempts.length > 0 ? `${Math.round(attempts.reduce((s,a)=>s+(a.score/a.total*100||0),0)/attempts.length)}%` : `${streak?.current_streak||0}🔥`}
          subLabel={attempts.length > 0 ? 'Average Score' : 'Day Streak'}
          context="Analytics"
          emoji="📊"
        />
      </div>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'20px' }}>
        {/* Summary rings */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'Avg Score', val:avg, color:'#60A5FA', suffix:'%' },
            { label:'Best Score', val:best, color:'#4ADE80', suffix:'%' },
            { label:'Tests Done', val:attempts.length, color:accent, suffix:'' },
          ].map((s,i) => (
            <div key={i} style={{ background:card, border:`1px solid ${bdr}`,
              borderRadius:16, padding:'14px', textAlign:'center' }}>
              <Ring pct={Math.min(100,s.val)} size={56} stroke={4} color={s.color}>
                <span style={{ color:s.color, fontWeight:900, fontSize:11 }}>
                  {s.val}{s.suffix}
                </span>
              </Ring>
              <p style={{ color:txt, fontWeight:700, fontSize:11, margin:'8px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Streak card */}
        {streak && (
          <div style={{ background:`linear-gradient(135deg,${primary},${primD})`,
            borderRadius:16, padding:'16px', marginBottom:20,
            border:`1px solid ${accent}22` }}>
            <p style={{ color:accent, fontSize:10, fontWeight:700, letterSpacing:'1px', margin:'0 0 10px' }}>
              STREAK STATS
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { label:'Current', val:`${streak.current_streak}d`, icon:'🔥' },
                { label:'Best Ever', val:`${streak.longest_streak}d`, icon:'⭐' },
                { label:'Total Days', val:streak.total_study_days, icon:'📅' },
              ].map((s,i) => (
                <div key={i} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:24, margin:'0 0 4px' }}>{s.icon}</p>
                  <p style={{ color:accent, fontFamily:'Poppins,sans-serif',
                    fontWeight:900, fontSize:20, margin:0 }}>{s.val}</p>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:9, margin:'2px 0 0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bar chart */}
        {recent.length > 0 && (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:18, padding:'20px', marginBottom:20 }}>
            <p style={{ color:txt, fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, margin:'0 0 16px' }}>
              📈 Recent Test Trend
            </p>
            <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:100 }}>
              {recent.map((a,i) => {
                const pct = a.total ? Math.round((a.score/a.total)*100) : 0
                const c = pct>=80?'#4ADE80':pct>=60?accent:'#F87171'
                return (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column',
                    alignItems:'center', gap:4 }}>
                    <span style={{ color:muted, fontSize:8 }}>{pct}%</span>
                    <div style={{ width:'100%', borderRadius:6,
                      height:`${Math.max(8, pct)}px`,
                      background:`linear-gradient(180deg,${c},${c}88)`,
                      boxShadow:`0 0 8px ${c}44`,
                      transition:'height 1s ease' }}/>
                    <span style={{ color:muted, fontSize:7 }}>
                      {new Date(a.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All tests list */}
        {attempts.length > 0 && (
          <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:18, overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:`1px solid ${bdr}` }}>
              <p style={{ color:txt, fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, margin:0 }}>
                All Tests ({attempts.length})
              </p>
            </div>
            {attempts.map((a,i) => {
              const pct = a.total ? Math.round((a.score/a.total)*100) : 0
              const c = pct>=80?'#4ADE80':pct>=60?accent:'#F87171'
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12,
                  padding:'11px 16px', borderBottom: i<attempts.length-1?`1px solid ${bdr}`:'none' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%',
                    background:`${c}18`, border:`2px solid ${c}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:c, fontWeight:900, fontSize:11, flexShrink:0 }}>{pct}%</div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:txt, fontWeight:600, fontSize:12, margin:0 }}>
                      {a.exam_name || 'Practice Test'}
                    </p>
                    <p style={{ color:muted, fontSize:10, margin:'2px 0 0' }}>
                      {a.score}/{a.total} · {new Date(a.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    </p>
                  </div>
                  {a.rank && <span style={{ color:accent, fontWeight:700, fontSize:11 }}>#{a.rank}</span>}
                </div>
              )
            })}
          </div>
        )}

        {attempts.length === 0 && !loading && (
          <div style={{ background:card, border:`1px dashed ${accent}35`,
            borderRadius:20, padding:'40px', textAlign:'center' }}>
            <p style={{ fontSize:40, margin:'0 0 12px' }}>📊</p>
            <p style={{ color:txt, fontWeight:700, fontSize:16, margin:'0 0 6px' }}>No data yet</p>
            <p style={{ color:muted, fontSize:13, margin:'0 0 16px' }}>Take your first test to see analytics</p>
            <button onClick={() => navigate('/student/test')} style={{
              background:`linear-gradient(135deg,${accent},${accentL})`,
              border:'none', borderRadius:12, padding:'10px 24px',
              color:primD, fontWeight:800, fontSize:13, cursor:'pointer' }}>
              Take a Test →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
