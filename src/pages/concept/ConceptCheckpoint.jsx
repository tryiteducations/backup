// FILE: src/pages/concept/ConceptCheckpoint.jsx
// 3-Question Checkpoint Quiz after reading a concept card
// Route: /concept/:topicId/:level/checkpoint
import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { spacedRepetition } from '../../lib/spacedRepetition'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'

export default function ConceptCheckpoint() {
  const { topicId, level }  = useParams()
  const navigate             = useNavigate()
  const { state }            = useLocation()
  const { user, addCoins }   = useAuth()

  // Concept is passed via navigation state from ConceptCard
  const concept  = state?.concept
  const lvl      = parseInt(level) || 1
  const questions = concept?.checkpoint_questions || []

  const [currentIdx,  setCurrentIdx]  = useState(0)
  const [selected,    setSelected]    = useState(null)   // index 0-3
  const [showResult,  setShowResult]  = useState(false)
  const [answers,     setAnswers]     = useState([])     // [{selected, correct, passed}]
  const [done,        setDone]        = useState(false)

  const q          = questions[currentIdx]
  const isLast     = currentIdx === questions.length - 1
  const totalQ     = questions.length
  const correctCount = answers.filter(a => a.passed).length
  const passed     = done && correctCount >= 2  // 2/3 or 3/3 to pass

  // -- HANDLE ANSWER SELECT --------------------------------------------------
  const handleSelect = (idx) => {
    if (selected !== null) return  // already answered
    setSelected(idx)
    setShowResult(true)
  }

  // -- NEXT QUESTION ---------------------------------------------------------
  const handleNext = () => {
    const wasCorrect = selected === q?.correct
    const newAnswers = [...answers, {
      selected,
      correct: q?.correct,
      passed:  wasCorrect,
    }]
    setAnswers(newAnswers)

    if (user?.id && q) {
      const itemId = `${topicId}_L${lvl}_Q${currentIdx}`
      spacedRepetition.recordReview(user.id, 'foundation_question', itemId, wasCorrect, {
        question: q.question, options: q.options, correct: q.correct,
        micro_explanation: q.micro_explanation, topicId, level: lvl,
      }).catch(() => {})
    }

    setSelected(null)
    setShowResult(false)

    if (isLast) {
      // All done - save and show final result
      setDone(true)
      saveProgress(newAnswers)
    } else {
      setCurrentIdx(i => i + 1)
    }
  }

  // -- SAVE PROGRESS TO SUPABASE ---------------------------------------------
  const saveProgress = async (finalAnswers) => {
    const score  = finalAnswers.filter(a => a.passed).length
    const passed = score >= 2
    const conceptId = `${topicId}_l${lvl}`

    try {
      // Update concept progress
      await supabase.from('user_concept_progress').upsert({
        user_id:           user?.id,
        concept_id:        conceptId,
        topic_id:          topicId,
        level:             lvl,
        status:            passed ? 'completed' : 'reading',
        checkpoint_attempts: 1,
        checkpoint_best:   score,
        checkpoint_passed: passed,
        completed_at:      passed ? new Date().toISOString() : null,
      }, { onConflict:'user_id,concept_id' })

      // Insert/update concept_test_loop
      await supabase.from('concept_test_loop').upsert({
        user_id:            user?.id,
        topic_id:           topicId,
        level:              lvl,
        concept_id:         conceptId,
        concept_completed:  true,
        checkpoint_score:   score,
        checkpoint_passed:  passed,
        next_action:        passed ? 'test' : 'relearn',
        updated_at:         new Date().toISOString(),
      }, { onConflict:'user_id,topic_id,level' })

      // Award coins for passing checkpoint
      if (passed && user?.id) {
        await supabase.from('coins_ledger').insert({
          user_id:          user.id,
          transaction_type: 'earned_checkpoint',
          amount:           30,
          balance_after:    (user?.coins || 0) + 30,
          notes:            `Passed L${lvl} checkpoint for ${topicId}`,
        })
        addCoins(30)
      }
    } catch {
      // Offline fallback
      const key = `tryit_checkpoint_${user?.id}_${conceptId}`
      localStorage.setItem(key, JSON.stringify({
        score, passed, savedAt: new Date().toISOString()
      }))
    }
  }

  // -- OPTION STYLE ----------------------------------------------------------
  const optStyle = (idx) => {
    const base = {
      width:'100%', textAlign:'left', padding:'14px 16px', borderRadius:14,
      border:'2px solid', marginBottom:8, cursor:'pointer', fontSize:14,
      fontWeight:500, transition:'all 0.15s', background:'#fff',
    }
    if (!showResult) {
      return { ...base, borderColor: selected===idx ? NAVY : '#E2E8F0',
        background: selected===idx ? `${NAVY}10` : '#fff', color:'var(--color-text,#1E293B)' }
    }
    if (idx === q?.correct) return { ...base, borderColor:'#059669', background:'#D1FAE5', color:'#065F46' }
    if (idx === selected && idx !== q?.correct) return { ...base, borderColor:'#DC2626', background:'#FEE2E2', color:'#991B1B' }
    return { ...base, borderColor:'var(--color-border,#E2E8F0)', color:'#94A3B8' }
  }

  // -- IF NO CONCEPT DATA (direct URL navigation) ----------------------------
  if (!concept || questions.length === 0) {
    return (
      <div style={{ minHeight:'100vh', background:BG, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:24, fontFamily:'Inter,sans-serif' }}>
        <p style={{ fontSize:32, marginBottom:8 }}>📚</p>
        <p style={{ color:'#475569', fontSize:14, marginBottom:16, textAlign:'center' }}>
          Please read the concept card first before taking the checkpoint.
        </p>
        <button onClick={() => navigate(`/concept/${topicId}/${level}`)}
          style={{ padding:'12px 24px', background:NAVY, color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontWeight:700 }}>
          Go to Concept Card →
        </button>
      </div>
    )
  }

  // -- DONE SCREEN -----------------------------------------------------------
  if (done) {
    const emoji = passed
      ? correctCount === 3 ? '🏆' : '✅'
      : '📖'

    return (
      <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ background:'#fff', borderRadius:24, padding:28, maxWidth:380, width:'100%',
          border:`2px solid ${passed ? '#059669' : '#DC2626'}`, textAlign:'center',
          boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>

          {/* Score circle */}
          <div style={{ width:96, height:96, borderRadius:'50%', margin:'0 auto 16px',
            background: passed ? 'linear-gradient(135deg,#059669,#10B981)' : 'linear-gradient(135deg,#DC2626,#EF4444)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontSize:32, margin:0 }}>{emoji}</p>
            <p style={{ color:'#fff', fontSize:11, fontWeight:700, margin:0 }}>
              {correctCount}/{totalQ}
            </p>
          </div>

          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20,
            color: passed ? '#059669' : '#DC2626', marginBottom:8 }}>
            {passed ? 'Checkpoint Passed! 🎉' : 'Almost There! Try Again 💪'}
          </h2>

          <p style={{ fontSize:14, color:'#475569', marginBottom:20, lineHeight:1.7 }}>
            {passed
              ? `You got ${correctCount} out of ${totalQ} correct. You\'re ready for the Level ${lvl} test!`
              : `You got ${correctCount} out of ${totalQ}. Read the concept once more - focus on ${correctCount === 0 ? 'the formula and examples' : 'the shortcut tricks'}.`
            }
          </p>

          {/* Answer review */}
          <div style={{ background:'var(--color-bg,#F8FAFC)', borderRadius:14, padding:12, marginBottom:20, textAlign:'left' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'var(--color-text-light,#64748B)', marginBottom:8 }}>YOUR ANSWERS</p>
            {answers.map((a, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0',
                borderBottom: i < answers.length-1 ? '1px solid #E2E8F0' : 'none' }}>
                <span style={{ fontSize:14 }}>{a.passed ? '✅' : '❌'}</span>
                <p style={{ fontSize:12, color:'#475569', flex:1 }}>
                  Q{i+1}: {a.passed ? 'Correct' : `Wrong - correct was option ${String.fromCharCode(65+a.correct)}`}
                </p>
              </div>
            ))}
          </div>

          {/* Coins earned (if passed) */}
          {passed && (
            <div style={{ background:'#FFF7E6', border:'1px solid #FDE68A', borderRadius:12,
              padding:'8px 14px', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:20 }}>🪙</span>
              <p style={{ fontSize:13, fontWeight:600, color:'#92400E' }}>+30 coins earned for passing!</p>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {passed ? (
              <>
                <button
                  onClick={() => navigate('/test-engine/active', {
                    state: { mode:'practice', count:20, topicId, level:lvl, source:'concept_checkpoint' }
                  })}
                  style={{ padding:'13px', background:`linear-gradient(135deg,${NAVY},#0F2140)`, color:'#fff',
                    border:'none', borderRadius:12, fontWeight:800, fontSize:14, cursor:'pointer' }}>
                  Take Level {lvl} Test →
                </button>
                {lvl < 10 && (
                  <button
                    onClick={() => navigate(`/concept/${topicId}/${lvl + 1}`)}
                    style={{ padding:'13px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`, color:NAVY,
                      border:'none', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                    Preview Level {lvl + 1} Concept →
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/concept/${topicId}/${level}`)}
                  style={{ padding:'13px', background:NAVY, color:'#fff', border:'none',
                    borderRadius:12, fontWeight:800, fontSize:14, cursor:'pointer' }}>
                  📖 Re-read Concept Card
                </button>
                <button
                  onClick={() => {
                    setDone(false)
                    setCurrentIdx(0)
                    setAnswers([])
                    setSelected(null)
                    setShowResult(false)
                  }}
                  style={{ padding:'13px', background:'#F1F5F9', color:'#475569',
                    border:'1.5px solid #E2E8F0', borderRadius:12, fontWeight:600, fontSize:13, cursor:'pointer' }}>
                  Try Checkpoint Again
                </button>
              </>
            )}
            <button
              onClick={() => navigate(-2)}
              style={{ fontSize:12, color:'#94A3B8', background:'none', border:'none', cursor:'pointer', padding:'4px' }}>
              ← Back to Topics
            </button>
          </div>
        </div>
      </div>
    )
  }

  // -- QUESTION SCREEN -------------------------------------------------------
  const progressPct = ((currentIdx) / totalQ) * 100

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif' }}>

      {/* Header */}
      <div style={{ background:NAVY, padding:'14px 16px 12px', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <button onClick={() => navigate(-1)}
            style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', fontSize:20, cursor:'pointer' }}>
            ←
          </button>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>Checkpoint Quiz</p>
            <p style={{ fontWeight:700, fontSize:14 }}>Question {currentIdx + 1} of {totalQ}</p>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {Array.from({ length:totalQ }).map((_, i) => (
              <div key={i} style={{
                width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                background: i < answers.length
                  ? (answers[i].passed ? '#059669' : '#DC2626')
                  : i === currentIdx ? GOLD : 'rgba(255,255,255,0.15)',
                fontSize:11, fontWeight:700,
                color: i <= currentIdx || i < answers.length ? '#fff' : 'rgba(255,255,255,0.4)',
              }}>
                {i < answers.length ? (answers[i].passed ? '✓' : '✗') : i + 1}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:4, background:'rgba(255,255,255,0.15)', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progressPct}%`, background:GOLD, borderRadius:99 }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ padding:16, maxWidth:480, margin:'0 auto' }}>

        <div style={{ background:'linear-gradient(135deg,#EFF6FF,#F0F9FF)', border:'1.5px solid #BFDBFE',
          borderRadius:16, padding:20, marginBottom:20, marginTop:8 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#1D4ED8', marginBottom:8, letterSpacing:0.5 }}>
            QUICK CHECK - {currentIdx + 1}/{totalQ}
          </p>
          <p style={{ fontSize:16, fontWeight:600, color:'var(--color-text,#1E293B)', lineHeight:1.7 }}>{q?.question}</p>
        </div>

        {/* Options */}
        <div>
          {q?.options?.map((opt, idx) => (
            <button key={idx} onClick={() => handleSelect(idx)} style={optStyle(idx)}>
              <span style={{ marginRight:10, fontWeight:700, opacity:0.5 }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
              {/* Show tick/cross after answer */}
              {showResult && idx === q?.correct && (
                <span style={{ float:'right', color:'#059669' }}>✓</span>
              )}
              {showResult && idx === selected && idx !== q?.correct && (
                <span style={{ float:'right', color:'#DC2626' }}>✗</span>
              )}
            </button>
          ))}
        </div>

        {/* Instant feedback after answering */}
        {showResult && (
          <div style={{ borderRadius:14, padding:14, marginTop:6, marginBottom:16,
            background: selected === q?.correct ? '#D1FAE5' : '#FEE2E2',
            border: `1.5px solid ${selected === q?.correct ? '#6EE7B7' : '#FCA5A5'}` }}>
            <p style={{ fontWeight:700, fontSize:14, color: selected===q?.correct?'#065F46':'#991B1B', marginBottom:4 }}>
              {selected === q?.correct ? '✅ Correct!' : '❌ Not quite'}
            </p>
            <p style={{ fontSize:13, color: selected===q?.correct?'#065F46':'#991B1B' }}>
              {q?.micro_explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {showResult && (
          <button onClick={handleNext}
            style={{ width:'100%', padding:'14px', background:`linear-gradient(135deg,${NAVY},#0F2140)`,
              color:'#fff', border:'none', borderRadius:14, fontWeight:700, fontSize:14, cursor:'pointer' }}>
            {isLast ? 'See Results →' : 'Next Question →'}
          </button>
        )}

        {/* Hint */}
        {!showResult && (
          <p style={{ textAlign:'center', color:'#94A3B8', fontSize:12, marginTop:16 }}>
            Tap an option to answer - no penalty for wrong answers here
          </p>
        )}
      </div>
    </div>
  )
}