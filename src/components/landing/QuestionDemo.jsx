// src/components/landing/QuestionDemo.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Q, getLayers, ALL_LANGS, LANG_SCRIPTS } from '../../lib/questionData'

const FULL_LANG_LABELS = {
  Tamil: 'Tamil — தமிழ் ✔ Cultural tone',
  Hindi: 'Hindi — हिंदी ✔ Cultural tone',
  Telugu: 'Telugu — తెలుగు ✔ Cultural tone',
  Kannada: 'Kannada — ಕನ್ನಡ ✔ 7 layers',
  Malayalam: 'Malayalam — മലയാളം ✔ 7 layers',
  Bengali: 'Bengali — বাংলা ✔ 7 layers',
  Marathi: 'Marathi — मराठी ✔ 7 layers',
  Gujarati: 'Gujarati — ગુजराती ✔ 7 layers',
  Punjabi: 'Punjabi — ਪੰਜਾਬੀ ✔ 7 layers',
  Odia: 'Odia — ଓଡ़िआ ✔ 7 layers',
  Assamese: 'Assamese — অসমীয়া ✔ 7 layers',
}
const NE_LANGS = ['Manipuri','Nagamese','Mizo','Khasi','Kokborok','Angami','Ao']

export default function QuestionDemo() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark  = theme?.isDark ?? false
  const accent  = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primary = theme?.primary ?? '#1E3A5F'
  const primD   = theme?.primaryDark ?? '#0F2140'

  const [qAns, setQAns]  = useState(null)
  const [lang, setLang]  = useState('English')
  const [step, setStep]  = useState(0)
  const [reg,  setReg]   = useState({name:'',email:'',phone:''})
  const [exam, setExam]  = useState({exam:'',body:'',state:'',elang:''})

  const layers  = getLayers(lang)
  const hasFull = !!(FULL_LANG_LABELS[lang])

  const txt  = isDark ? '#ffffff' : 'var(--color-text,#0F1020)'
  const muted= isDark ? 'rgba(255,255,255,0.5)' : 'var(--color-text-light,#64748B)'
  const card = isDark ? 'rgba(255,255,255,0.04)' : 'var(--color-surface,#ffffff)'
  const bdr  = isDark ? 'rgba(255,255,255,0.08)' : 'var(--color-border,#E2E8F0)'
  const surf = isDark ? 'rgba(255,255,255,0.03)' : 'var(--color-bg,#F8FAFC)'
  const bg   = isDark
    ? `radial-gradient(ellipse 60% 40% at 50% 50%,${primary}22,transparent),var(--color-bg,#0F172A)`
    : 'var(--color-bg,#F8FAFC)'

  return (
    <section style={{padding:'72px clamp(16px,4vw,32px)',background:bg,transition:'background 0.4s'}}>
      <div style={{maxWidth:1140,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:36}}>
          <span style={{background:'#EDE9FE',color:'#7C3AED',fontSize:11,fontWeight:700,
            padding:'4px 14px',borderRadius:20,letterSpacing:'1px'}}>LIVE PREVIEW — NO LOGIN NEEDED</span>
          <h2 style={{fontFamily:'Poppins,sans-serif',fontWeight:900,
            fontSize:'clamp(22px,4vw,40px)',color:txt,margin:'12px 0 6px'}}>
            ⚡ Try a Real Question — See How TryIT Teaches
          </h2>
          <p style={{color:muted,fontSize:14}}>
            Answer it — 7 explanation layers unlock in your language with respectful cultural tone
          </p>
        </div>

        <div style={{display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,480px),1fr))',
          gap:24,alignItems:'start'}}>

          {/* ── Question card ── */}
          <div style={{background:card,border:`1.5px solid ${accent}30`,borderRadius:20,
            overflow:'hidden',boxShadow:isDark?`0 8px 40px rgba(0,0,0,0.4)`:`0 4px 24px rgba(0,0,0,0.08)`}}>

            <div style={{background:isDark?primD:primary,padding:'10px 16px',
              display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:6}}>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {['Constitution','GK / GA','High Difficulty'].map(t=>(
                  <span key={t} style={{background:`${accent}22`,color:accent,
                    fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:20}}>{t}</span>
                ))}
              </div>
              <span style={{color:'rgba(255,255,255,0.4)',fontSize:9}}>{Q.exams}</span>
            </div>

            <div style={{padding:'18px 16px',maxHeight:'78vh',overflowY:'auto'}}>
              <p style={{color:txt,fontWeight:700,fontSize:14,lineHeight:1.6,
                marginBottom:14,fontFamily:'Poppins,sans-serif'}}>{Q.text}</p>

              <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:14}}>
                {Q.opts.map((opt,i)=>{
                  const isOk  = qAns!==null && i===Q.correct
                  const isBad = qAns===i && i!==Q.correct
                  const isSel = qAns===i
                  return (
                    <button key={i} onClick={()=>{ if(qAns===null) setQAns(i) }}
                      style={{display:'flex',alignItems:'center',gap:10,padding:'10px 13px',
                        borderRadius:12,cursor:qAns===null?'pointer':'default',
                        border:`2px solid ${isOk?'#4ADE80':isBad?'#F87171':isSel?accent:bdr}`,
                        background:isOk?'rgba(74,222,128,0.1)':isBad?'rgba(248,113,113,0.08)':'transparent',
                        textAlign:'left',width:'100%',transition:'all 0.2s'}}>
                      <div style={{width:26,height:26,borderRadius:'50%',flexShrink:0,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        background:isOk?'#4ADE80':isBad?'#F87171':isSel?accent:bdr,
                        color:isOk||isBad||isSel?'#fff':muted,fontWeight:800,fontSize:11}}>
                        {isOk?'✓':isBad?'✗':['A','B','C','D'][i]}
                      </div>
                      <span style={{fontSize:13,fontWeight:isSel||isOk?700:400,
                        color:isOk?'#4ADE80':isBad?'#F87171':isSel?accent:muted}}>{opt}</span>
                    </button>
                  )
                })}
              </div>

              {qAns===null && (
                <div style={{background:isDark?`${accent}08`:surf,
                  border:`1px solid ${accent}20`,borderRadius:12,padding:'10px 14px',textAlign:'center'}}>
                  <p style={{color:muted,fontSize:11,margin:0}}>
                    ☝️ Choose your answer — 7 layers unlock in{' '}
                    <strong style={{color:accent}}>{lang}</strong> with respectful cultural tone
                  </p>
                </div>
              )}

              {qAns!==null && (
                <div>
                  {/* Language selector */}
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,
                    padding:'8px 10px',background:isDark?'rgba(255,255,255,0.04)':surf,
                    borderRadius:12,border:`1px solid ${bdr}`}}>
                    <div style={{display:'flex',flexDirection:'column',width:18,height:12,
                      borderRadius:1,overflow:'hidden',flexShrink:0,border:'1px solid rgba(0,0,0,0.14)'}}>
                      <div style={{flex:1,background:'#FF9933'}}/>
                      <div style={{flex:1,background:'#fff'}}/>
                      <div style={{flex:1,background:'#138808'}}/>
                    </div>
                    <span style={{color:muted,fontSize:10,fontWeight:600,flexShrink:0}}>Read in:</span>
                    <select value={lang} onChange={e=>setLang(e.target.value)}
                      style={{background:isDark?'#1a1a2e':'#fff',
                        border:`1px solid ${accent}40`,borderRadius:8,padding:'4px 8px',
                        color:isDark?'#ffffff':txt,fontSize:11,fontWeight:700,cursor:'pointer',flex:1}}>
                      <option value="English">English (7 layers)</option>
                      <option disabled>─── Full cultural tone (Anna/Akka style) ───</option>
                      {Object.entries(FULL_LANG_LABELS).map(([l,label])=>(
                        <option key={l} value={l}>{label}</option>
                      ))}
                      <option disabled>─── Northeast India ───</option>
                      {NE_LANGS.map(l=><option key={l} value={l}>{l}</option>)}
                      <option disabled>─── All Other Languages ───</option>
                      {ALL_LANGS.filter(l=>
                        !Object.keys(FULL_LANG_LABELS).includes(l) &&
                        !NE_LANGS.includes(l)
                      ).map(l=>(
                        <option key={l} value={l}>
                          {l}{LANG_SCRIPTS[l] ? ' — '+LANG_SCRIPTS[l] : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Note for partial translations */}
                  {!hasFull && lang!=='English' && (
                    <div style={{background:isDark?`${accent}08`:surf,
                      border:`1px solid ${accent}20`,borderRadius:10,
                      padding:'7px 12px',marginBottom:10}}>
                      <p style={{color:accent,fontSize:10,margin:0}}>
                        ℹ️ Layer 1 shown in {lang} with respectful address.
                        Full cultural translation expanding weekly!
                      </p>
                    </div>
                  )}

                  {/* 7 layers */}
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {layers.map((layer,i)=>(
                      <div key={i} style={{background:isDark?'rgba(255,255,255,0.07)':surf,
                        border:`1px solid ${layer.c}25`,borderRadius:14,
                        padding:'13px 14px',borderLeft:`4px solid ${layer.c}`}}>
                        <p style={{color:layer.c,fontSize:11,fontWeight:800,
                          margin:'0 0 7px',fontFamily:'Poppins,sans-serif'}}>{layer.t}</p>
                        <p style={{color:isDark?'rgba(255,255,255,0.92)':`${txt}`,fontSize:12,lineHeight:1.8,margin:0}}>{layer.content}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{marginTop:14,display:'flex',justifyContent:'space-between',
                    alignItems:'center',flexWrap:'wrap',gap:8}}>
                    <button onClick={()=>setQAns(null)}
                      style={{background:`linear-gradient(135deg,${accent},${accentL})`,
                        border:'none',borderRadius:10,padding:'8px 18px',
                        color:primD,fontWeight:700,fontSize:12,cursor:'pointer'}}>
                      Try Another Question →
                    </button>
                    <p style={{color:muted,fontSize:10,margin:0}}>
                      7 layers · 42 languages · Works on 2G
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Exam Drop form ── */}
          <div style={{background:isDark
            ?`linear-gradient(135deg,${primary}50,${primD}70)`
            :`linear-gradient(135deg,${accent}14,${accent}06)`,
            border:`2.5px solid ${accent}`,borderRadius:20,padding:22,
            boxShadow:isDark?`0 0 30px ${accent}22`:`0 4px 20px ${accent}18`}}>

            {step===0 && (
              <div>
                <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:14}}>
                  <div style={{width:44,height:44,borderRadius:'50%',
                    background:`linear-gradient(135deg,${accent},${accentL})`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:22,flexShrink:0}}>🔔</div>
                  <div>
                    <p style={{color:isDark?'#fff':primD,fontWeight:900,fontSize:16,
                      fontFamily:'Poppins,sans-serif',margin:'0 0 4px'}}>
                      Your exam isn’t on any platform yet?
                    </p>
                    <p style={{color:accent,fontSize:12,fontWeight:700,margin:0}}>
                      We’ll build the complete test series — within 48 hours.
                    </p>
                  </div>
                </div>
                <p style={{color:isDark?'rgba(255,255,255,0.7)':muted,
                  fontSize:13,margin:'0 0 12px',lineHeight:1.7}}>
                  Any exam. Any state. Any language. From Class 1 scholarships to PhD entrance.
                  If it exists and has no platform,{' '}
                  <strong style={{color:accent}}>we’ll build the full test series for free.</strong>
                </p>
                <div style={{background:isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.05)',
                  borderRadius:12,padding:'9px 14px',marginBottom:14,display:'flex',gap:16,flexWrap:'wrap'}}>
                  <p style={{color:isDark?'rgba(255,255,255,0.65)':muted,fontSize:11,margin:0}}>
                    📧 <strong style={{color:accent}}>tryiteducations@gmail.com</strong>
                  </p>
                  <p style={{color:isDark?'rgba(255,255,255,0.65)':muted,fontSize:11,margin:0}}>
                    📞 <strong style={{color:accent}}>+91 98765 43210</strong>
                  </p>
                </div>
                <button onClick={()=>setStep(1)}
                  style={{width:'100%',background:`linear-gradient(135deg,${accent},${accentL})`,
                    border:'none',borderRadius:14,padding:'14px',color:primD,
                    fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:`0 6px 20px ${accent}44`}}>
                  Register &amp; Request Your Exam — Built in 48 Hours →
                </button>
              </div>
            )}

            {step===1 && (
              <div>
                <p style={{color:isDark?'#fff':primD,fontWeight:900,fontSize:14,
                  fontFamily:'Poppins,sans-serif',margin:'0 0 4px'}}>Step 1 of 2 — Quick Registration</p>
                <p style={{color:muted,fontSize:11,margin:'0 0 14px'}}>
                  We’ll notify you the moment your exam goes live on TryIT.
                </p>
                {[['Full Name *','Your name','name','text'],
                  ['Email Address *','your@email.com','email','email'],
                  ['WhatsApp / Phone *','+91 98765 43210','phone','tel']].map(([label,ph,key,type])=>(
                  <div key={key} style={{marginBottom:10}}>
                    <p style={{color:muted,fontSize:10,fontWeight:600,margin:'0 0 5px'}}>{label}</p>
                    <input type={type} value={reg[key]}
                      onChange={e=>setReg(p=>({...p,[key]:e.target.value}))}
                      placeholder={ph}
                      style={{width:'100%',padding:'10px 12px',borderRadius:10,
                        border:`1px solid ${accent}40`,
                        background:isDark?'rgba(255,255,255,0.07)':'#fff',
                        color:txt,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
                  </div>
                ))}
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>setStep(0)}
                    style={{flex:1,background:'transparent',border:`1px solid ${bdr}`,
                      borderRadius:10,padding:'10px',color:muted,fontSize:12,cursor:'pointer'}}>
                    ← Back
                  </button>
                  <button onClick={()=>{if(reg.name&&reg.email&&reg.phone)setStep(2)}}
                    style={{flex:2,background:`linear-gradient(135deg,${accent},${accentL})`,
                      border:'none',borderRadius:10,padding:'10px',color:primD,
                      fontWeight:800,fontSize:12,cursor:'pointer'}}>
                    Next — Tell Us Your Exam →
                  </button>
                </div>
              </div>
            )}

            {step===2 && (
              <div>
                <p style={{color:isDark?'#fff':primD,fontWeight:900,fontSize:14,
                  fontFamily:'Poppins,sans-serif',margin:'0 0 4px'}}>Step 2 of 2 — Your Exam Details</p>
                <p style={{color:muted,fontSize:11,margin:'0 0 14px'}}>
                  Hello {reg.name}! We’ll build your test series within 48 hours.
                </p>
                {[['Exam Name *','e.g. TNPSC Group 2A, Bihar STET, Mizo PSC...','exam'],
                  ['Conducting Body *','e.g. TNPSC, BPSC, Mizoram PSC...','body'],
                  ['State / Region *','e.g. Tamil Nadu, Bihar, Mizoram, Nagaland...','state'],
                  ['Language Needed *','e.g. Tamil, Mizo, Maithili, Nagamese...','elang']].map(([label,ph,key])=>(
                  <div key={key} style={{marginBottom:10}}>
                    <p style={{color:muted,fontSize:10,fontWeight:600,margin:'0 0 5px'}}>{label}</p>
                    <input value={exam[key]}
                      onChange={e=>setExam(p=>({...p,[key]:e.target.value}))}
                      placeholder={ph}
                      style={{width:'100%',padding:'10px 12px',borderRadius:10,
                        border:`1px solid ${accent}40`,
                        background:isDark?'rgba(255,255,255,0.07)':'#fff',
                        color:txt,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
                  </div>
                ))}
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>setStep(1)}
                    style={{flex:1,background:'transparent',border:`1px solid ${bdr}`,
                      borderRadius:10,padding:'10px',color:muted,fontSize:12,cursor:'pointer'}}>
                    ← Back
                  </button>
                  <button onClick={()=>setStep(3)}
                    style={{flex:2,background:`linear-gradient(135deg,${accent},${accentL})`,
                      border:'none',borderRadius:10,padding:'10px',color:primD,
                      fontWeight:800,fontSize:12,cursor:'pointer'}}>
                    Submit — Built in 48 Hours
                  </button>
                </div>
              </div>
            )}

            {step===3 && (
              <div style={{textAlign:'center',padding:'8px 0'}}>
                <div style={{fontSize:40,marginBottom:10}}>🎉</div>
                <p style={{color:isDark?'#fff':primD,fontWeight:900,fontSize:15,
                  fontFamily:'Poppins,sans-serif',margin:'0 0 6px'}}>
                  Received, {reg.name}!
                </p>
                <p style={{color:muted,fontSize:12,lineHeight:1.7,margin:'0 0 12px'}}>
                  We’ll build{' '}
                  <strong style={{color:accent}}>{exam.exam||'your exam'}</strong>{' '}
                  within 48 hours and notify you at{' '}
                  <strong style={{color:accent}}>{reg.email}</strong>.
                </p>
                <button
                  onClick={()=>{
                    setStep(0)
                    setReg({name:'',email:'',phone:''})
                    setExam({exam:'',body:'',state:'',elang:''})
                  }}
                  style={{background:'transparent',border:`1px solid ${bdr}`,
                    borderRadius:10,padding:'7px 14px',color:muted,fontSize:11,cursor:'pointer'}}>
                  Submit Another Exam →
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}
