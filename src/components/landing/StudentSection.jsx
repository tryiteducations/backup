// src/components/landing/StudentSection.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function StudentSection() {
  const navigate = useNavigate()
  const isDark  = false
  const accent  = '#F59E0B'
  const accentL = '#FCD34D'
  const primary = '#2D1B69'
  const primD   = '#1A0D3D'

  const [tab, setTab] = useState(0)

  const txt  = isDark ? '#ffffff' : 'var(--color-text,#0F1020)'
  const muted= isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-text-light,#64748B)'
  const card = isDark ? 'rgba(255,255,255,0.04)' : 'var(--color-surface,#ffffff)'
  const bdr  = isDark ? 'rgba(255,255,255,0.08)' : 'var(--color-border,#E2E8F0)'
  const surf = isDark ? 'rgba(255,255,255,0.03)' : 'var(--color-bg,#F8FAFC)'

  const TABS = [
    '🏆 Leaderboard','⚔️ Hall & Battle','📚 Classroom',
    '🇮🇳 Bharat Pulse','🤝 GuruHub','🏆 Tournaments',
    '🎮 Games','⚡ Quick Test','📊 Analytics',
    '💰 Referral','🌐 42+ Languages',
  ]

  const CONTENT = [
    {
      title:'All-India Leaderboard',
      desc:'Real rank after every test - not at the end, but immediately. Watch yourself climb from #50,000 to #500 month by month. Every state, every exam, one real rank.',
      preview:(
        <div style={{borderRadius:12,overflow:'hidden',border:`1px solid ${bdr}`}}>
          <div style={{background:isDark?primD:primary,padding:'7px 12px',display:'grid',gridTemplateColumns:'40px 1fr 80px 55px',gap:8}}>
            {['Rank','Student','Exam','Score'].map(h=><span key={h} style={{color:accent,fontSize:9,fontWeight:700}}>{h}</span>)}
          </div>
          {[{m:'🥇',n:'Priya S.',s:'Kerala',e:'NEET',sc:'97.4%'},{m:'🥈',n:'Rahul K.',s:'Delhi',e:'UPSC',sc:'94.8%'},{m:'#1,243',n:'You →',s:'TN',e:'SSC',sc:'78%',you:true}].map((r,i)=>(
            <div key={i} style={{padding:'6px 12px',borderBottom:`1px solid ${bdr}`,display:'grid',gridTemplateColumns:'40px 1fr 80px 55px',alignItems:'center',background:r.you?`${accent}14`:'transparent'}}>
              <span style={{color:i===0?accent:i===1?'#9CA3AF':accent,fontSize:i<2?14:10,fontWeight:900}}>{r.m}</span>
              <div><p style={{color:r.you?accent:txt,fontSize:10,fontWeight:700,margin:0}}>{r.n}</p><p style={{color:muted,fontSize:8,margin:0}}>{r.s}</p></div>
              <span style={{background:isDark?`${accent}20`:'#DBEAFE',color:isDark?accent:'#1D4ED8',fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:20}}>{r.e}</span>
              <span style={{color:accent,fontWeight:800,fontSize:11}}>{r.sc}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'The Hall - Battle Arena',
      desc:'Create a study hall, invite your batch, battle live in quiz wars. The hall that studies together, ranks together. Hall rank shown separately from All-India rank.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <div><p style={{color:txt,fontWeight:700,fontSize:12,margin:0}}>SSC Grinders Hall</p><p style={{color:muted,fontSize:9,margin:'1px 0 0'}}>19 members · 6 online · Battle LIVE</p></div>
            <span style={{background:'rgba(74,222,128,0.15)',color:'#4ADE80',fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:20}}>LIVE ⚔️</span>
          </div>
          <div style={{display:'flex',gap:4,marginBottom:8}}>
            {['R','P','K','A','S','M','D'].map((l,i)=><div key={i} style={{width:22,height:22,borderRadius:'50%',background:['#60A5FA',accent,'#4ADE80','#F472B6','#A78BFA','#FB923C','#34D399'][i],display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:9}}>{l}</div>)}
            <div style={{width:22,height:22,borderRadius:'50%',background:bdr,display:'flex',alignItems:'center',justifyContent:'center',color:muted,fontSize:8}}>+12</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
            {[['3rd','Hall Rank',accent],['87%','Avg Score','#4ADE80'],['8','Tests/Month','#60A5FA']].map(([v,l,c])=>(
              <div key={l} style={{background:surf,borderRadius:8,padding:'6px',textAlign:'center'}}>
                <p style={{color:c,fontWeight:900,fontSize:13,margin:0}}>{v}</p>
                <p style={{color:muted,fontSize:8,margin:'2px 0 0'}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title:'Classroom - Your Digital Study Room',
      desc:'PDFs, study planners, e-books, concept cards - every subject, every exam, perfectly organised. Download for offline use. Works on 2G.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          {[{ic:'📄',t:'NEET Biology Notes Ch.12',sz:'47 pages · PDF',c:'#4ADE80'},{ic:'📊',t:'SSC CGL Previous 10 Years',sz:'2400 questions',c:accent},{ic:'📅',t:'30-Day UPSC Study Plan',sz:'Personalised',c:'#60A5FA'},{ic:'📖',t:'IBPS PO eBook 2024',sz:'320 pages · Free',c:'#A78BFA'}].map((f,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:`1px solid ${bdr}`}}>
              <span style={{fontSize:18}}>{f.ic}</span>
              <div style={{flex:1}}><p style={{color:txt,fontSize:11,fontWeight:600,margin:0}}>{f.t}</p><p style={{color:muted,fontSize:9,margin:'1px 0 0'}}>{f.sz}</p></div>
              <span style={{background:`${f.c}18`,color:f.c,fontSize:8,fontWeight:700,padding:'2px 6px',borderRadius:20}}>Open</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Bharat Pulse - Know the Unknown India',
      desc:'One powerful India story every day - with a real exam question that appears in UPSC, SSC, or State PSC. Know the unknown India while you practise.',
      preview:(
        <div style={{background:isDark?`${accent}10`:card,border:`1px solid ${accent}28`,borderRadius:12,padding:12}}>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <span style={{color:accent,fontSize:9,fontWeight:700}}>🇮🇳 TODAY · June 22</span>
          </div>
          <p style={{color:txt,fontWeight:700,fontSize:12,margin:'0 0 6px',lineHeight:1.4}}>Why Manipur gets two monsoons - and why it matters for UPSC Geography</p>
          <p style={{color:muted,fontSize:10,margin:'0 0 8px',lineHeight:1.6}}>Northeast India unique geography creates a double monsoon pattern. Southwest monsoon arrives in June, Northeast in October...</p>
          <div style={{background:surf,borderRadius:8,padding:'7px 10px'}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:'0 0 3px'}}>🎯 Today's Exam Question</p>
            <p style={{color:txt,fontSize:10,margin:0}}>Which state experiences both Southwest and Northeast Monsoon?</p>
          </div>
        </div>
      ),
    },
    {
      title:'GuruHub - Post Any Doubt, Get Answered',
      desc:'Post your doubt right now. A verified mentor from your own state answers in your language - usually within minutes. No stranger, no embarrassment.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:isDark?primD:primary,display:'flex',alignItems:'center',justifyContent:'center',color:accent,fontWeight:900,fontSize:11,flexShrink:0}}>S</div>
            <div style={{background:surf,borderRadius:10,padding:'7px 10px',flex:1}}>
              <p style={{color:muted,fontSize:9,margin:'0 0 2px'}}>Suresh · Tamil Nadu · 5 min ago</p>
              <p style={{color:txt,fontSize:10,fontWeight:600,margin:0}}>Please explain Article 32 vs 226?</p>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${accent},${accentL})`,display:'flex',alignItems:'center',justifyContent:'center',color:primD,fontWeight:900,fontSize:11,flexShrink:0}}>D</div>
            <div style={{background:'rgba(74,222,128,0.10)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:10,padding:'7px 10px',flex:1}}>
              <p style={{color:'#4ADE80',fontSize:9,fontWeight:700,margin:'0 0 2px'}}>Deepa · Kerala · ✅ Replied in 4 min</p>
              <p style={{color:txt,fontSize:10,margin:0}}>Article 32 = Supreme Court directly for Fundamental Rights. Article 226 = High Court for any legal right...</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title:'All-India Tournaments',
      desc:'Compete with lakhs of students in live tournaments for your target exam. Win coins, badges, and free Pro months. Real competition. Real glory.',
      preview:(
        <div style={{background:isDark?`linear-gradient(135deg,${primD},${primary}60)`:primary,borderRadius:12,padding:12,border:`1px solid ${accent}25`}}>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:8,fontWeight:700,letterSpacing:'1px',margin:'0 0 6px'}}>NEXT TOURNAMENT</p>
          <p style={{color:'#fff',fontWeight:800,fontSize:12,margin:'0 0 2px',fontFamily:'Poppins,sans-serif'}}>All India SSC CGL Championship</p>
          <p style={{color:accent,fontSize:10,margin:'0 0 10px'}}>📅 July 15 · 9:00 AM IST · 100 Questions · 90 min</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
            {[['84,231','Registered',accent],['Free','Entry for Pro','#4ADE80'],['July 15','Results Live','#60A5FA']].map(([v,l,c])=>(
              <div key={l} style={{background:'rgba(255,255,255,0.08)',borderRadius:8,padding:'6px',textAlign:'center'}}>
                <p style={{color:c,fontWeight:900,fontSize:12,margin:0}}>{v}</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:8,margin:'2px 0 0'}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title:'Brain Games Hub - 24 Games',
      desc:'24 brain-sharpening games. Math Blitz, GK Battle, Word Rush, Memory Match, Logic Grid. Earn coins every day you play. Unlock themes with coins.',
      preview:(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[{e:'🔢',n:'Math Blitz',c:'#60A5FA',v:'+15🪙'},{e:'🌍',n:'GK Battle',c:accent,v:'+12🪙'},{e:'📝',n:'Word Rush',c:'#4ADE80',v:'+10🪙'},{e:'🧩',n:'Logic Grid',c:'#A78BFA',v:'+18🪙'},{e:'🃏',n:'Memory Match',c:'#F472B6',v:'+8🪙'},{e:'⚡',n:'Speed Read',c:'#FB923C',v:'+14🪙'}].map((g,i)=>(
            <div key={i} style={{background:card,border:`1px solid ${g.c}22`,borderRadius:10,padding:'8px 10px',display:'flex',alignItems:'center',gap:7}}>
              <span style={{fontSize:18}}>{g.e}</span>
              <div><p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{g.n}</p><p style={{color:g.c,fontSize:9,fontWeight:700,margin:'1px 0 0'}}>{g.v}</p></div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Quick Test - Launch in 10 Seconds',
      desc:'Topic-wise, subject-wise, or full mock - pick your target and start immediately. Results, rank, and explanation all instant. No setup, no waiting.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>SELECT TEST TYPE</p>
          {[['📚','Topic-wise Test','Profit & Loss · 10Q · 8 min',accent],['🎯','Subject Test','Mathematics · 25Q · 20 min','#60A5FA'],['📋','Full Mock','SSC CGL · 100Q · 60 min','#4ADE80']].map(([ic,t,d,c])=>(
            <div key={t} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',background:surf,borderRadius:9,marginBottom:5,border:`1px solid ${c}20`,cursor:'pointer'}}>
              <span style={{fontSize:16}}>{ic}</span>
              <div style={{flex:1}}><p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{t}</p><p style={{color:muted,fontSize:8,margin:'1px 0 0'}}>{d}</p></div>
              <span style={{background:`${c}18`,color:c,fontSize:8,fontWeight:700,padding:'2px 8px',borderRadius:8}}>Start →</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Smart Analytics - Know Your True Potential',
      desc:'Weak subjects, strong topics. This month vs last month. All visualised so you know exactly where to focus. No guessing - data-driven improvement.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>JUNE 2026 PERFORMANCE</p>
          {[{s:'Biology',v:91,c:'#4ADE80',l:'Strong 💪'},{s:'Chemistry',v:82,c:accent,l:'Good 📈'},{s:'Physics',v:65,c:'#FB923C',l:'Practise more'},{s:'Math',v:48,c:'#F87171',l:'⚠️ Focus now'}].map((x,i)=>(
            <div key={i} style={{marginBottom:7}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{color:txt,fontSize:10,fontWeight:600}}>{x.s}</span>
                <div style={{display:'flex',gap:6}}>
                  <span style={{color:x.c,fontSize:9,fontWeight:700}}>{x.l}</span>
                  <span style={{color:x.c,fontWeight:900,fontSize:11}}>{x.v}%</span>
                </div>
              </div>
              <div style={{height:5,borderRadius:3,background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)',overflow:'hidden'}}>
                <div style={{width:`${x.v}%`,height:'100%',background:x.c,borderRadius:3}}/>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Referral Cashback - Your Network is Your Scholarship',
      desc:'Refer 1 friend and both get a free Pro month. Refer 3 friends and you get a full year free. Every subscription also sponsors a student who cannot afford one.',
      preview:(
        <div style={{background:isDark?`${accent}10`:card,border:`1px solid ${accent}28`,borderRadius:12,padding:12}}>
          <p style={{color:accent,fontWeight:700,fontSize:11,margin:'0 0 8px',fontFamily:'Poppins,sans-serif'}}>Your Referral Progress</p>
          <div style={{display:'flex',gap:5,marginBottom:10}}>
            {[{n:'Arjun',s:'Joined ✓',c:'#4ADE80'},{n:'Priya',s:'Joined ✓',c:'#4ADE80'},{n:'Ram',s:'Pending',c:accent}].map((f,i)=>(
              <div key={i} style={{flex:1,background:surf,borderRadius:8,padding:'6px',textAlign:'center'}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:`${f.c}22`,border:`1.5px solid ${f.c}`,margin:'0 auto 3px',display:'flex',alignItems:'center',justifyContent:'center',color:f.c,fontWeight:800,fontSize:9}}>{f.n[0]}</div>
                <p style={{color:txt,fontSize:8,fontWeight:600,margin:0}}>{f.n}</p>
                <p style={{color:f.c,fontSize:7,margin:'1px 0 0'}}>{f.s}</p>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(74,222,128,0.12)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:8,padding:'6px 10px',textAlign:'center'}}>
            <p style={{color:'#4ADE80',fontWeight:800,fontSize:10,margin:0}}>2/3 referred · 1 more = 1 Year Pro FREE!</p>
          </div>
        </div>
      ),
    },
    {
      title:'Career Compass - AI Maps Your Perfect Exam',
      desc:'Answer 8 questions about your interests, strengths, and goals. Our AI maps your ideal exam path in 60 seconds. Covers all 1,10,000+ pathways.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px'}}>Q4 of 8 - What interests you most?</p>
          {['Governance & Public Policy','Science & Technology','Finance & Economics','Teaching & Education'].map((o,i)=>(
            <div key={i} style={{padding:'6px 10px',borderRadius:8,border:`1px solid ${i===2?accent:bdr}`,background:i===2?`${accent}14`:'transparent',marginBottom:5,cursor:'pointer'}}>
              <span style={{color:i===2?accent:txt,fontSize:10,fontWeight:i===2?700:400}}>{i===2?'✓ ':''}{o}</span>
            </div>
          ))}
          <div style={{marginTop:6,background:`${accent}12`,borderRadius:8,padding:'6px 10px'}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:0}}>AI Result: UPSC CSE + State Finance Services 🎯</p>
          </div>
        </div>
      ),
    },
    {
      title:'42+ Indian Languages - Every Mother Tongue',
      desc:'Every question, explanation, and memory trick in your mother tongue. Tamil, Manipuri, Kashmiri, Bhojpuri - all 42 covered. Works on 2G anywhere in India.',
      preview:(
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {[['Tamil','#E53E3E'],['Hindi','#DD6B20'],['Telugu','#D69E2E'],['Kannada','#38A169'],['Malayalam','#3182CE'],['Bengali','#805AD5'],['Marathi','#E53E3E'],['Manipuri','#DD6B20'],['Kashmiri','#D69E2E'],['Bhojpuri','#38A169'],['Assamese','#3182CE'],['Odia','#805AD5']].map(([l,c],i)=>(
            <span key={i} style={{background:`${c}14`,border:`1px solid ${c}30`,borderRadius:20,padding:'4px 10px',color:c,fontSize:10,fontWeight:700}}>{l}</span>
          ))}
          <span style={{background:`${accent}14`,border:`1px solid ${accent}30`,borderRadius:20,padding:'4px 10px',color:accent,fontSize:10,fontWeight:700}}>+30 more →</span>
        </div>
      ),
    },
  ]

  const bg = isDark
    ? `radial-gradient(ellipse 60% 40% at 50% 50%,${primary}22,transparent),var(--color-bg,#0F172A)`
    : 'var(--color-bg,#F8FAFC)'

  return (
    <section id="student" style={{padding:'80px clamp(16px,4vw,32px)',background:bg,scrollMarginTop:80,transition:'background 0.4s'}}>
      <div style={{maxWidth:1140,margin:'0 auto'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:`${accent}12`,border:`1px solid ${accent}28`,borderRadius:20,padding:'5px 16px',marginBottom:14}}>
            <span style={{color:accent,fontSize:11,fontWeight:700,letterSpacing:'1px'}}>🎓 FOR STUDENTS</span>
          </div>
          <h2 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:'clamp(22px,4vw,40px)',color:txt,margin:'0 0 10px'}}>
            Everything You Need. <span style={{color:accent}}>Nothing You Don't.</span>
          </h2>
          <p style={{color:muted,fontSize:14,maxWidth:560,margin:'0 auto',lineHeight:1.7}}>
            No YouTube. No coaching fee. No travel. No stranger fear. Subscribe once - another student who cannot afford it studies free alongside you.
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,overflowX:'auto',marginBottom:24,paddingBottom:4}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)}
              style={{flexShrink:0,padding:'7px 13px',borderRadius:20,
                border:`1px solid ${tab===i?accent+'50':bdr}`,
                background:tab===i?`${accent}18`:'transparent',
                color:tab===i?accent:muted,fontSize:10,fontWeight:700,
                cursor:'pointer',transition:'all 0.2s',whiteSpace:'nowrap'}}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,460px),1fr))',gap:28,alignItems:'start'}}>
          <div>
            <h3 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,color:txt,fontSize:20,margin:'0 0 12px'}}>{CONTENT[tab].title}</h3>
            <p style={{color:muted,fontSize:14,lineHeight:1.75,margin:'0 0 20px'}}>{CONTENT[tab].desc}</p>
            <button onClick={()=>navigate('/register')}
              style={{background:`linear-gradient(135deg,${accent},${accentL})`,border:'none',borderRadius:14,padding:'12px 28px',color:primD,fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
              Start Free →
            </button>
          </div>
          <div style={{background:card,border:`1.5px solid ${accent}20`,borderRadius:18,padding:18,boxShadow:isDark?`0 8px 32px rgba(0,0,0,0.3)`:`0 4px 20px rgba(0,0,0,0.06)`}}>
            {CONTENT[tab].preview}
          </div>
        </div>

        {/* Referral CTA banner */}
        <div style={{marginTop:28,background:isDark?`linear-gradient(135deg,${primary}60,${primD}80)`:primary,borderRadius:20,padding:'18px 24px',border:`1px solid ${accent}25`,display:'flex',flexWrap:'wrap',gap:16,alignItems:'center',justifyContent:'center',textAlign:'center'}}>
          <div>
            <p style={{color:'#fff',fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:17,margin:'0 0 4px'}}>Refer a Friend → Both Get Free Pro Month</p>
            <p style={{color:'rgba(255,255,255,0.65)',fontSize:13,margin:0}}>Refer 3 → you get 1 year free. Every subscription sponsors a student who cannot afford one. That is TryIT.</p>
          </div>
          <button onClick={()=>navigate('/register')} style={{background:`linear-gradient(135deg,${accent},${accentL})`,border:'none',borderRadius:14,padding:'11px 24px',color:primD,fontWeight:800,fontSize:14,cursor:'pointer',whiteSpace:'nowrap'}}>Share & Earn Free Pro →</button>
        </div>
      </div>
    </section>
  )
}
