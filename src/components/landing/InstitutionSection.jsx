// src/components/landing/InstitutionSection.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function InstitutionSection() {
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
    '📊 Analytics','📝 Test Engine','👥 Students',
    '📈 Progress','⏰ Attendance','🌐 Languages','💸 Cost Savings','🇮🇳 Bharat Pulse','🏛️ Study Halls',
    '📚 Homework','💰 Revenue'
  ]

  const CONTENT = [
    {
      title:'Live Student Analytics Dashboard',
      desc:'Who attended. Who skipped. Minutes spent. Weak subjects per student. All automatic - zero manual work. Intervene early before small gaps become big exam-day failures.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>CLASS OVERVIEW - JUNE 2026</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:6,marginBottom:10}}>
            {[['28','Students',accent],['87%','Attendance','#4ADE80'],['8','Tests Run','#60A5FA'],['19%','Avg Improvement','#F472B6']].map(([v,l,c])=>(
              <div key={l} style={{background:isDark?`${c}10`:surf,border:`1px solid ${c}20`,borderRadius:8,padding:'6px 5px',textAlign:'center'}}>
                <p style={{color:c,fontWeight:900,fontSize:13,margin:0}}>{v}</p>
                <p style={{color:muted,fontSize:7,margin:'1px 0 0'}}>{l}</p>
              </div>
            ))}
          </div>
          {[{n:'Priya S.',sc:92,c:'#4ADE80',w:'Org. Chem'},{n:'Karthik',sc:84,c:accent,w:'Algebra'},{n:'Ananya',sc:76,c:'#60A5FA',w:'History'},{n:'Suresh',sc:48,c:'#F87171',w:'Physics ⚠️'}].map((r,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'4px 0'}}>
              <span style={{color:txt,fontSize:9,fontWeight:600,width:52,flexShrink:0}}>{r.n}</span>
              <div style={{flex:1,height:5,borderRadius:3,background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)',overflow:'hidden'}}>
                <div style={{width:`${r.sc}%`,height:'100%',background:r.c}}/>
              </div>
              <span style={{color:r.c,fontSize:9,fontWeight:700,width:28,textAlign:'right',flexShrink:0}}>{r.sc}%</span>
              <span style={{background:'rgba(248,113,113,0.12)',color:'#F87171',fontSize:7,fontWeight:700,padding:'1px 5px',borderRadius:20,flexShrink:0,whiteSpace:'nowrap'}}>{r.w}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Conduct Tests Daily - Auto-Generated',
      desc:'Choose subject → choose topics → set difficulty → launch. Auto-generates questions from our 1,10,000+ question bank. Share a 6-digit code. Students join from any phone. Done.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>CREATE TEST IN 3 STEPS</p>
          {[['1','Select Subject','Biology ✓',accent],['2','Choose Topics','Cell Division, Genetics ✓','#4ADE80'],['3','Set & Share','20Q · 30 min · Code: 847291','#60A5FA']].map(([n,l,v,c])=>(
            <div key={n} style={{display:'flex',gap:9,padding:'8px 0',borderBottom:`1px solid ${bdr}`}}>
              <div style={{width:20,height:20,borderRadius:'50%',background:`${c}20`,border:`1.5px solid ${c}`,display:'flex',alignItems:'center',justifyContent:'center',color:c,fontWeight:900,fontSize:9,flexShrink:0}}>{n}</div>
              <div style={{flex:1}}>
                <p style={{color:muted,fontSize:9,margin:0}}>{l}</p>
                <p style={{color:c,fontSize:10,fontWeight:700,margin:'1px 0 0'}}>{v}</p>
              </div>
            </div>
          ))}
          <button style={{width:'100%',marginTop:10,background:`linear-gradient(135deg,${accent},${accentL})`,border:'none',borderRadius:9,padding:'8px',color:primD,fontWeight:800,fontSize:11,cursor:'pointer'}}>
            🚀 Generate & Share Code
          </button>
        </div>
      ),
    },
    {
      title:'Student Management - Complete Control',
      desc:'Add students, organise by batch, set exam targets, track individual progress, send alerts to parents - all from one screen. No spreadsheets. No WhatsApp groups chasing attendance.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>BATCH: NEET 2026 · 28 STUDENTS</p>
          {[{n:'Priya Sharma',batch:'NEET 2026',rank:'#847',status:'On Track',c:'#4ADE80'},{n:'Karthik M.',batch:'SSC CGL',rank:'#2,341',status:'Needs help',c:'#F59E0B'},{n:'Suresh P.',batch:'UPSC',rank:'#4,821',status:'Struggling',c:'#F87171'}].map((s,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:`1px solid ${bdr}`}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:`${s.c}20`,border:`1.5px solid ${s.c}`,display:'flex',alignItems:'center',justifyContent:'center',color:s.c,fontWeight:800,fontSize:10,flexShrink:0}}>{s.n[0]}</div>
              <div style={{flex:1}}>
                <p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{s.n}</p>
                <p style={{color:muted,fontSize:8,margin:'1px 0 0'}}>{s.batch} · {s.rank}</p>
              </div>
              <span style={{background:`${s.c}15`,color:s.c,fontSize:8,fontWeight:700,padding:'2px 8px',borderRadius:20,flexShrink:0}}>{s.status}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Jan vs June Progress Comparison',
      desc:'See every student\'s improvement month by month, subject by subject. Share progress reports with parents in one tap. Show them the real value of your coaching.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>JAN 2026 vs JUN 2026</p>
          {[{n:'Priya S.',jan:52,jun:92,c:'#4ADE80'},{n:'Karthik',jan:42,jun:84,c:accent},{n:'Ananya',jan:38,jun:76,c:'#60A5FA'},{n:'Suresh',jan:30,jun:48,c:'#FB923C'}].map((r,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{color:txt,fontSize:10,fontWeight:600}}>{r.n}</span>
                <span style={{background:'#D1FAE5',color:'#065F46',fontSize:8,fontWeight:800,padding:'1px 7px',borderRadius:20}}>↑ +{r.jun-r.jan}%</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'42px 1fr 30px',gap:5,alignItems:'center',marginBottom:2}}>
                <span style={{color:muted,fontSize:8}}>Jan</span>
                <div style={{height:4,borderRadius:2,background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)',overflow:'hidden'}}><div style={{width:`${r.jan}%`,height:'100%',background:'#475569'}}/></div>
                <span style={{color:muted,fontSize:8}}>{r.jan}%</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'42px 1fr 30px',gap:5,alignItems:'center'}}>
                <span style={{color:r.c,fontSize:8,fontWeight:700}}>Jun</span>
                <div style={{height:6,borderRadius:3,background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)',overflow:'hidden'}}><div style={{width:`${r.jun}%`,height:'100%',background:r.c}}/></div>
                <span style={{color:r.c,fontSize:9,fontWeight:700}}>{r.jun}%</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Attendance Tracking - Automated',
      desc:'See who attended, who was absent, for exactly how many minutes - all automatic. No manual register. No chasing students. Alert parents instantly when a student misses a session.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>JUNE 2026 ATTENDANCE</p>
          {[{n:'Priya S.',days:[1,1,1,1,1,0,1,1,1,1,1,1,1,1],pct:93},{n:'Karthik',days:[1,0,1,0,1,0,1,0,0,1,1,0,1,0],pct:50},{n:'Suresh',days:[1,1,1,1,1,1,1,1,1,1,1,1,1,0],pct:93}].map((s,i)=>(
            <div key={i} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{color:txt,fontSize:10,fontWeight:600}}>{s.n}</span>
                <span style={{color:s.pct>=80?'#4ADE80':s.pct>=60?accent:'#F87171',fontSize:9,fontWeight:700}}>{s.pct}%</span>
              </div>
              <div style={{display:'flex',gap:2}}>
                {s.days.map((d,j)=>(
                  <div key={j} style={{width:13,height:13,borderRadius:3,background:d?(s.pct>=80?'#4ADE80':accent):(isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)')}}/>
                ))}
              </div>
            </div>
          ))}
          <div style={{marginTop:8,background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:8,padding:'6px 10px'}}>
            <p style={{color:'#F87171',fontSize:9,fontWeight:700,margin:0}}>⚠️ Karthik below 60% - parent alert sent automatically</p>
          </div>
        </div>
      ),
    },
    {
      title:'40+ Languages - Every Student Learns in Their Mother Tongue',
      desc:'Your students from Tamil Nadu, Maharashtra, Manipur - all study in their own language. Same test, same question bank, different languages. No one is left behind.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 10px',letterSpacing:'1px'}}>LANGUAGES YOUR STUDENTS USE</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
            {[['Tamil','#E53E3E'],['Hindi','#DD6B20'],['Telugu','#D69E2E'],['Kannada','#38A169'],['Malayalam','#3182CE'],['Bengali','#805AD5'],['Marathi','#E53E3E'],['Odia','#DD6B20'],['Punjabi','#D69E2E'],['Assamese','#38A169'],['Manipuri','#3182CE'],['Gujarati','#805AD5']].map(([l,c])=>(
              <span key={l} style={{background:`${c}14`,border:`1px solid ${c}28`,borderRadius:20,padding:'3px 9px',color:c,fontSize:9,fontWeight:700}}>{l}</span>
            ))}
            <span style={{background:`${accent}14`,border:`1px solid ${accent}28`,borderRadius:20,padding:'3px 9px',color:accent,fontSize:9,fontWeight:700}}>+30 →</span>
          </div>
          <div style={{background:`${accent}10`,border:`1px solid ${accent}22`,borderRadius:9,padding:'7px 10px'}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:0}}>Set per-student language · Switch anytime · Works on 2G</p>
          </div>
        </div>
      ),
    },
    {
      title:'Save Lakhs Every Year',
      desc:'No printing. No manual test papers. No extra staff. No travel. From ₹999/year for unlimited students - the only EdTech that actually saves institutions money.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>ANNUAL COST - 100 STUDENTS</p>
          {[['Test Paper Printing','₹48,000/yr','₹0'],['Manual Grading Time','₹36,000/yr','₹0'],['Extra Admin Staff','₹1,20,000/yr','₹0'],['Student Travel Cost','₹2,40,000/yr','₹0'],['TryIT Platform','-','₹999/yr']].map(([item,old,nw])=>(
            <div key={item} style={{display:'grid',gridTemplateColumns:'1fr 70px 70px',gap:5,padding:'5px 0',borderBottom:`1px solid ${bdr}`}}>
              <span style={{color:muted,fontSize:9}}>{item}</span>
              <span style={{color:'#F87171',fontSize:9,fontWeight:600,textAlign:'right'}}>{old}</span>
              <span style={{color:'#4ADE80',fontSize:9,fontWeight:700,textAlign:'right'}}>{nw}</span>
            </div>
          ))}
          <div style={{background:`${accent}12`,border:`1px solid ${accent}25`,borderRadius:8,padding:'7px 10px',marginTop:8,textAlign:'center'}}>
            <p style={{color:accent,fontWeight:800,fontSize:10,margin:0}}>Total Annual Savings: ₹4,43,001 → Pay only ₹999</p>
          </div>
        </div>
      ),
    },
    {
      title:'Bharat Pulse - Daily GK for Every Enrolled Student',
      desc:'One India story and exam question, pushed automatically to every student under your institution - free bonus content that keeps them on the platform daily, with zero extra work for your staff.',
      preview:(
        <div style={{background:isDark?`${accent}10`:card,border:`1px solid ${accent}28`,borderRadius:12,padding:12}}>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <span style={{color:accent,fontSize:9,fontWeight:700}}>🇮🇳 AUTO-DELIVERED TODAY</span>
          </div>
          <p style={{color:txt,fontWeight:700,fontSize:12,margin:'0 0 6px',lineHeight:1.4}}>Why Manipur gets two monsoons - sent to all 340 of your students</p>
          <p style={{color:muted,fontSize:10,margin:'0 0 8px',lineHeight:1.6}}>No setup needed. Every enrolled student gets today's story and exam question automatically inside their dashboard.</p>
          <div style={{background:surf,borderRadius:8,padding:'7px 10px'}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:'0 0 3px'}}>📊 Engagement Today</p>
            <p style={{color:txt,fontSize:10,margin:0}}>287 of 340 students opened it · 194 answered correctly</p>
          </div>
        </div>
      ),
    },
    {
      title:'Study Halls - Batches That Run Themselves',
      desc:'Create a batch in seconds - name it, pick the exam focus, set a fee (or make it free), assign mentors, done. Students join with one tap. Every hall tracks its own attendance, fee collection, and mentor load automatically.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>YOUR ACTIVE HALLS</p>
          {[{n:'UPSC Morning Batch',s:240,f:'₹500/hall',m:2},{n:'SSC CGL Evening',s:180,f:'₹300/hall',m:1},{n:'Class 10 Science',s:35,f:'Free',m:1}].map((h,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:`1px solid ${bdr}`}}>
              <div style={{flex:1}}>
                <p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{h.n}</p>
                <p style={{color:muted,fontSize:8,margin:'1px 0 0'}}>{h.s} students · {h.m} mentor{h.m>1?'s':''}</p>
              </div>
              <span style={{background:`${accent}15`,color:accent,fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20,flexShrink:0}}>{h.f}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Homework - 4 Types, Auto-Graded Where It Matters',
      desc:'Post MCQs (auto-graded instantly), written answers (mentor reviews), file uploads (photo/PDF), or reading assignments. Assign to any hall, set a due date, watch submissions come in live.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>TODAY'S HOMEWORK</p>
          {[{t:'Polity Chapter 5 - 20 MCQs',s:'198/240 submitted',ty:'✅ MCQ · Auto-graded',c:'#4ADE80'},{t:'Write 200 words on Federalism',s:'45/240 submitted',ty:'✍️ Written · Mentor reviews',c:accent}].map((h,i)=>(
            <div key={i} style={{padding:'7px 0',borderBottom:`1px solid ${bdr}`}}>
              <p style={{color:txt,fontSize:10,fontWeight:700,margin:0}}>{h.t}</p>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:2}}>
                <span style={{color:h.c,fontSize:8,fontWeight:700}}>{h.ty}</span>
                <span style={{color:muted,fontSize:8}}>{h.s}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title:'Revenue Dashboard - Every Rupee, One Screen',
      desc:'See hall fee collections, subscription revenue, and payouts to mentors - all in one place. Know exactly what each batch earns, what is pending, and what is paid out, without a single spreadsheet.',
      preview:(
        <div style={{background:card,borderRadius:12,padding:12,border:`1px solid ${bdr}`}}>
          <p style={{color:muted,fontSize:9,fontWeight:700,margin:'0 0 8px',letterSpacing:'1px'}}>THIS MONTH</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:10}}>
            {[['₹84,200','Collected',accent],['₹12,000','Pending','#F59E0B'],['₹18,400','Mentor Payouts','#60A5FA']].map(([v,l,c])=>(
              <div key={l} style={{background:isDark?`${c}10`:surf,border:`1px solid ${c}20`,borderRadius:8,padding:'6px 5px',textAlign:'center'}}>
                <p style={{color:c,fontWeight:900,fontSize:12,margin:0}}>{v}</p>
                <p style={{color:muted,fontSize:7,margin:'1px 0 0'}}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{background:`${accent}10`,border:`1px solid ${accent}22`,borderRadius:9,padding:'7px 10px'}}>
            <p style={{color:accent,fontSize:9,fontWeight:700,margin:0}}>4 halls · Auto-reconciled · Export anytime</p>
          </div>
        </div>
      ),
    },
  ]

  const bg = isDark
    ? `radial-gradient(ellipse 60% 40% at 50% 50%,${primary}18,transparent),var(--color-bg,#0F172A)`
    : 'var(--color-surface,#F8FAFC)'

  return (
    <section id="institution" style={{padding:'80px clamp(16px,4vw,32px)',background:bg,scrollMarginTop:80,transition:'background 0.4s'}}>
      <div style={{maxWidth:1140,margin:'0 auto'}}>

        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:`${accent}12`,border:`1px solid ${accent}28`,borderRadius:20,padding:'5px 16px',marginBottom:14}}>
            <span style={{color:accent,fontSize:11,fontWeight:700,letterSpacing:'1px'}}>🏫 FOR INSTITUTIONS</span>
          </div>
          <h2 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:'clamp(22px,4vw,40px)',color:txt,margin:'0 0 10px'}}>
            End the Daily Grind. <span style={{color:accent}}>Start Teaching Smart.</span>
          </h2>
          <p style={{color:muted,fontSize:14,maxWidth:580,margin:'0 auto',lineHeight:1.7}}>
            No traffic. No manual test papers. No stressful weekends. Conduct daily classes and tests from home - with full student analytics. From ₹999 per year for unlimited students.
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
              Register Your Institution →
            </button>
          </div>
          <div style={{background:card,border:`1.5px solid ${accent}20`,borderRadius:18,padding:18,boxShadow:isDark?`0 8px 32px rgba(0,0,0,0.3)`:`0 4px 20px rgba(0,0,0,0.06)`}}>
            {CONTENT[tab].preview}
          </div>
        </div>

        {/* Comparison strip */}
        <div style={{marginTop:28,borderRadius:20,overflow:'hidden',border:`1px solid ${bdr}`,boxShadow:isDark?'0 8px 40px rgba(0,0,0,0.4)':'0 4px 24px rgba(0,0,0,0.08)'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1.2fr',background:isDark?primD:primary}}>
            {['','❌ Traditional Way','✅ TryIT Way'].map((h,i)=>(
              <div key={i} style={{padding:'10px 14px',borderLeft:i>0?'1px solid rgba(255,255,255,0.08)':undefined,background:i===1?'rgba(239,68,68,0.12)':i===2?`${accent}18`:'transparent'}}>
                <span style={{color:i===0?'rgba(255,255,255,0.35)':i===1?'#FCA5A5':accent,fontSize:11,fontWeight:800}}>{h}</span>
              </div>
            ))}
          </div>
          {[['⏰','Daily Time Lost','2-4 hrs commuting','0 mins travel'],['💸','Annual Cost','₹30K-₹3L per student','From ₹999/yr'],['📋','Test Conduction','Manual papers, Sundays','Auto-generated, anytime'],['📊','Analytics','Teacher guesses','Live per-student dashboard'],['🌙','Weekends','Exhausted, stressed','Home. Rested. Ready.'],['🌐','Languages','English / Hindi only','40+ Indian languages']].map(([icon,topic,old,nw],i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1.2fr',borderBottom:`1px solid ${bdr}`,background:isDark?(i%2===0?'rgba(255,255,255,0.015)':card):(i%2===0?'rgba(0,0,0,0.015)':card)}}>
              <div style={{padding:'10px 14px',display:'flex',alignItems:'center',gap:7}}><span style={{fontSize:15}}>{icon}</span><span style={{color:muted,fontSize:11,fontWeight:600}}>{topic}</span></div>
              <div style={{padding:'10px 14px',borderLeft:`1px solid ${bdr}`}}><span style={{color:'#F87171',fontSize:11,fontWeight:600}}>{old}</span></div>
              <div style={{padding:'10px 14px',borderLeft:`1px solid ${bdr}`}}><span style={{color:isDark?'#4ADE80':'#15803D',fontSize:11,fontWeight:700}}>{nw}</span></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
