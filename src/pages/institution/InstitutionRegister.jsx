// src/pages/institution/InstitutionRegister.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const TYPES = [
  {id:'school',      icon:'🏫', label:'School',          sub:'Classes 1-12'},
  {id:'college',     icon:'🎓', label:'College',          sub:'UG / PG / Research'},
  {id:'coaching',    icon:'📚', label:'Coaching Centre',  sub:'Competitive exams'},
  {id:'tuition',     icon:'🏠', label:'Tuition Centre',   sub:'Subject specialist'},
  {id:'online',      icon:'💻', label:'Online Only',      sub:'No physical location'},
  {id:'independent', icon:'👤', label:'Independent',      sub:'Solo teacher / trainer'},
]

const FEE_MODELS = [
  {id:'free',     icon:'🆓', label:'Free',         sub:'No app payment - collect offline'},
  {id:'per_hall', icon:'🏛️', label:'Per Hall Fee', sub:'Student pays per hall joined'},
  {id:'pass',     icon:'🎟️', label:'Institution Pass', sub:'One price - all halls access'},
]

const EXAMS = ['UPSC CSE','SSC CGL','TNPSC Group 1','IBPS PO','NEET UG','JEE Main',
  'RRB NTPC','State PSC','School Board','College Entrance','Other']

export default function InstitutionRegister() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name:'', type:'', city:'', state:'', pincode:'',
    specialization:[], feeModel:'free', passPrice:'',
    ownerName:'', ownerPhone:'', description:'',
  })
  const [submitting, setSubmitting] = useState(false)

  const update = (key, val) => setForm(prev => ({...prev, [key]:val}))
  const toggleSpec = (exam) => {
    setForm(prev => ({...prev,
      specialization: prev.specialization.includes(exam)
        ? prev.specialization.filter(e=>e!==exam)
        : [...prev.specialization, exam]
    }))
  }

  const canNext1 = form.name.trim() && form.type && form.city && form.state
  const canNext2 = form.specialization.length > 0 && form.feeModel
  const canSubmit = form.ownerName.trim() && form.ownerPhone.trim()

  const submit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    nav('/institution')
  }

  const inp = {
    width:'100%', padding:'11px 14px', borderRadius:12,
    border:'1.5px solid '+b, background:bg, color:t,
    fontSize:14, outline:'none', fontFamily:'Poppins,sans-serif',
    boxSizing:'border-box',
  }

  const STEPS = ['Basic Info','Specialization & Fees','Owner Details']

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,'+p+','+p+'dd)',
        padding:'20px'}}>
        <div style={{maxWidth:560,margin:'0 auto'}}>
          <button onClick={()=>nav('/role-select')} style={{background:'rgba(255,255,255,0.15)',
            border:'1px solid rgba(255,255,255,0.2)',borderRadius:10,
            padding:'6px 14px',color:'#fff',fontSize:13,cursor:'pointer',
            marginBottom:16}}>
            ← Back
          </button>
          <h1 style={{color:'#fff',fontWeight:800,fontSize:22,margin:'0 0 4px'}}>
            🏫 Register Your Institution
          </h1>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:13,margin:'0 0 20px'}}>
            School · College · Coaching · Tuition · Online - anyone can start
          </p>

          {/* Step indicator */}
          <div style={{display:'flex',gap:0}}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{flex:1,display:'flex',alignItems:'center'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                  <div style={{width:28,height:28,borderRadius:'50%',
                    background:step>i+1?'#22C55E':step===i+1?a:'rgba(255,255,255,0.2)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontWeight:700,fontSize:12,color:step>=i+1?p:'rgba(255,255,255,0.5)',
                    marginBottom:4,transition:'all 0.3s'}}>
                    {step>i+1?'✓':i+1}
                  </div>
                  <p style={{color:step>=i+1?'#fff':'rgba(255,255,255,0.4)',
                    fontSize:9,fontWeight:600,margin:0,textAlign:'center'}}>
                    {s}
                  </p>
                </div>
                {i < STEPS.length-1 && (
                  <div style={{height:2,width:32,
                    background:step>i+1?'#22C55E':'rgba(255,255,255,0.2)',
                    marginBottom:16,transition:'background 0.3s'}}/>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:'24px 20px',maxWidth:560,margin:'0 auto'}}>

        {/* STEP 1 */}
        {step===1 && (
          <div>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 16px'}}>
              What kind of institution?
            </p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
              {TYPES.map(type=>(
                <button key={type.id} onClick={()=>update('type',type.id)}
                  style={{background:form.type===type.id?p+'08':c,
                    border:'2px solid '+(form.type===type.id?p:b),
                    borderRadius:16,padding:'14px',cursor:'pointer',
                    textAlign:'left',transition:'all 0.2s'}}>
                  <div style={{fontSize:24,marginBottom:6}}>{type.icon}</div>
                  <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 2px'}}>
                    {type.label}
                  </p>
                  <p style={{color:m,fontSize:10,margin:0}}>{type.sub}</p>
                </button>
              ))}
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,fontSize:12,marginBottom:6}}>
                  Institution Name *
                </label>
                <input value={form.name} onChange={e=>update('name',e.target.value)}
                  placeholder="e.g. Sri Vidya Academy, Kavi Coaching Centre"
                  style={inp}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div>
                  <label style={{display:'block',color:t,fontWeight:700,
                    fontSize:12,marginBottom:6}}>City *</label>
                  <input value={form.city} onChange={e=>update('city',e.target.value)}
                    placeholder="City" style={inp}/>
                </div>
                <div>
                  <label style={{display:'block',color:t,fontWeight:700,
                    fontSize:12,marginBottom:6}}>State *</label>
                  <input value={form.state} onChange={e=>update('state',e.target.value)}
                    placeholder="State" style={inp}/>
                </div>
              </div>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,fontSize:12,marginBottom:6}}>
                  About (optional)
                </label>
                <textarea value={form.description}
                  onChange={e=>update('description',e.target.value)}
                  placeholder="Brief description of your institution..."
                  rows={3}
                  style={{...inp,resize:'vertical',lineHeight:1.6}}/>
              </div>
            </div>

            <button onClick={()=>setStep(2)} disabled={!canNext1}
              style={{width:'100%',
                background:canNext1?'linear-gradient(135deg,'+p+','+a+')':b,
                border:'none',borderRadius:14,padding:'14px',
                color:canNext1?'#fff':m,fontWeight:800,fontSize:14,cursor:'pointer'}}>
              Next - Specialization →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <div>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 6px'}}>
              What do you specialize in?
            </p>
            <p style={{color:m,fontSize:11,margin:'0 0 14px'}}>
              Select all that apply
            </p>
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:20}}>
              {EXAMS.map(exam=>(
                <button key={exam} onClick={()=>toggleSpec(exam)}
                  style={{padding:'8px 16px',borderRadius:20,border:'2px solid',
                    cursor:'pointer',fontSize:12,fontWeight:700,
                    borderColor:form.specialization.includes(exam)?a:b,
                    background:form.specialization.includes(exam)?a+'15':bg,
                    color:form.specialization.includes(exam)?a:m,
                    transition:'all 0.15s'}}>
                  {exam}
                </button>
              ))}
            </div>

            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 6px'}}>
              How will students pay?
            </p>
            <p style={{color:m,fontSize:11,margin:'0 0 12px'}}>
              You decide - you can change this anytime
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
              {FEE_MODELS.map(model=>(
                <button key={model.id} onClick={()=>update('feeModel',model.id)}
                  style={{background:form.feeModel===model.id?p+'08':c,
                    border:'2px solid '+(form.feeModel===model.id?p:b),
                    borderRadius:14,padding:'14px 16px',cursor:'pointer',
                    textAlign:'left',display:'flex',alignItems:'center',
                    gap:12,transition:'all 0.2s'}}>
                  <span style={{fontSize:24}}>{model.icon}</span>
                  <div style={{flex:1}}>
                    <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 2px'}}>
                      {model.label}
                    </p>
                    <p style={{color:m,fontSize:11,margin:0}}>{model.sub}</p>
                  </div>
                  <div style={{width:20,height:20,borderRadius:'50%',
                    border:'2px solid '+(form.feeModel===model.id?p:b),
                    background:form.feeModel===model.id?p:'transparent',
                    flexShrink:0}}/>
                </button>
              ))}
            </div>

            {form.feeModel==='pass' && (
              <div style={{marginBottom:20}}>
                <label style={{display:'block',color:t,fontWeight:700,
                  fontSize:12,marginBottom:6}}>
                  Institution Pass Price (₹/month)
                </label>
                <input value={form.passPrice} type="number"
                  onChange={e=>update('passPrice',e.target.value)}
                  placeholder="e.g. 499"
                  style={inp}/>
              </div>
            )}

            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setStep(1)}
                style={{flex:1,background:'transparent',border:'1px solid '+b,
                  borderRadius:14,padding:'13px',color:m,
                  fontWeight:700,fontSize:13,cursor:'pointer'}}>
                ← Back
              </button>
              <button onClick={()=>setStep(3)} disabled={!canNext2}
                style={{flex:2,
                  background:canNext2?'linear-gradient(135deg,'+p+','+a+')':b,
                  border:'none',borderRadius:14,padding:'13px',
                  color:canNext2?'#fff':m,fontWeight:800,fontSize:13,cursor:'pointer'}}>
                Next - Owner Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <div>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 16px'}}>
              Owner / Admin Contact
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,
                  fontSize:12,marginBottom:6}}>Your Name *</label>
                <input value={form.ownerName}
                  onChange={e=>update('ownerName',e.target.value)}
                  placeholder="Full name" style={inp}/>
              </div>
              <div>
                <label style={{display:'block',color:t,fontWeight:700,
                  fontSize:12,marginBottom:6}}>Phone Number *</label>
                <input value={form.ownerPhone}
                  onChange={e=>update('ownerPhone',e.target.value)}
                  placeholder="10-digit mobile number" style={inp}/>
              </div>
            </div>

            {/* Summary */}
            <div style={{background:p+'08',border:'1px solid '+p+'20',
              borderRadius:14,padding:'16px',marginBottom:20}}>
              <p style={{color:p,fontWeight:700,fontSize:13,margin:'0 0 10px'}}>
                📋 Registration Summary
              </p>
              {[
                {l:'Institution', v:form.name},
                {l:'Type', v:TYPES.find(x=>x.id===form.type)?.label||''},
                {l:'Location', v:form.city+', '+form.state},
                {l:'Specialization', v:form.specialization.join(', ')||'None'},
                {l:'Fee Model', v:FEE_MODELS.find(x=>x.id===form.feeModel)?.label||''},
              ].map((row,i)=>(
                <div key={i} style={{display:'flex',gap:8,marginBottom:6}}>
                  <span style={{color:m,fontSize:12,minWidth:100}}>{row.l}:</span>
                  <span style={{color:t,fontSize:12,fontWeight:600,flex:1}}>
                    {row.v||'-'}
                  </span>
                </div>
              ))}
            </div>

            <div style={{background:a+'10',border:'1px solid '+a+'25',
              borderRadius:12,padding:'12px 14px',marginBottom:16}}>
              <p style={{color:a,fontWeight:700,fontSize:11,margin:'0 0 4px'}}>
                📋 IP & Content Agreement
              </p>
              <p style={{color:m,fontSize:11,margin:0,lineHeight:1.6}}>
                All question papers and materials uploaded to TryIT are assigned
                to TryIT Educations permanently and may be used in platform
                content. TryIT earns 15% of all in-app payments made to
                this institution.
              </p>
            </div>

            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setStep(2)}
                style={{flex:1,background:'transparent',border:'1px solid '+b,
                  borderRadius:14,padding:'13px',color:m,
                  fontWeight:700,fontSize:13,cursor:'pointer'}}>
                ← Back
              </button>
              <button onClick={submit} disabled={!canSubmit||submitting}
                style={{flex:2,
                  background:canSubmit?'linear-gradient(135deg,'+p+','+a+')':b,
                  border:'none',borderRadius:14,padding:'13px',
                  color:canSubmit?'#fff':m,fontWeight:800,fontSize:13,
                  cursor:'pointer',opacity:submitting?0.7:1}}>
                {submitting?'Registering...':'🏫 Register Institution'}
              </button>
            </div>
          </div>
        )}
        <div style={{height:40}}/>
      </div>
    </div>
  )
}
