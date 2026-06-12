import { useState, useEffect, useRef } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'
import { rewardCurrentAffairsRead } from '../../lib/coinVault'

const TODAY   = new Date().toLocaleDateString('en-IN',{ day:'numeric', month:'long', year:'numeric' })
const DOW     = new Date().toLocaleDateString('en-IN',{ weekday:'long' })
const READ_KEY = `tryit_ca_read_${new Date().toISOString().split('T')[0]}`
const LIMIT_FREE = 3   // free users read timer after 3

const ARTICLES = [
  { id:1, cat:'National',       emoji:'🇮🇳', important:true,
    title:'India Signs Comprehensive Free Trade Agreement with UK',
    body:'India and the United Kingdom formally signed a comprehensive Free Trade Agreement today after 3 years of negotiations, covering goods, services, and digital trade. The deal eliminates tariffs on 99% of Indian exports.',
    tags:['UPSC','SSC','IBPS'], date:'Today', readTime:45 },
  { id:2, cat:'Economy',        emoji:'💰', important:true,
    title:'RBI Keeps Repo Rate Unchanged at 6.25%',
    body:"The Reserve Bank of India's MPC voted 4-2 to maintain the repo rate at 6.25%, citing balanced inflation expectations. EMI on home and car loans remain unchanged.",
    tags:['IBPS','RBI','Banking'], date:'Today', readTime:40 },
  { id:3, cat:'Science',        emoji:'🚀', important:true,
    title:'ISRO Successfully Launches NISAR Earth Observation Satellite',
    body:"India's ISRO and NASA jointly launched the NISAR satellite — the world's most expensive Earth imaging satellite at $1.5 billion — from Sriharikota.",
    tags:['UPSC','SSC'], date:'Today', readTime:35 },
  { id:4, cat:'Sports',         emoji:'🏏', important:false,
    title:'India Wins T20 World Cup 2026, Defeats South Africa by 7 Wickets',
    body:'India clinched the ICC T20 World Cup 2026 final in the West Indies, with Rohit Sharma scoring an unbeaten 74. This is India\'s second T20 World Cup title.',
    tags:['GK','All Exams'], date:'Today', readTime:30 },
  { id:5, cat:'Awards',         emoji:'🏆', important:false,
    title:'Dr. Pankaj Advani Receives Padma Bhushan for Sports Excellence',
    body:'Billiards legend Dr. Pankaj Advani received the Padma Bhushan from the President of India for his outstanding contribution to Indian sports with 26 world titles.',
    tags:['UPSC','SSC'], date:'Today', readTime:30 },
  { id:6, cat:'Environment',    emoji:'🌍', important:true,
    title:'India Achieves 200 GW Solar Capacity — Third Largest in World',
    body:"India reached its ambitious 200 GW solar target ahead of schedule, cementing its position as the world's third-largest solar market after China and the USA.",
    tags:['UPSC','Environment'], date:'Today', readTime:40 },
  { id:7, cat:'International',  emoji:'🌐', important:true,
    title:"India Joins G7 as Permanent Observer — Historic Diplomatic Milestone",
    body:"India was granted permanent observer status at the G7 summit in Italy, a significant elevation of India's global diplomatic standing and economic influence.",
    tags:['UPSC','IR'], date:'Today', readTime:35 },
  { id:8, cat:'Economy',        emoji:'📊', important:true,
    title:'India GDP Growth 7.2% in FY26 — Fastest Growing Major Economy',
    body:"India's GDP grew 7.2% in FY2025-26, the third consecutive year of fastest growth among major economies, driven by manufacturing and services exports.",
    tags:['UPSC','IBPS','Economy'], date:'Today', readTime:40 },
]

const CATEGORIES = ['All','National','International','Economy','Science','Sports','Awards','Environment']

export default function CurrentAffairs() {
  const { user }          = useAuth()
  const { earn, balance } = useCoins()

  const [cat,        setCat]     = useState('All')
  const [saved,      setSaved]   = useState(new Set())
  const [expanded,   setExpanded]= useState(null)
  const [reading,    setReading] = useState(null)   // article id being timed
  const [readTimer,  setTimer]   = useState(0)
  const [rewarded,   setRewarded]= useState(()=>JSON.parse(localStorage.getItem(READ_KEY)||'[]'))
  const [todayCoins, setToday]   = useState(0)
  const [quizOpen,   setQuiz]    = useState(false)
  const timerRef = useRef(null)

  const isPro      = user?.isPro || false
  const readCount  = rewarded.length
  const filtered   = cat==='All' ? ARTICLES : ARTICLES.filter(a=>a.cat===cat)

  // Start read timer when article expanded
  const openArticle = (id) => {
    if (expanded === id) { setExpanded(null); stopTimer(); return }
    setExpanded(id)
    if (!rewarded.includes(id)) startTimer(id)
  }

  const startTimer = (id) => {
    setReading(id); setTimer(0)
    clearInterval(timerRef.current)
    const article = ARTICLES.find(a=>a.id===id)
    const needed  = article?.readTime || 30

    timerRef.current = setInterval(async () => {
      setTimer(t => {
        if (t+1 >= needed) {
          clearInterval(timerRef.current)
          awardCoins(id)
          return needed
        }
        return t+1
      })
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(timerRef.current)
    setReading(null); setTimer(0)
  }

  const awardCoins = async (id) => {
    if (rewarded.includes(id)) return
    const updated = [...rewarded, id]
    setRewarded(updated)
    localStorage.setItem(READ_KEY, JSON.stringify(updated))

    // Free users: only first 3 get coins (anti-spam)
    if (!isPro && updated.length > LIMIT_FREE) return

    const result = await rewardCurrentAffairsRead({ userId: user?.id })
    if (result?.coins) {
      earn({ source:'current_affairs', amount:5, description:'Read today\'s current affairs 📰' })
      setToday(c=>c+5)
    }
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>📰 Current Affairs</h1>
          <p style={{ color:'#94A3B8', fontSize:14 }}>Exam-tagged daily news · Read to earn coins</p>
        </div>
        <button onClick={()=>setQuiz(true)}
          style={{ background:'linear-gradient(135deg,#D4AF37,#E8C44A)', border:'none', borderRadius:14, padding:'11px 20px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
          🎯 Daily Quiz +15 coins
        </button>
      </div>

      {/* Date + coins earned today */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(30,58,95,0.06)', border:'1px solid rgba(30,58,95,0.15)', borderRadius:20, padding:'6px 14px' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', display:'inline-block' }}/>
          <span style={{ color:'#1E3A5F', fontSize:12, fontWeight:700, fontFamily:'Poppins,sans-serif' }}>
            {DOW}, {TODAY} — Today's Edition
          </span>
        </div>
        {todayCoins > 0 && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:20, padding:'6px 14px' }}>
            <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700 }}>🪙 +{todayCoins} earned today</span>
          </div>
        )}
      </div>

      {/* Free tier notice */}
      {!isPro && (
        <div style={{ background:'#EFF6FF', borderRadius:14, padding:'10px 16px', marginBottom:14, border:'1px solid #BFDBFE', display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <p style={{ color:'#1E40AF', fontSize:13 }}>
            📖 Free: {readCount}/{LIMIT_FREE} articles with +5 coins today.
            {readCount >= LIMIT_FREE ? ' Upgrade for unlimited.' : ` ${LIMIT_FREE-readCount} more earn coins.`}
          </p>
          {readCount >= LIMIT_FREE && (
            <button style={{ background:'#1E3A5F', border:'none', borderRadius:10, padding:'6px 14px', color:'#D4AF37', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
              Upgrade Pro →
            </button>
          )}
        </div>
      )}

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, marginBottom:18, overflowX:'auto', paddingBottom:4 }}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            style={{ padding:'7px 16px', borderRadius:20, border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, background:cat===c?'#1E3A5F':'#fff', color:cat===c?'#fff':'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(a=>{
          const isRead    = rewarded.includes(a.id)
          const isReading = reading === a.id
          const pct       = isRead ? 100 : isReading ? Math.round((readTimer/a.readTime)*100) : 0

          return (
            <div key={a.id} style={{ background:'#fff', borderRadius:20,
              border:`1.5px solid ${a.important?'rgba(212,175,55,0.3)':'#E2E8F0'}`,
              overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>

              {/* Read progress bar */}
              {(isReading || isRead) && (
                <div style={{ height:3, background:'#F1F5F9' }}>
                  <div style={{ width:`${pct}%`, height:3, background: isRead?'#22C55E':'#D4AF37', transition:'width 1s linear' }}/>
                </div>
              )}

              <div style={{ padding:'14px 16px', cursor:'pointer' }} onClick={()=>openArticle(a.id)}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <span style={{ fontSize:24, flexShrink:0 }}>{a.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:6, alignItems:'center' }}>
                      <span style={{ background:'rgba(30,58,95,0.08)', color:'#1E3A5F', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{a.cat}</span>
                      {a.important && <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>⭐ Important</span>}
                      {isRead && <span style={{ background:'#DCFCE7', color:'#15803D', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>✅ +5 🪙</span>}
                      {isReading && !isRead && <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>⏳ {a.readTime-readTimer}s to earn coins</span>}
                    </div>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E293B', fontSize:14, lineHeight:1.4, marginBottom:8 }}>{a.title}</p>

                    {expanded===a.id && (
                      <p style={{ color:'#475569', fontSize:13, lineHeight:1.7, marginBottom:10 }}>{a.body}</p>
                    )}

                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {a.tags.map(t=>(
                          <span key={t} style={{ background:'#EDE9FE', color:'#7C3AED', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{t}</span>
                        ))}
                      </div>
                      <button onClick={(e)=>{ e.stopPropagation(); setSaved(p=>{ const n=new Set(p); n.has(a.id)?n.delete(a.id):n.add(a.id); return n }) }}
                        style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:saved.has(a.id)?'#D4AF37':'#CBD5E1' }}>
                        {saved.has(a.id)?'★':'☆'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Daily Quiz Modal */}
      {quizOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'#fff', borderRadius:24, padding:28, maxWidth:440, width:'100%' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:20, marginBottom:8 }}>🎯 Today's Current Affairs Quiz</p>
            <p style={{ color:'#64748B', fontSize:14, marginBottom:20 }}>5 questions from today's news. +15 coins for completing.</p>
            <p style={{ color:'#1E3A5F', fontWeight:600, fontSize:14 }}>Q1. Which country did India sign an FTA with today?</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12, marginBottom:16 }}>
              {['USA','UK','Germany','France'].map((opt,i)=>(
                <button key={i} onClick={async()=>{
                  earn({ source:'daily_quiz', amount:15, description:'Daily Current Affairs Quiz ✅' })
                  setQuiz(false)
                }} style={{ padding:'11px 16px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#F8FAFC', textAlign:'left', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontSize:14, color:'#1E293B' }}>
                  {['A','B','C','D'][i]}. {opt}
                </button>
              ))}
            </div>
            <button onClick={()=>setQuiz(false)} style={{ background:'none', border:'none', color:'#94A3B8', cursor:'pointer', fontSize:13 }}>Cancel</button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
