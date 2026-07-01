// FILE: src/components/QuestionFlag.jsx
// TryIT - Question Flag Component
// Used inside ActiveTest and TournamentLive
// Students report: wrong answer / wrong question / translation error / unclear
// Flags go to mentor review queue in MentorHub
import { useState } from 'react'
import { useAuth }  from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'

const FLAG_TYPES = [
  { id:'wrong_answer',      label:'Wrong Answer Key',       emoji:'❌', desc:'The marked correct answer seems wrong' },
  { id:'wrong_question',    label:'Question Error',         emoji:'📝', desc:'Question has a mistake or is unclear' },
  { id:'translation_error', label:'Translation Wrong',      emoji:'🌐', desc:'Translation in my language is incorrect' },
  { id:'duplicate',         label:'Duplicate Question',     emoji:'🔁', desc:'I have seen this exact question before' },
  { id:'outdated_info',     label:'Outdated Information',   emoji:'📅', desc:'GK/CA answer has changed recently' },
  { id:'unclear_image',     label:'Image / Diagram Issue',  emoji:'🖼️', desc:'Image is missing or unclear' },
  { id:'other',             label:'Other Issue',            emoji:'💬', desc:'Something else is wrong' },
]

export default function QuestionFlag({ questionId, examId, tournamentId, onClose }) {
  const { user }       = useAuth()
  const [step,         setStep]         = useState(1)  // 1=type select, 2=details, 3=done
  const [flagType,     setFlagType]     = useState('')
  const [description,  setDescription]  = useState('')
  const [submitting,   setSubmitting]   = useState(false)

  const handleSubmit = async () => {
    if (!flagType) { alert('Please select a flag type'); return }
    setSubmitting(true)
    try {
      await supabase.from('question_flags').insert({
        question_id:   questionId,
        exam_id:       examId       || null,
        tournament_id: tournamentId || null,
        flagged_by:    user?.id,
        flag_type:     flagType,
        description:   description.trim() || null,
        status:        'pending',
      })
      setStep(3)
    } catch (err) {
      // Even if DB fails, show success (we don't want to disrupt exam)
      setStep(3)
    }
    setSubmitting(false)
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)',
      display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:2000,
      fontFamily:'Inter,sans-serif' }}
      onClick={e => e.target === e.currentTarget && onClose?.()}>

      <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:24,
        width:'100%', maxWidth:460, maxHeight:'80vh', overflowY:'auto' }}>

        {/* Step 1 - Select flag type */}
        {step === 1 && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:16, margin:0 }}>
                🚩 Flag This Question
              </h3>
              <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94A3B8' }}>✕</button>
            </div>

            <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', marginBottom:14, lineHeight:1.6 }}>
              What seems wrong? Our mentor team reviews every flag within 24 hours.
            </p>

            {FLAG_TYPES.map(f => (
              <button key={f.id}
                onClick={() => { setFlagType(f.id); setStep(2) }}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:12,
                  padding:'12px 14px', marginBottom:8, borderRadius:12,
                  border:`1.5px solid ${flagType===f.id?NAVY:'#E2E8F0'}`,
                  background: flagType===f.id ? `${NAVY}08` : '#fff',
                  cursor:'pointer', textAlign:'left' }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{f.emoji}</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--color-text,#1E293B)', margin:0 }}>{f.label}</p>
                  <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>{f.desc}</p>
                </div>
              </button>
            ))}

            <p style={{ fontSize:10, color:'#94A3B8', textAlign:'center', marginTop:8 }}>
              Question ID: {questionId} · Your flag is anonymous to other students
            </p>
          </>
        )}

        {/* Step 2 - Add details */}
        {step === 2 && (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <button onClick={() => setStep(1)} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'#94A3B8' }}>←</button>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:16, margin:0 }}>
                {FLAG_TYPES.find(f=>f.id===flagType)?.emoji} {FLAG_TYPES.find(f=>f.id===flagType)?.label}
              </h3>
            </div>

            <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', marginBottom:10 }}>
              Add more details (optional - helps our mentors fix it faster):
            </p>

            <textarea
              placeholder="e.g. The correct answer should be C because... / The Tamil translation says... / This question appeared in SSC CGL 2023..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width:'100%', padding:'12px', borderRadius:12, border:'1.5px solid #E2E8F0',
                fontSize:13, lineHeight:1.6, minHeight:100, resize:'vertical',
                outline:'none', boxSizing:'border-box', marginBottom:14, fontFamily:'inherit' }}
            />

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width:'100%', padding:'13px', background:`linear-gradient(135deg,${NAVY},#0F2140)`,
                color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:14,
                cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.7:1 }}>
              {submitting ? '⏳ Submitting...' : '🚩 Submit Flag'}
            </button>

            <p style={{ fontSize:11, color:'#94A3B8', textAlign:'center', marginTop:8 }}>
              Our mentors review within 24 hours · You earn 10🪙 if flag is verified correct
            </p>
          </>
        )}

        {/* Step 3 - Done */}
        {step === 3 && (
          <div style={{ textAlign:'center', padding:'8px 0' }}>
            <p style={{ fontSize:40, marginBottom:12 }}>✅</p>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:18, margin:'0 0 8px' }}>
              Flag Submitted!
            </h3>
            <p style={{ fontSize:13, color:'var(--color-text-light,#64748B)', lineHeight:1.7, margin:'0 0 20px' }}>
              Thank you for helping improve TryIT.<br />
              Our mentor team will review this within 24 hours.<br />
              If your flag is correct, <strong>+10 coins</strong> will be added to your wallet.
            </p>
            <button onClick={onClose}
              style={{ width:'100%', padding:'13px', background:NAVY, color:'#fff',
                border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>
              Continue Exam →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}