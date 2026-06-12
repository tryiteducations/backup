import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useCoins } from '../../context/CoinContext'

const TAGS = ['All','#SSC','#UPSC','#NEET','#JEE','#IBPS','#FocusMode','#StreakGoal','#Comeback','#FirstGen','#FromVillage']

const STORIES = [
  {
    id:'s1', pinned:true, verified:true,
    user:'Priya Sharma', initials:'PS', state:'Kerala', level:9, levelEmoji:'🌟',
    exam:'NEET UG', tags:['#NEET','#FocusMode','#Comeback'],
    rankBefore:8432, rankAfter:1243, daysActive:30,
    testsCompleted:67, avgScore:92, streak:42,
    story:"I was stuck at Rank #8,432 for 3 months. I started using Focus Mode for 2 hours every morning (Biology + Chemistry alternating days) and took 3 mock tests per week. The coin deduction when I failed actually terrified me into being serious — I nearly went negative twice! After 30 days: Rank #1,243. The 7-layer explanation in Tamil made Chemistry crystal clear for the first time in my life. Thank you TryIT 🙏",
    votes:847, comments:43, coinsAwarded:100,
    postedAt:'2 days ago',
  },
  {
    id:'s2', pinned:true, verified:true,
    user:'Mohammed Arif', initials:'MA', state:'UP', level:8, levelEmoji:'⚡',
    exam:'UPSC CSE', tags:['#UPSC','#StreakGoal','#FirstGen'],
    rankBefore:12840, rankAfter:2341, daysActive:60,
    testsCompleted:94, avgScore:78, streak:60,
    story:"First person in my family to attempt UPSC. No coaching centre, no money for books. TryIT Pro via the First-Generation Learner discount saved me. 60-day streak. The Guru Hub mentors answered every single Polity doubt I had — in Hindi. When I posted my rank improvement, my mother cried. This platform changed my family's future.",
    votes:1204, comments:89, coinsAwarded:100,
    postedAt:'5 days ago',
  },
  {
    id:'s3', pinned:false, verified:true,
    user:'Deepika R.', initials:'DR', state:'Manipur', level:6, levelEmoji:'🦁',
    exam:'CTET', tags:['#CTET','#FromVillage','#FocusMode'],
    rankBefore:5621, rankAfter:987, daysActive:45,
    testsCompleted:52, avgScore:84, streak:31,
    story:"I live in a village in Manipur where there are no coaching centres. TryIT is available in Meitei language — I cried when I saw this. Focus Mode + Current Affairs daily for 45 days brought me to Rank #987. I start my 3rd mock test today. Dreams are possible from any corner of India.",
    votes:624, comments:31, coinsAwarded:100,
    postedAt:'1 week ago',
  },
  {
    id:'s4', pinned:false, verified:false,
    user:'Karan T.', initials:'KT', state:'Rajasthan', level:5, levelEmoji:'💪',
    exam:'SSC CGL', tags:['#SSC','#Comeback'],
    rankBefore:9200, rankAfter:3400, daysActive:25,
    testsCompleted:38, avgScore:71, streak:21,
    story:"Failed SSC CGL twice. Almost gave up. My friend showed me TryIT. The coin deduction system scared me — I was at -180 coins once. That fear made me study 4 hours daily. 25 days, 38 tests. Not at top yet but moving. For anyone who failed before: the platform won't let you be lazy.",
    votes:289, comments:18, coinsAwarded:30,
    postedAt:'2 weeks ago',
  },
]

export default function CommunityHall() {
  const navigate       = useNavigate()
  const { user }       = useAuth()
  const { earn }       = useCoins()
  const [tag,       setTag]     = useState('All')
  const [stories,   setStories] = useState(STORIES)
  const [voted,     setVoted]   = useState(new Set())
  const [posting,   setPosting] = useState(false)
  const [form,      setForm]    = useState({ before:'', after:'', days:'', story:'', exam:'', tags:[] })
  const [submitted, setSubmit]  = useState(false)

  const filtered = tag==='All' ? stories : stories.filter(s=>s.tags.includes(tag))
  const pinned   = filtered.filter(s=>s.pinned)
  const regular  = filtered.filter(s=>!s.pinned)

  const vote = (id) => {
    if (voted.has(id)) return
    setVoted(v=>new Set([...v,id]))
    setStories(s=>s.map(st=>st.id===id?{...st,votes:st.votes+1}:st))
  }

  const submit = async () => {
    if (!form.story || !form.before || !form.after) return
    const newStory = {
      id: `s-${Date.now()}`, pinned:false, verified:false,
      user: user?.name || 'Anonymous', initials: user?.initials || 'U',
      state: user?.state || 'India', level: user?.level || 1, levelEmoji: user?.levelEmoji || '🔥',
      exam: form.exam || 'SSC CGL', tags: form.tags,
      rankBefore: parseInt(form.before), rankAfter: parseInt(form.after), daysActive: parseInt(form.days)||30,
      testsCompleted: 0, avgScore: 0, streak: user?.streak || 0,
      story: form.story, votes:0, comments:0, coinsAwarded:30,
      postedAt:'Just now',
    }
    setStories(s=>[newStory,...s])
    await earn({ source:'community', amount:30, description:'Posted a success story 🏆' })
    setSubmit(true)
    setTimeout(()=>{ setPosting(false); setSubmit(false); setForm({ before:'', after:'', days:'', story:'', exam:'', tags:[] }) }, 2500)
  }

  return (
    <AppLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28 }}>🏛️ Community Hall</h1>
          <p style={{ color:'#94A3B8', fontSize:14, marginTop:2 }}>Real students. Real ranks. Real transformations.</p>
        </div>
        <button onClick={()=>setPosting(true)}
          style={{ background:'linear-gradient(135deg,#D4AF37,#E8C44A)', border:'none', borderRadius:14, padding:'11px 22px', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
          ✍️ Share Your Story (+30 🪙)
        </button>
      </div>

      {/* Tags */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {TAGS.map(t=>(
          <button key={t} onClick={()=>setTag(t)}
            style={{ padding:'7px 16px', borderRadius:20, border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, background:tag===t?'#1E3A5F':'#fff', color:tag===t?'#fff':'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Pinned stories */}
      {pinned.length>0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:16 }}>📌</span>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:15 }}>Pinned by TryIT Team</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {pinned.map(s=><StoryCard key={s.id} story={s} voted={voted} onVote={vote}/>)}
          </div>
        </div>
      )}

      {/* Regular stories */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {regular.map(s=><StoryCard key={s.id} story={s} voted={voted} onVote={vote}/>)}
      </div>

      {/* Post modal */}
      {posting && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:500, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px 16px', overflowY:'auto' }}>
          <div style={{ background:'#fff', borderRadius:24, padding:28, maxWidth:520, width:'100%', marginTop:20 }}>
            {submitted ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <p style={{ fontSize:56 }}>🎉</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:22, marginTop:12 }}>Story Submitted!</p>
                <p style={{ color:'#64748B', fontSize:14, marginTop:8 }}>+30 coins added to your wallet. Our team will review and may pin your story!</p>
              </div>
            ) : (
              <>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:20, marginBottom:6 }}>✍️ Share Your Success</p>
                <p style={{ color:'#64748B', fontSize:13, marginBottom:20 }}>Inspire thousands of students across India. Verified stories earn +100 bonus coins.</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
                  {[['Rank Before','before','e.g. 8432'],['Rank After','after','e.g. 1243'],['Days Active','days','e.g. 30']].map(([l,k,ph])=>(
                    <div key={k}>
                      <label style={{ display:'block', color:'#1E3A5F', fontSize:12, fontWeight:600, marginBottom:5 }}>{l}</label>
                      <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph} type="number"
                        style={{ width:'100%', padding:'10px 12px', borderRadius:12, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box' }}
                        onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:'block', color:'#1E3A5F', fontSize:12, fontWeight:600, marginBottom:5 }}>Your Story *</label>
                  <textarea value={form.story} onChange={e=>setForm(f=>({...f,story:e.target.value}))}
                    placeholder="Tell us your journey — what changed, what helped, what you learned..."
                    rows={5}
                    style={{ width:'100%', padding:'12px 14px', borderRadius:14, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box', resize:'vertical', fontFamily:'Inter,sans-serif' }}
                    onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                </div>
                <div style={{ display:'flex', gap:10, marginTop:4 }}>
                  <button onClick={submit} disabled={!form.story||!form.before||!form.after}
                    style={{ flex:2, padding:14, borderRadius:14, border:'none', background:form.story&&form.before&&form.after?'linear-gradient(135deg,#D4AF37,#E8C44A)':'rgba(212,175,55,0.3)', color:'#1E3A5F', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>
                    Share Story (+30 🪙)
                  </button>
                  <button onClick={()=>setPosting(false)}
                    style={{ flex:1, padding:14, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  )
}

function StoryCard({ story:s, voted, onVote }) {
  const [expanded, setExpanded] = useState(false)
  const rankDiff = s.rankBefore - s.rankAfter

  return (
    <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:`1.5px solid ${s.pinned?'rgba(212,175,55,0.3)':'#E2E8F0'}`, boxShadow: s.pinned?'0 6px 24px rgba(212,175,55,0.1)':'0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Pinned header */}
      {s.pinned && (
        <div style={{ background:'linear-gradient(135deg,#D4AF37,#E8C44A)', padding:'5px 16px', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:12 }}>📌</span>
          <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:11, letterSpacing:'1px' }}>
            FEATURED BY TRYIT TEAM
          </span>
          {s.verified && <span style={{ marginLeft:'auto', background:'rgba(30,58,95,0.15)', color:'#1E3A5F', fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:20 }}>✅ VERIFIED RESULT</span>}
        </div>
      )}

      <div style={{ padding:'18px 18px 14px' }}>
        {/* User + rank change */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
          <div style={{ width:46, height:46, borderRadius:'50%', background:'linear-gradient(135deg,#1E3A5F,#0F2140)', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4AF37', fontWeight:800, fontSize:16, flexShrink:0 }}>{s.initials}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{s.user}</p>
              <span style={{ background:'rgba(30,58,95,0.08)', color:'#1E3A5F', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{s.exam}</span>
              <span style={{ background:'#EDE9FE', color:'#7C3AED', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{s.levelEmoji} {s.state}</span>
              {!s.pinned && s.verified && <span style={{ background:'#DCFCE7', color:'#15803D', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>✅ Verified</span>}
            </div>
            <p style={{ color:'#94A3B8', fontSize:11, marginTop:3 }}>{s.daysActive} days active · {s.postedAt}</p>
          </div>
        </div>

        {/* Rank transformation — THE HERO NUMBER */}
        <div style={{ background:'linear-gradient(135deg,rgba(30,58,95,0.06),rgba(212,175,55,0.04))', borderRadius:16, padding:14, marginBottom:14, border:'1px solid rgba(212,175,55,0.15)', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ textAlign:'center', flex:1 }}>
            <p style={{ color:'#94A3B8', fontSize:11 }}>Before</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#EF4444', fontSize:26 }}>#{s.rankBefore.toLocaleString()}</p>
          </div>
          <div style={{ textAlign:'center', flexShrink:0 }}>
            <p style={{ color:'#D4AF37', fontSize:28, fontWeight:900 }}>→</p>
            <p style={{ color:'#22C55E', fontSize:11, fontWeight:700 }}>+{rankDiff.toLocaleString()} ranks</p>
          </div>
          <div style={{ textAlign:'center', flex:1 }}>
            <p style={{ color:'#94A3B8', fontSize:11 }}>After {s.daysActive} days</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#22C55E', fontSize:26 }}>#{s.rankAfter.toLocaleString()}</p>
          </div>
        </div>

        {/* Story text */}
        <p style={{ color:'#475569', fontSize:14, lineHeight:1.7, marginBottom:12 }}>
          {expanded ? s.story : s.story.slice(0,180)+'...'}
        </p>
        {s.story.length>180 && (
          <button onClick={()=>setExpanded(!expanded)}
            style={{ background:'none', border:'none', color:'#D4AF37', cursor:'pointer', fontSize:13, fontWeight:600, padding:0, marginBottom:12 }}>
            {expanded?'Show less ▲':'Read full story ▼'}
          </button>
        )}

        {/* Tags */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
          {s.tags.map(t=>(
            <span key={t} style={{ background:'#F1F5F9', color:'#64748B', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{t}</span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <button onClick={()=>onVote(s.id)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:20, border:`1.5px solid ${voted.has(s.id)?'#D4AF37':'#E2E8F0'}`, background:voted.has(s.id)?'rgba(212,175,55,0.1)':'#F8FAFC', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, color:voted.has(s.id)?'#D4AF37':'#64748B' }}>
            ▲ {s.votes}
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:20, border:'1.5px solid #E2E8F0', background:'#F8FAFC', cursor:'pointer', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13, color:'#64748B' }}>
            💬 {s.comments}
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:20, border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#94A3B8' }}>
            📤 Share
          </button>
          {s.verified && (
            <span style={{ marginLeft:'auto', background:'#DCFCE7', color:'#15803D', fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:20 }}>
              +{s.coinsAwarded} 🪙 awarded
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
