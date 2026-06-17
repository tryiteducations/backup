// FILE: src/components/PathwayEnrollModal.jsx
// Smart Pathway Enrollment
// If student joins JEE 7yr pathway in Class 9 → starts at Stage 4, not Stage 1
// Shows catch-up assessment option for skipped stages
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'

// ── CLASS → STAGE MAPPING for each pathway ───────────────────────────────
const CLASS_TO_STAGE = {
  // JEE 7-Year: Class 6=Stage1, 7=Stage2... 12=Stage7
  jee_7yr: {
    'class_6':  { stage:1, message:"You're starting at the right age! Full 7-year journey ahead." },
    'class_7':  { stage:2, message:"Start at Class 7 stage. Stage 1 available as optional catch-up." },
    'class_8':  { stage:3, message:"Start at Class 8. 5 stages remaining — still very doable!" },
    'class_9':  { stage:4, message:"Start at Class 9 Foundation. 4 stages to IIT. You've got this!" },
    'class_10': { stage:5, message:"Start at Class 10 Core stage. 3 stages to JEE." },
    'class_11': { stage:6, message:"Class 11 direct entry. Intense but very achievable!" },
    'class_12': { stage:7, message:"Final year! Switch to JEE 2-Year Fast Track instead?", suggestPathway:'jee_2yr' },
    'graduation':{ stage:7, message:"Consider JEE one more attempt or explore other pathways.", suggestPathway:'gate_2yr' },
  },
  // NEET 7-Year: same structure
  neet_7yr: {
    'class_6':  { stage:1, message:"Perfect start! 7 full years to MBBS." },
    'class_7':  { stage:2, message:"Great start. Stage 1 available as catch-up." },
    'class_8':  { stage:3, message:"Start at Pre-NEET stage. 5 years to MBBS." },
    'class_9':  { stage:4, message:"NEET Foundation stage. 4 years to MBBS." },
    'class_10': { stage:5, message:"Class 10 entry. 3 stages to NEET." },
    'class_11': { stage:6, message:"Direct Class 11 entry. Intense NEET prep!" },
    'class_12': { stage:7, message:"Final year NEET! Focus on 25 full mocks.", suggestPathway:'neet_7yr' },
    'graduation':{ stage:7, message:"Consider NEET PG after MBBS.", suggestPathway:'neet_pg_1yr' },
  },
  // UPSC 8-Year
  upsc_8yr: {
    'class_8':  { stage:1, message:"Excellent start for UPSC! Full 8-year journey." },
    'class_10': { stage:2, message:"Pre-foundation stage — building NCERT mastery." },
    'class_11': { stage:2, message:"Start at Pre-Foundation. Strong base for UPSC." },
    'class_12': { stage:2, message:"Start at Pre-Foundation. Good time to begin!" },
    'graduation':{ stage:3, message:"Graduation entry — GS Fundamentals stage." },
    'graduation_2':{ stage:4, message:"2nd year Graduation. Optional + GS Depth stage." },
    'post_grad': { stage:5, message:"Post-grad entry. Full integration phase." },
  },
  // Banking 2-Year
  banking_2yr: {
    'graduation':    { stage:1, message:"Graduation entry — standard banking prep path." },
    'post_grad':     { stage:1, message:"Great time to start banking prep!" },
    'working_prof':  { stage:2, message:"Working professional? Start at mock phase directly." },
  },
  // SSC 2-Year
  ssc_2yr: {
    'graduation':    { stage:1, message:"Standard SSC CGL prep path." },
    'post_grad':     { stage:1, message:"Start SSC preparation now." },
    'class_12':      { stage:1, message:"12th pass entry — start building foundation." },
    'working_prof':  { stage:2, message:"Already know basics? Start at mock phase." },
  },
  // CA 6-Year
  ca_6yr: {
    'class_10':      { stage:1, message:"Perfect start for CA! 6-year journey begins." },
    'class_11':      { stage:1, message:"Good time to start CA Foundation prep." },
    'class_12':      { stage:2, message:"Direct CA Foundation entry." },
    'graduation':    { stage:3, message:"Graduation entry — CA Intermediate Group 1." },
  },
}

// Class levels shown to user
const CLASS_OPTIONS = [
  { value:'class_6',      label:'Class 6'                         },
  { value:'class_7',      label:'Class 7'                         },
  { value:'class_8',      label:'Class 8'                         },
  { value:'class_9',      label:'Class 9'                         },
  { value:'class_10',     label:'Class 10 / 10th Pass'            },
  { value:'class_11',     label:'Class 11'                        },
  { value:'class_12',     label:'Class 12 / 12th Pass'            },
  { value:'graduation',   label:'Graduation (1st/2nd Year)'       },
  { value:'graduation_2', label:'Graduation (3rd Year / Final)'   },
  { value:'post_grad',    label:'Post-Graduation / Working'       },
  { value:'working_prof', label:'Working Professional'            },
]

export default function PathwayEnrollModal({ pathway, onClose, onEnrolled }) {
  const navigate          = useNavigate()
  const { user, addCoins }= useAuth()

  const [step,          setStep]          = useState(1) // 1=select class, 2=confirm stage, 3=done
  const [currentClass,  setCurrentClass]  = useState('')
  const [targetStage,   setTargetStage]   = useState(null)
  const [catchUpChoice, setCatchUpChoice] = useState('skip') // 'skip' | 'review'
  const [enrolling,     setEnrolling]     = useState(false)

  const mapping    = CLASS_TO_STAGE[pathway?.pathway_id] || {}
  const stageInfo  = mapping[currentClass]
  const stages     = pathway?.stages || []

  const handleClassSelect = (cls) => {
    setCurrentClass(cls)
    const info = mapping[cls] || { stage:1, message:'Starting from Stage 1.' }
    setTargetStage(info)
    setStep(2)
  }

  const handleEnroll = async () => {
    if (!targetStage) return
    setEnrolling(true)

    // Build progress object
    const progress = {}
    stages.forEach((s, i) => {
      const stageNum = s.stage_number
      if (stageNum < targetStage.stage) {
        progress[stageNum] = {
          status: catchUpChoice === 'review' ? 'active' : 'skipped_catchup_available',
          score: 0,
          skipped: true,
          enrolledAt: new Date().toISOString(),
        }
      } else if (stageNum === targetStage.stage) {
        progress[stageNum] = {
          status: 'active',
          score: 0,
          enrolledAt: new Date().toISOString(),
        }
      } else {
        progress[stageNum] = { status:'locked', score:0 }
      }
    })

    // Save to localStorage
    const key = `tryit_pathway_progress_${user?.id}_${pathway.pathway_id}`
    localStorage.setItem(key, JSON.stringify(progress))

    // Save to Supabase
    try {
      await supabase.from('user_prep_enrollment').upsert({
        user_id:           user?.id,
        pathway_id:        pathway.pathway_id,
        current_stage_num: targetStage.stage,
        current_class:     currentClass,
        enrolled_at:       new Date().toISOString(),
        is_active:         true,
      }, { onConflict:'user_id,pathway_id' })
    } catch {}

    // Bonus coins for enrolling
    addCoins(100)
    setEnrolling(false)
    setStep(3)
  }

  const skippedStages = stages.filter(s => s.stage_number < (targetStage?.stage || 1))
  const activeStage   = stages.find(s => s.stage_number === targetStage?.stage)

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)',
      display:'flex', alignItems:'flex-end', justifyContent:'center',
      zIndex:1000, padding:'0 0 0 0' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:460,
        maxHeight:'90vh', overflowY:'auto', padding:24 }}>

        {/* ── STEP 1: SELECT CURRENT CLASS ─────────────────────────────── */}
        {step === 1 && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <div>
                <p style={{ fontSize:11, color:'#94A3B8', marginBottom:2 }}>Enrolling in</p>
                <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:16, margin:0 }}>
                  {pathway?.icon_emoji} {pathway?.pathway_name}
                </h3>
              </div>
              <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#94A3B8' }}>×</button>
            </div>

            <div style={{ background:'#FFF7E6', border:'1px solid #FDE68A', borderRadius:12, padding:12, marginBottom:16 }}>
              <p style={{ fontSize:13, color:'#92400E', margin:0, lineHeight:1.6 }}>
                📍 Tell us what class/year you're in — we'll start you at the <strong>right stage</strong>, not from the beginning.
              </p>
            </div>

            <p style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:10 }}>
              What is your current class / year?
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {CLASS_OPTIONS.map(opt => {
                const hasMapping = !!mapping[opt.value]
                return (
                  <button key={opt.value}
                    onClick={() => hasMapping && handleClassSelect(opt.value)}
                    style={{ padding:'12px 16px', borderRadius:12, border:'1.5px solid',
                      borderColor: hasMapping ? '#E2E8F0' : '#F1F5F9',
                      background: hasMapping ? '#fff' : '#F8FAFC',
                      cursor: hasMapping ? 'pointer' : 'not-allowed',
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                      opacity: hasMapping ? 1 : 0.45 }}
                    onMouseEnter={e => hasMapping && (e.currentTarget.style.borderColor=GOLD)}
                    onMouseLeave={e => hasMapping && (e.currentTarget.style.borderColor='#E2E8F0')}>
                    <span style={{ fontSize:13, fontWeight:600, color: hasMapping?'#1E293B':'#94A3B8' }}>
                      {opt.label}
                    </span>
                    {hasMapping ? (
                      <span style={{ fontSize:11, color:'#059669', fontWeight:600 }}>
                        → Stage {mapping[opt.value].stage}
                      </span>
                    ) : (
                      <span style={{ fontSize:10, color:'#94A3B8' }}>Not applicable</span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* ── STEP 2: CONFIRM STAGE + CATCH-UP ────────────────────────── */}
        {step === 2 && targetStage && (
          <>
            <button onClick={() => setStep(1)}
              style={{ background:'none', border:'none', color:'#64748B', cursor:'pointer', fontSize:13, marginBottom:16 }}>
              ← Change Class
            </button>

            {/* Recommended pathway switch? */}
            {targetStage.suggestPathway && (
              <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:12, marginBottom:14 }}>
                <p style={{ fontSize:12, color:'#1D4ED8', fontWeight:600, marginBottom:4 }}>💡 Better Pathway Suggestion</p>
                <p style={{ fontSize:12, color:'#1D4ED8', lineHeight:1.6, margin:0 }}>
                  For your current level, the <strong>{targetStage.suggestPathway.replace(/_/g,' ')}</strong> pathway 
                  may be a better fit. But you can still continue with this one!
                </p>
                <button onClick={() => { onClose(); navigate(`/pathway/${targetStage.suggestPathway}`) }}
                  style={{ marginTop:8, padding:'7px 14px', background:'#1D4ED8', color:'#fff',
                    border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Switch Pathway →
                </button>
              </div>
            )}

            {/* Your starting stage */}
            <div style={{ background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1.5px solid #6EE7B7',
              borderRadius:14, padding:14, marginBottom:16 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#059669', marginBottom:4 }}>YOUR STARTING POINT</p>
              <p style={{ fontSize:16, fontWeight:800, color:'#065F46', marginBottom:4 }}>
                {activeStage?.stage_icon} Stage {targetStage.stage}: {activeStage?.stage_name}
              </p>
              <p style={{ fontSize:13, color:'#047857', lineHeight:1.6, margin:0 }}>
                {targetStage.message}
              </p>
            </div>

            {/* Skipped stages */}
            {skippedStages.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#1E293B', marginBottom:8 }}>
                  Stages you're skipping ({skippedStages.length}):
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:12 }}>
                  {skippedStages.map(s => (
                    <div key={s.stage_number} style={{ display:'flex', alignItems:'center', gap:8,
                      padding:'8px 12px', background:'#F8FAFC', borderRadius:10, border:'1px solid #E2E8F0' }}>
                      <span style={{ fontSize:16 }}>{s.stage_icon}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:12, fontWeight:600, color:'#64748B', margin:0 }}>Stage {s.stage_number}: {s.stage_name}</p>
                        <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{s.class_or_phase?.replace(/_/g,' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Catch-up choice */}
                <p style={{ fontSize:12, fontWeight:700, color:'#475569', marginBottom:6 }}>
                  What do you want to do with these earlier stages?
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {[
                    { value:'skip', label:'Skip them — I already know this material', emoji:'⏭️',
                      desc:'Stages will be marked available for reference anytime' },
                    { value:'review', label:'Keep them available for self-review', emoji:'📖',
                      desc:'You can revisit any earlier stage when you want to revise' },
                    { value:'assess', label:'Take a quick assessment first', emoji:'🎯',
                      desc:'10-min test to see if you truly know the skipped material' },
                  ].map(opt => (
                    <button key={opt.value}
                      onClick={() => setCatchUpChoice(opt.value)}
                      style={{ padding:'10px 12px', borderRadius:12, border:'2px solid',
                        borderColor: catchUpChoice===opt.value ? NAVY : '#E2E8F0',
                        background: catchUpChoice===opt.value ? `${NAVY}08` : '#fff',
                        cursor:'pointer', textAlign:'left' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span>{opt.emoji}</span>
                        <div>
                          <p style={{ fontSize:12, fontWeight:700, color: catchUpChoice===opt.value?NAVY:'#475569', margin:0 }}>
                            {opt.label}
                          </p>
                          <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{opt.desc}</p>
                        </div>
                        {catchUpChoice===opt.value && <span style={{ marginLeft:'auto', color:NAVY, fontWeight:700 }}>✓</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enroll CTA */}
            <button onClick={handleEnroll} disabled={enrolling}
              style={{ width:'100%', padding:'14px', background:`linear-gradient(135deg,${NAVY},#0F2140)`,
                color:'#fff', border:'none', borderRadius:14, fontWeight:800, fontSize:14,
                cursor:'pointer', marginTop:6, opacity: enrolling?0.7:1 }}>
              {enrolling ? '⏳ Enrolling...' : `🚀 Start at Stage ${targetStage.stage} →`}
            </button>
            <p style={{ textAlign:'center', fontSize:11, color:'#94A3B8', marginTop:8 }}>
              +100 coins for enrolling · You can change your starting stage anytime
            </p>
          </>
        )}

        {/* ── STEP 3: ENROLLED CONFIRMATION ───────────────────────────── */}
        {step === 3 && (
          <div style={{ textAlign:'center', padding:'10px 0' }}>
            <p style={{ fontSize:48, marginBottom:12 }}>🎉</p>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:20, marginBottom:8 }}>
              You're Enrolled!
            </h3>
            <p style={{ fontSize:14, color:'#475569', marginBottom:6, lineHeight:1.7 }}>
              Starting at <strong>Stage {targetStage?.stage}: {activeStage?.stage_name}</strong>
            </p>
            <div style={{ background:'#FFF7E6', border:'1px solid #FDE68A', borderRadius:12, padding:12, marginBottom:16 }}>
              <p style={{ fontSize:13, color:'#92400E', margin:0 }}>🪙 +100 coins added to your wallet!</p>
            </div>
            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:14, marginBottom:20, textAlign:'left' }}>
              <p style={{ fontSize:12, color:'#065F46', lineHeight:1.8, margin:0 }}>
                ✅ Stage {targetStage?.stage} is now active<br/>
                {skippedStages.length > 0 && `📖 ${skippedStages.length} earlier stages available for review\n`}
                🎯 Your milestone: {activeStage?.milestone_test}<br/>
                🏅 Complete to earn: {activeStage?.badge_name} badge + {activeStage?.coins_reward} coins
              </p>
            </div>
            <button
              onClick={() => { onEnrolled?.(); onClose() }}
              style={{ width:'100%', padding:'13px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`,
                color:NAVY, border:'none', borderRadius:12, fontWeight:800, fontSize:14, cursor:'pointer' }}>
              Begin Stage {targetStage?.stage} →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}