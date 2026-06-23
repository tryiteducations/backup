// src/components/landing/MentorSection.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export default function MentorSection() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark  = theme?.isDark ?? false
  const accent  = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primary = theme?.primary ?? '#1E3A5F'
  const primD   = theme?.primaryDark ?? '#0F2140'

  const [tab, setTab] = useState(0)

  const txt  = isDark ? '#ffffff' : 'var(--color-text,#0F1020)'
  const muted= isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-text-light,#64748B)'
  const card = isDark ? 'rgba(255,255,255,0.04)' : 'var(--color-surface,#ffffff)'
  const bdr  = isDark ? 'rgba(255,255,255,0.08)' : 'var(--color-border,#E2E8F0)'
  const surf = isDark ? 'rgba(255,255,255,0.03)' : 'var(--color-bg,#F8FAFC)'

  const TABS = [
    '📝 Qualify','💬 Answer & Earn','🎟️ Auto Coupons',
    '📚 Content Sales','🎓 Classes','💰 Payout',
    '🏫 Go Institution','🚫 AI Policy',
  ]

  const CONTENT = [
    {
      title:'Step 1 — Qualify With Your Expertise',
      desc:'No minimum years of experience required. No college degree needed. Just score 80%+ in a topic proficiency test for at least one subject and your mentor profile goes live immediately.',
      earn:null,
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>BIOLOGY PROFICIENCY TEST</p>
          {['Cell Division & Mitosis','Genetics & Heredity','Human Physiology','Ecology & Environment'].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 9px',borderRadius:8,background:i<3?`${accent}10`:'transparent',border:`1px solid ${i<3?accent+'28':bdr}`,marginBottom:5}}>
              <span style={{color:i<3?'#4ADE80':muted,fontSize:12}}>{i<3?'✓':'○'}</span>
              <span style={{color:i<3?txt:muted,fontSize:10,fontWeight:i<3?600:400}}>{t}</span>
              {i<3&&<span style={{marginLeft:'auto',color:'#4ADE80',fontSize:8,fontWeight:700}}>Passed</span>}
            </div>
          ))}
          <div style={{background:'rgba(74,222,128,0.10)',border:'1px solid rgba(74,222,128,0.2)',borderRadius:8,padding:'7px 10px',marginTop:6,textAlign:'center'}}>
            <p style={{color:'#4ADE80',fontWeight:700,fontSize:10,margin:0}}>Score: 88% ✅ Biology Expert Badge Unlocked!</p>
          </div>
        </div>
      ),
    },
    {
      title:'Step 2 — Answer Doubts, Earn Per Rating',
      desc:'Students post doubts. You answer in their language. Every 4★ or 5★ rating earns you coins and cashback automatically. Best Answer badge earns extra ₹5 cashback per answer.',
      earn:'₹5 cashback per Best Answer · 15 coins per 5★ rating',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:10}}>
            {[['₹5','Per Best Answer',accent],['15','Coins per 5★','#4ADE80'],['249','Answers this month','#60A5FA'],['₹12,450','Cashback pending','#A78BFA']].map(([v,l,c])=>(
              <div key={l} style={{background:surf,border:`1px solid ${c}22`,borderRadius:9,padding:'8px',textAlign:'center'}}>
                <p style={{color:c,fontWeight:900,fontSize:15,fontFamily:'Poppins,sans-serif',margin:0}}>{v}</p>
                <p style={{color:muted,fontSize:8,margin:'2px 0 0'}}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{background:`${accent}12`,border:`1px solid ${accent}25`,borderRadius:8,padding:'7px 10px'}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:0}}>Avg rating: 4.9★ · Top Mentor badge active · Cashback auto-transfers July 1</p>
          </div>
        </div>
      ),
    },
    {
      title:'Step 3 — Auto Coupon at Every Milestone',
      desc:'Cross 50 answers → TryIT auto-generates your personal coupon code. Student gets X% off their subscription. You earn the same X% as cashback. Both win. Completely automatic.',
      earn:'10–25% cashback matching student discount',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          {[[50,'10%','#60A5FA','ACTIVE'],[100,'15%','#4ADE80','ACTIVE'],[250,'20%',accent,'1 away!'],[500,'25%','#A78BFA','Locked']].map(([ans,pct,c,status])=>(
            <div key={ans} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',borderRadius:9,background:status==='ACTIVE'?`${c}10`:'transparent',border:`1px solid ${status==='ACTIVE'?c+'30':bdr}`,marginBottom:5}}>
              <div style={{width:20,height:20,borderRadius:'50%',background:`${c}20`,border:`1.5px solid ${c}`,display:'flex',alignItems:'center',justifyContent:'center',color:c,fontWeight:900,fontSize:9,flexShrink:0}}>
                {status==='ACTIVE'?'✓':status==='1 away!'?'!':'🔒'}
              </div>
              <div style={{flex:1}}>
                <p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{ans} answers → {pct} slab</p>
                <p style={{color:muted,fontSize:8,margin:'1px 0 0'}}>Student discount = Your cashback = {pct}</p>
              </div>
              <span style={{background:`${c}18`,color:c,fontSize:8,fontWeight:700,padding:'2px 7px',borderRadius:20,flexShrink:0}}>{status}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Step 4 — Sell Content, Keep 80%',
      desc:'Upload question sets, study notes, PDFs, or books. Students buy with coins or direct payment. TryIT takes 20% platform fee. You keep 80% of every single sale.',
      earn:'80% revenue on every content sale',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>MY CONTENT STORE</p>
          {[{t:'NEET Biology PYQ Set',pr:'200 coins / ₹29',sales:234,earn:'₹677',c:'#4ADE80'},{t:'Endosymbiosis Memory Guide',pr:'Free',sales:1240,earn:'₹0 (reputation)',c:'#60A5FA'},{t:'Biology Complete Notes 2024',pr:'₹49',sales:89,earn:'₹3,492',c:accent}].map((x,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'6px 0',borderBottom:`1px solid ${bdr}`}}>
              <div style={{flex:1}}>
                <p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{x.t}</p>
                <p style={{color:muted,fontSize:8,margin:'1px 0 0'}}>{x.pr} · {x.sales} sales</p>
              </div>
              <span style={{color:'#4ADE80',fontSize:10,fontWeight:700,flexShrink:0}}>{x.earn}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Step 5 — Conduct Paid Classes',
      desc:'Live classes at ₹99–₹199 per student enrollment. Pan-India reach. Teach from your room. Unlimited students per class. You earn 80% of every enrollment.',
      earn:'₹79–₹159 per enrollment (you keep 80%)',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>MY ACTIVE CLASSES</p>
          {[{t:'NEET Bio Masterclass — June',e:67,pr:'₹149',earn:'₹9,988',c:'#4ADE80'},{t:'UPSC GS Paper 1 Crash',e:34,pr:'₹199',earn:'₹5,398',c:accent},{t:'SSC CGL Complete Course',e:112,pr:'₹99',earn:'₹8,870',c:'#60A5FA'}].map((cl,i)=>(
            <div key={i} style={{padding:'7px 9px',borderRadius:9,border:`1px solid ${cl.c}22`,background:`${cl.c}08`,marginBottom:6}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{cl.t}</p>
                <p style={{color:'#4ADE80',fontSize:10,fontWeight:800,margin:0}}>{cl.earn}</p>
              </div>
              <p style={{color:muted,fontSize:8,margin:'2px 0 0'}}>{cl.e} students enrolled · {cl.pr}/student · 80% yours</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Step 6 — Monthly UPI Payout',
      desc:'All cashback transfers automatically to your bank or UPI on the 1st of every month — after a one-time government ID verification (Aadhaar / PAN / Driving Licence).',
      earn:'Auto-transfer to UPI every month 1st',
      preview:(
        <div style={{background:isDark?`linear-gradient(135deg,${primD},${primary}60)`:primary,borderRadius:12,padding:14,border:`1px solid ${accent}25`}}>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:8,fontWeight:700,letterSpacing:'1px',margin:'0 0 10px'}}>JULY 2026 PAYOUT — DEEPA NAIR</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:10}}>
            {[['₹12,450','Answer Cashback',accent],['₹9,988','Class Revenue','#4ADE80'],['₹3,492','Content Sales','#60A5FA'],['July 1','Auto Payout','#F472B6']].map(([v,l,c])=>(
              <div key={l} style={{background:'rgba(255,255,255,0.08)',borderRadius:8,padding:'7px',textAlign:'center'}}>
                <p style={{color:c,fontWeight:900,fontSize:14,fontFamily:'Poppins,sans-serif',margin:0}}>{v}</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:8,margin:'2px 0 0'}}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{background:`${accent}18`,border:`1px solid ${accent}30`,borderRadius:8,padding:'6px 10px',textAlign:'center'}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:0}}>💳 deepa@okhdfc · KYC Verified ✅ · Auto-transfer active</p>
          </div>
        </div>
      ),
    },
    {
      title:'Graduate to Institution Partner',
      desc:'After 500+ answers or 100+ class enrollments — upgrade to a full Institution partner dashboard with bulk student management and higher revenue tiers.',
      earn:'Institution-level revenue + full analytics dashboard',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <div style={{flex:1,height:8,borderRadius:4,background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)',overflow:'hidden'}}>
              <div style={{width:'50%',height:'100%',background:`linear-gradient(90deg,#60A5FA,${accent})`}}/>
            </div>
            <span style={{color:accent,fontSize:10,fontWeight:700,flexShrink:0}}>249 / 500</span>
          </div>
          <p style={{color:muted,fontSize:9,margin:'0 0 10px'}}>251 more answers to unlock Institution Partner tier</p>
          {[['🎓','Mentor — Current','Answer doubts · Sell content · Classes','#4ADE80'],['🏫','Institution Partner','Bulk students · Higher revenue · Full dashboard',accent]].map(([ic,t,d,c])=>(
            <div key={t} style={{display:'flex',gap:8,padding:'7px 9px',borderRadius:9,background:`${c}08`,border:`1px solid ${c}22`,marginBottom:6}}>
              <span style={{fontSize:18}}>{ic}</span>
              <div><p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{t}</p><p style={{color:muted,fontSize:8,margin:'1px 0 0'}}>{d}</p></div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'AI Policy — Zero Tolerance',
      desc:'Any AI-generated answer detected = immediate warning. Second violation = 3-day account freeze. Third = 14-day suspension. Continued = permanent termination. Your expertise must be genuine.',
      earn:null,
      preview:(
        <div style={{background:'rgba(248,113,113,0.06)',border:'1.5px solid rgba(248,113,113,0.25)',borderRadius:12,padding:12}}>
          <p style={{color:'#F87171',fontWeight:800,fontSize:11,margin:'0 0 10px',fontFamily:'Poppins,sans-serif'}}>🚫 Zero Tolerance — AI Detection Active</p>
          {[['⚠️','1st Detection','Warning sent. Answer flagged for review.','#F59E0B'],['❄️','2nd Violation','Account frozen 3 days. Earnings paused.','#60A5FA'],['🧊','3rd Violation','14-day suspension. Admin review initiated.','#A78BFA'],['🚫','Repeated','Permanent ban. Earnings withheld.','#F87171']].map(([ic,t,d,c])=>(
            <div key={t} style={{display:'flex',gap:8,padding:'6px 0',borderBottom:'1px solid rgba(248,113,113,0.10)'}}>
              <span style={{fontSize:14,flexShrink:0}}>{ic}</span>
              <div><p style={{color:c,fontSize:10,fontWeight:700,margin:0}}>{t}</p><p style={{color:muted,fontSize:9,margin:'1px 0 0'}}>{d}</p></div>
            </div>
          ))}
        </div>
      ),
    },
  ]

  const bg = isDark ? 'var(--color-bg,#0F172A)' : 'var(--color-surface,#F8FAFC)'

  return (
    <section id="mentor" style={{padding:'80px clamp(16px,4vw,32px)',background:bg,scrollMarginTop:80,transition:'background 0.4s'}}>
      <div style={{maxWidth:1140,margin:'0 auto'}}>

        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:`${accent}12`,border:`1px solid ${accent}28`,borderRadius:20,padding:'5px 16px',marginBottom:14}}>
            <span style={{color:accent,fontSize:11,fontWeight:700,letterSpacing:'1px'}}>🧑‍🏫 FOR MENTORS</span>
          </div>
          <h2 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:'clamp(22px,4vw,40px)',color:txt,margin:'0 0 10px'}}>
            Teach From Home. <span style={{color:accent}}>Earn Without Limits.</span>
          </h2>
          <p style={{color:muted,fontSize:14,maxWidth:560,margin:'0 auto',lineHeight:1.7}}>
            Prove you know one subject deeply. Start answering doubts. Earn cashback. Unlock coupons. Conduct paid classes. Grow to an institution. Your knowledge is your income — from anywhere in India.
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
            <p style={{color:muted,fontSize:14,lineHeight:1.75,margin:'0 0 16px'}}>{CONTENT[tab].desc}</p>
            {CONTENT[tab].earn && (
              <div style={{background:`${accent}12`,border:`1px solid ${accent}28`,borderRadius:12,padding:'10px 14px',marginBottom:20}}>
                <p style={{color:accent,fontSize:12,fontWeight:700,margin:0}}>💰 {CONTENT[tab].earn}</p>
              </div>
            )}
            <button onClick={()=>navigate('/register')}
              style={{background:`linear-gradient(135deg,${accent},${accentL})`,border:'none',borderRadius:14,padding:'12px 28px',color:primD,fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
              Become a Mentor →
            </button>
          </div>
          <div style={{background:card,border:`1.5px solid ${accent}20`,borderRadius:18,padding:18,boxShadow:isDark?`0 8px 32px rgba(0,0,0,0.3)`:`0 4px 20px rgba(0,0,0,0.06)`}}>
            {CONTENT[tab].preview}
          </div>
        </div>

        {/* Earnings summary */}
        <div style={{marginTop:28,background:isDark?`linear-gradient(135deg,${primary}50,${primD}70)`:primary,borderRadius:20,padding:'18px 24px',border:`1px solid ${accent}25`,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12}}>
          {[['10% ↔ 10%','50 answers slab'],['15% ↔ 15%','100 answers slab'],['20% ↔ 20%','250 answers slab'],['₹ on 1st','Monthly UPI auto']].map(([v,l])=>(
            <div key={l} style={{textAlign:'center',background:'rgba(255,255,255,0.06)',border:`1px solid ${accent}20`,borderRadius:12,padding:'12px 10px'}}>
              <p style={{color:accent,fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:18,margin:0}}>{v}</p>
              <p style={{color:'rgba(255,255,255,0.45)',fontSize:10,margin:'3px 0 0'}}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
