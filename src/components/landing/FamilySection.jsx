// src/components/landing/FamilySection.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function FamilySection() {
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
    '👨‍👩‍👧 Overview','📊 Progress','⚠️ Alerts',
    '📤 Share','💰 Family Plan','🔄 Convert Account','🇮🇳 Bharat Pulse',
  ]

  const MEMBERS = [
    { n:'Arjun (Son · UPSC)',      rank:'#1,243',  test:'UPSC GS Mock',   weak:'Economy',       trend:'↑ +12%', c:'#4ADE80' },
    { n:'Priya (Daughter · NEET)', rank:'#847',    test:'NEET Biology',   weak:'Organic Chem',  trend:'↑ +18%', c:accent    },
    { n:'Father (SSC CGL)',        rank:'#2,341',  test:'SSC Full Mock',  weak:'English',       trend:'↑ +8%',  c:'#60A5FA' },
    { n:'Mother (CTET)',           rank:'#1,021',  test:'CTET Paper 2',   weak:'EVS',           trend:'Steady', c:'#F472B6' },
  ]

  const CONTENT = [
    {
      title:'Monitor All 4 Family Members',
      desc:'One screen. Every family member\'s rank, last test, active streak, and weak subjects - all updated in real time. No switching apps, no asking the child every evening.',
      preview:(
        <div style={{background:isDark?`linear-gradient(135deg,${primD},${primary}60)`:primary,borderRadius:12,padding:14,border:`1px solid ${accent}25`}}>
          <p style={{color:'rgba(255,255,255,0.35)',fontSize:8,fontWeight:700,letterSpacing:'1px',margin:'0 0 10px'}}>SHARMA FAMILY · JUNE 2026</p>
          {MEMBERS.map((p,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:`${p.c}20`,border:`1.5px solid ${p.c}`,display:'flex',alignItems:'center',justifyContent:'center',color:p.c,fontWeight:800,fontSize:10,flexShrink:0}}>{p.n[0]}</div>
              <div style={{flex:1}}>
                <p style={{color:'#fff',fontSize:10,fontWeight:700,margin:0,lineHeight:1.2}}>{p.n}</p>
                <p style={{color:'rgba(255,255,255,0.35)',fontSize:8,margin:'1px 0 0'}}>Weak: {p.weak}</p>
              </div>
              <p style={{color:p.c,fontWeight:900,fontSize:13,fontFamily:'Poppins,sans-serif',margin:0}}>{p.rank}</p>
              <span style={{background:`${p.c}20`,color:p.c,fontSize:8,fontWeight:700,padding:'2px 6px',borderRadius:20,flexShrink:0}}>{p.trend}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Deep Progress Comparison',
      desc:'Today vs last week. This month vs last month. This year vs last year. All visualised clearly for every member so you see real growth, not just marks on a paper.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 10px',letterSpacing:'1px'}}>ARJUN - SSC CGL · JAN vs JUN 2026</p>
          {[{s:'Jan 2026',v:42,c:'#475569'},{s:'Jun 2026',v:82,c:'#4ADE80'}].map((r,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{color:i===1?'#4ADE80':muted,fontSize:10,fontWeight:i===1?700:400}}>{r.s}</span>
                <span style={{color:i===1?'#4ADE80':muted,fontWeight:i===1?900:500,fontSize:11}}>{r.v}%</span>
              </div>
              <div style={{height:i===1?7:5,borderRadius:4,background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)',overflow:'hidden'}}>
                <div style={{width:`${r.v}%`,height:'100%',background:r.c,borderRadius:4}}/>
              </div>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:6}}>
            <span style={{background:'#D1FAE5',color:'#065F46',fontSize:9,fontWeight:800,padding:'2px 9px',borderRadius:20}}>↑ +40% improvement in 6 months</span>
          </div>
          <div style={{marginTop:8,padding:'7px 10px',background:`${accent}10`,border:`1px solid ${accent}22`,borderRadius:8}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:0}}>📈 At this pace: ready for SSC CGL by September 2026</p>
          </div>
        </div>
      ),
    },
    {
      title:'Weak Subject Early Alerts',
      desc:'If any family member\'s score in any subject drops below their personal average - you get an automatic alert early enough to intervene. No more surprises on exam day.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <div style={{background:'rgba(248,113,113,0.08)',border:'1.5px solid rgba(248,113,113,0.28)',borderRadius:10,padding:'9px 11px',marginBottom:8}}>
            <p style={{color:'#F87171',fontWeight:700,fontSize:10,margin:'0 0 2px'}}>⚠️ Alert - Arjun · 2 hours ago</p>
            <p style={{color:isDark?'rgba(255,255,255,0.6)':'#475569',fontSize:9,margin:0,lineHeight:1.5}}>Algebra score dropped 8% vs his weekly average. This is the 2nd week in a row. Consider revision this weekend before it affects mock test results.</p>
          </div>
          <div style={{background:`${accent}10`,border:`1px solid ${accent}25`,borderRadius:10,padding:'9px 11px',marginBottom:8}}>
            <p style={{color:accent,fontWeight:700,fontSize:10,margin:'0 0 2px'}}>✅ Priya · Yesterday</p>
            <p style={{color:isDark?'rgba(255,255,255,0.6)':'#475569',fontSize:9,margin:0,lineHeight:1.5}}>Biology score improved to 94% - highest ever this year! Great consistency this week across 3 practice tests.</p>
          </div>
          <div style={{background:'rgba(74,222,128,0.08)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:10,padding:'7px 11px'}}>
            <p style={{color:'#4ADE80',fontSize:9,fontWeight:700,margin:0}}>📶 All 4 members studied today · Family streak: 12 days</p>
          </div>
        </div>
      ),
    },
    {
      title:'Share Progress with School or Tutor',
      desc:'Send any family member\'s monthly progress report to their school teacher or coaching centre in one tap - WhatsApp, PDF, or a shareable link. No manual reporting.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 10px',letterSpacing:'1px'}}>SHARE PRIYA\'S MONTHLY REPORT</p>
          {[['💬','WhatsApp','Send to teacher instantly','#4ADE80'],['📄','PDF Report','Download full monthly report',accent],['🔗','Share Link','Anyone with link can view','#60A5FA'],['🏫','To School','Send to Rajendra Classes directly','#A78BFA']].map(([ic,t,d,c])=>(
            <div key={t} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:`1px solid ${bdr}`,alignItems:'center'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:`${c}18`,border:`1px solid ${c}28`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{ic}</div>
              <div style={{flex:1}}>
                <p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{t}</p>
                <p style={{color:muted,fontSize:8,margin:'1px 0 0'}}>{d}</p>
              </div>
              <span style={{background:`${c}14`,color:c,fontSize:8,fontWeight:700,padding:'2px 8px',borderRadius:20,flexShrink:0}}>Send</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Family Plan - Save More Together',
      desc:'Family plan covers up to 4 members at special pricing. Referral cashback on every renewal. The more you learn together, the less you pay. Built for Indian households.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
            {[['₹999/yr','Individual · 1 member','#60A5FA'],['₹2,499/yr','Family · 4 members · Best Value','#4ADE80']].map(([pr,l,c])=>(
              <div key={l} style={{background:isDark?`${c}10`:surf,border:`2px solid ${c}30`,borderRadius:10,padding:'10px',textAlign:'center'}}>
                <p style={{color:c,fontWeight:900,fontSize:15,fontFamily:'Poppins,sans-serif',margin:0}}>{pr}</p>
                <p style={{color:muted,fontSize:8,margin:'3px 0 0',lineHeight:1.4}}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{background:`${accent}12`,border:`1px solid ${accent}25`,borderRadius:9,padding:'7px 11px',marginBottom:8,textAlign:'center'}}>
            <p style={{color:accent,fontSize:10,fontWeight:700,margin:0}}>Family plan saves ₹1,497/yr vs 4 individual plans</p>
          </div>
          <div style={{background:'rgba(74,222,128,0.08)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:9,padding:'7px 11px',textAlign:'center'}}>
            <p style={{color:'#4ADE80',fontSize:9,fontWeight:700,margin:0}}>One subscription quietly sponsors another student who cannot afford one</p>
          </div>
        </div>
      ),
    },
    {
      title:'Convert Any Account to Family Anytime',
      desc:'Your child already has a student account? Add them to your family plan instantly - no re-registration, no data loss, all their previous progress and ranks fully preserved.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 10px',letterSpacing:'1px'}}>ADD EXISTING ACCOUNT TO FAMILY</p>
          <div style={{display:'flex',gap:7,marginBottom:10}}>
            <input readOnly placeholder="Enter student email or phone..."
              style={{flex:1,padding:'8px 11px',borderRadius:9,border:`1px solid ${bdr}`,background:surf,color:txt,fontSize:10,outline:'none'}}/>
            <button style={{background:`linear-gradient(135deg,${accent},${accentL})`,border:'none',borderRadius:9,padding:'8px 13px',color:primD,fontWeight:700,fontSize:9,cursor:'pointer',whiteSpace:'nowrap'}}>Find →</button>
          </div>
          <div style={{background:'rgba(74,222,128,0.10)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:9,padding:'8px 11px',marginBottom:8}}>
            <p style={{color:'#4ADE80',fontSize:9,fontWeight:700,margin:'0 0 2px'}}>✅ Found: Priya Sharma · NEET Student · Active since Jan 2026</p>
            <p style={{color:isDark?'rgba(255,255,255,0.5)':'#475569',fontSize:8,margin:0}}>All 8 months of progress, ranks, and coins will be preserved. No data loss.</p>
          </div>
          <button style={{width:'100%',background:`linear-gradient(135deg,${accent},${accentL})`,border:'none',borderRadius:9,padding:'9px',color:primD,fontWeight:800,fontSize:11,cursor:'pointer'}}>Add Priya to Family Plan →</button>
        </div>
      ),
    },
    {
      title:'Bharat Pulse - See What They Learned Today',
      desc:'Every day your child gets one India story with a real exam question attached. See exactly which story they read and whether they got the linked question right - right inside your family dashboard.',
      preview:(
        <div style={{background:isDark?`${accent}10`:card,border:`1px solid ${accent}28`,borderRadius:12,padding:12}}>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <span style={{color:accent,fontSize:9,fontWeight:700}}>🇮🇳 PRIYA'S STORY TODAY</span>
          </div>
          <p style={{color:txt,fontWeight:700,fontSize:12,margin:'0 0 6px',lineHeight:1.4}}>Why Manipur gets two monsoons - read at 7:42 PM</p>
          <p style={{color:muted,fontSize:10,margin:'0 0 8px',lineHeight:1.6}}>Bharat Pulse turns everyday scrolling into exam prep. See the story, see the linked question, see if they got it right.</p>
          <div style={{background:surf,borderRadius:8,padding:'7px 10px'}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:'0 0 3px'}}>? Linked Question Result</p>
            <p style={{color:txt,fontSize:10,margin:0}}>Answered correctly on first try</p>
          </div>
        </div>
      ),
    },
  ]

  const bg = isDark
    ? 'var(--color-bg,#0F172A)'
    : 'var(--color-surface,#F8FAFC)'

  return (
    <section id="family" style={{padding:'80px clamp(16px,4vw,32px)',background:bg,scrollMarginTop:80,transition:'background 0.4s'}}>
      <div style={{maxWidth:1140,margin:'0 auto'}}>

        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:`${accent}12`,border:`1px solid ${accent}28`,borderRadius:20,padding:'5px 16px',marginBottom:14}}>
            <span style={{color:accent,fontSize:11,fontWeight:700,letterSpacing:'1px'}}>👨‍👩‍👧 FOR FAMILIES</span>
          </div>
          <h2 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:'clamp(22px,4vw,40px)',color:txt,margin:'0 0 10px'}}>
            Your Family's Success. <span style={{color:accent}}>In One Screen.</span>
          </h2>
          <p style={{color:muted,fontSize:14,maxWidth:560,margin:'0 auto',lineHeight:1.7}}>
            Monitor up to 4 family members. Get early alerts on weak subjects. Share progress with schools. Convert any account. All in one family dashboard built for Indian households.
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,overflowX:'auto',marginBottom:24,paddingBottom:4}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)}
              style={{flexShrink:0,padding:'7px 13px',borderRadius:20,
                border:`1px solid ${tab===i?accent+'50':bdr}`,
                background:tab===i?`${accent}18`:'transparent',
                color:tab===i?accent:muted,
                fontSize:10,fontWeight:700,cursor:'pointer',
                transition:'all 0.2s',whiteSpace:'nowrap'}}>
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
              Get Family Plan →
            </button>
          </div>
          <div style={{background:card,border:`1.5px solid ${accent}20`,borderRadius:18,padding:18,boxShadow:isDark?`0 8px 32px rgba(0,0,0,0.3)`:`0 4px 20px rgba(0,0,0,0.06)`}}>
            {CONTENT[tab].preview}
          </div>
        </div>

      </div>
    </section>
  )
}
