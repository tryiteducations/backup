// FILE: src/pages/tournament/TournamentReview.jsx
// TryIT - Tournament Question Review (unlocks at 8 PM)
// Route: /tournament/:id/review
//
// Shows every question the student answered:
//   ✅ Correct - confirmation + why it's right
//   📚 Wrong   - what they chose, correct answer, why each option is a trap
//   ⬜ Skipped - correct answer + full explanation
//
// Features:
//   • Both languages: English + student's preferred language
//   • Add wrong questions to Practice Queue
//   • Share a learning card (positive, not showing their mistake)
//   • Subject-wise breakdown + weak topic analysis
//   • Explanation: step-by-step + shortcut + exam frequency
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth }                from '../../context/AuthContext'
import { supabase }               from '../../lib/supabase'
import { buildReviewData }        from '../../lib/answerKeyEngine'
import { encouragement }          from '../../components/EmojiSystem'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'
const GREEN = '#059669'

const RESULT_CONFIG = {
  correct:     { emoji:'✅', label:'Correct',      color:GREEN,    bg:'#F0FDF4', border:'#BBF7D0' },
  incorrect:   { emoji:'📚', label:'Learn from this', color:'#D97706', bg:'#FFF7E6', border:'#FED7AA' },
  unattempted: { emoji:'⬜', label:'Not attempted',color:'var(--color-text-light,#64748B)', bg:'#F8FAFC', border:'#E2E8F0' },
}

const SUBJECT_COLORS = {
  quant:     '#1D4ED8',
  reasoning: '#7C3AED',
  english:   '#059669',
  gk:        '#D97706',
  general:   '#64748B',
}

// -- SUBJECT SCORECARD -----------------------------------------------------
function SubjectCard({ subject, data }) {
  const color = SUBJECT_COLORS[subject] || '#64748B'
  const pct   = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
  return (
    <div style={{ background:'#fff', borderRadius:12, padding:'12px 14px', border:`1.5px solid ${color}22`, flex:1 }}>
      <p style={{ fontSize:10, fontWeight:700, color, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:0.5 }}>
        {subject}
      </p>
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:22, color, margin:'0 0 2px' }}>
        {data.correct}/{data.total}
      </p>
      <div style={{ height:4, background:'#E2E8F0', borderRadius:99, overflow:'hidden', marginBottom:4 }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99 }} />
      </div>
      <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{pct}% accuracy</p>
    </div>
  )
}

// -- SINGLE QUESTION REVIEW CARD -------------------------------------------
function QuestionCard({ pq, index, userLanguage, onAddToPractice, onShare }) {
  const [expanded,   setExpanded]   = useState(pq.result === 'incorrect')
  const [addedQueue, setAddedQueue] = useState(false)

  const cfg     = RESULT_CONFIG[pq.result]
  const options = ['A','B','C','D']

  return (
    <div style={{ background:'#fff', borderRadius:16, marginBottom:10,
      border:`2px solid ${cfg.border}`, overflow:'hidden' }}>

      {/* Header */}
      <div onClick={() => setExpanded(e => !e)}
        style={{ padding:'12px 14px', display:'flex', alignItems:'flex-start',
          gap:10, cursor:'pointer', background:cfg.bg }}>
        <span style={{ fontSize:18, flexShrink:0 }}>{cfg.emoji}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
              background:cfg.border, color:cfg.color }}>
              Q{index + 1}
            </span>
            <span style={{ fontSize:10, color:'#94A3B8' }}>{pq.topic_code || pq.subject}</span>
            {pq.is_honeypot && (
              <span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:99,
                background:'#7C3AED22', color:'#7C3AED' }}>
                🍯 Honeypot
              </span>
            )}
          </div>
          <p style={{ fontSize:13, fontWeight:600, color:'var(--color-text,#1E293B)', margin:0,
            lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:expanded?'unset':2,
            WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {pq.question_text}
          </p>
        </div>
        <span style={{ color:'#94A3B8', fontSize:14, flexShrink:0, marginTop:2 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding:'12px 14px' }}>

          {/* Options with colour coding */}
          <div style={{ marginBottom:14 }}>
            {options.map(opt => {
              const isCorrect  = opt === pq.correct_answer
              const isStudent  = opt === pq.student_answer
              const optText    = pq.options?.[opt] || pq.options?.[options.indexOf(opt)] || opt
              const wrongReason = pq.all_wrong_reasons?.[opt]

              let bg     = '#F8FAFC'
              let border = '#E2E8F0'
              let color  = '#475569'
              let badge  = null

              if (isCorrect) {
                bg = '#F0FDF4'; border = '#22C55E'; color = GREEN
                badge = '✅ Correct Answer'
              } else if (isStudent && !isCorrect) {
                bg = '#FFF7E6'; border = GOLD; color = '#92400E'
                badge = '📌 Your Answer'
              }

              return (
                <div key={opt} style={{ marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:8,
                    padding:'10px 12px', borderRadius:10, border:`2px solid ${border}`,
                    background:bg }}>
                    <span style={{ fontWeight:800, color, fontSize:13, flexShrink:0, width:20 }}>
                      {opt}
                    </span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, color, margin:0, lineHeight:1.4 }}>{optText}</p>
                      {badge && (
                        <span style={{ fontSize:10, fontWeight:700, color, display:'block', marginTop:3 }}>
                          {badge}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Why this wrong option is a trap */}
                  {!isCorrect && wrongReason && (
                    <div style={{ background:'#FEF2F2', borderRadius:'0 0 8px 8px',
                      padding:'6px 12px', border:'1px solid #FCA5A5', borderTop:'none' }}>
                      <p style={{ fontSize:11, color:'#991B1B', margin:0, lineHeight:1.5 }}>
                        🎯 Why this is a trap: {wrongReason}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Why student's specific answer was wrong */}
          {pq.result === 'incorrect' && pq.why_wrong_student && (
            <div style={{ background:'#FFF7E6', border:'1.5px solid #FED7AA',
              borderRadius:12, padding:12, marginBottom:12 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#92400E', margin:'0 0 4px' }}>
                💡 Why "{pq.student_answer}" seemed right but isn't:
              </p>
              <p style={{ fontSize:12, color:'#78350F', margin:0, lineHeight:1.6 }}>
                {pq.why_wrong_student}
              </p>
            </div>
          )}

          {/* Full Explanation - English */}
          {pq.explanation_en && (
            <div style={{ background:'#EFF6FF', border:'1.5px solid #BFDBFE',
              borderRadius:12, padding:12, marginBottom:10 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#1D4ED8', margin:'0 0 6px' }}>
                📖 Explanation (English)
              </p>
              <p style={{ fontSize:13, color:'#1E3A5F', margin:0, lineHeight:1.8 }}>
                {pq.explanation_en}
              </p>
            </div>
          )}

          {/* Explanation in student's language */}
          {pq.explanation && pq.explanation !== pq.explanation_en && (
            <div style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0',
              borderRadius:12, padding:12, marginBottom:10 }}>
              <p style={{ fontSize:11, fontWeight:700, color:GREEN, margin:'0 0 6px' }}>
                🌐 உங்கள் மொழியில் / आपकी भाषा में
              </p>
              <p style={{ fontSize:13, color:'var(--color-text,#1E293B)', margin:0, lineHeight:1.8 }}>
                {pq.explanation}
              </p>
            </div>
          )}

          {/* Shortcut */}
          {pq.shortcut && (
            <div style={{ background:'#F3E8FF', border:'1px solid #DDD6FE',
              borderRadius:10, padding:10, marginBottom:10 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#7C3AED', margin:'0 0 3px' }}>
                ⚡ Shortcut / Trick
              </p>
              <p style={{ fontSize:12, color:'#5B21B6', margin:0, lineHeight:1.6 }}>
                {pq.shortcut}
              </p>
            </div>
          )}

          {/* Exam frequency */}
          {pq.exam_frequency && (
            <p style={{ fontSize:11, color:'#94A3B8', margin:'0 0 12px' }}>
              📊 {pq.exam_frequency}
            </p>
          )}

          {/* Actions */}
          <div style={{ display:'flex', gap:8 }}>
            {pq.result !== 'correct' && (
              <button
                onClick={async () => {
                  await onAddToPractice(pq.q_id)
                  setAddedQueue(true)
                }}
                disabled={addedQueue}
                style={{ flex:1, padding:'9px', border:'none', borderRadius:10,
                  fontWeight:700, fontSize:12, cursor:addedQueue?'default':'pointer',
                  background:addedQueue?'#F0FDF4':NAVY,
                  color:addedQueue?GREEN:'#fff' }}>
                {addedQueue ? '✅ Added to Practice' : '+ Add to Practice Queue'}
              </button>
            )}
            <button
              onClick={() => onShare(pq)}
              style={{ padding:'9px 14px', border:'none', borderRadius:10,
                fontWeight:700, fontSize:12, cursor:'pointer',
                background:'#F1F5F9', color:'var(--color-text-light,#64748B)' }}>
              📤 Share
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// -- MAIN REVIEW PAGE ------------------------------------------------------
export default function TournamentReview() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user, preferredLanguage } = useAuth()

  const [reviewData,    setReviewData]    = useState([])
  const [subjectScores, setSubjectScores] = useState({})
  const [weakTopics,    setWeakTopics]    = useState([])
  const [scoreResult,   setScoreResult]   = useState(null)
  const [tournament,    setTournament]    = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [locked,        setLocked]        = useState(false)
  const [filter,        setFilter]        = useState('all')
  // filter: 'all' | 'incorrect' | 'correct' | 'unattempted'
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [shareCard,     setShareCard]     = useState(null)

  useEffect(() => {
    ;(async () => {
      // Check if review is unlocked (after 8 PM)
      const { data: access } = await supabase
        .from('question_review_access')
        .select('*').eq('tournament_id', id).single()

      if (access && !access.review_enabled) {
        const unlockTime = new Date(access.review_unlocks_at)
        if (new Date() < unlockTime) {
          setLocked(true)
          setLoading(false)
          return
        }
      }

      // Load tournament info
      const { data: t } = await supabase
        .from('tournaments').select('*').eq('tournament_id', id).single()
      setTournament(t)

      // Load student's submission result
      const { data: sub } = await supabase
        .from('tournament_submissions').select('*')
        .eq('tournament_id', id).eq('user_id', user?.id || '').single()

      if (!sub) { setLoading(false); return }
      setScoreResult(sub)

      // Load student's paper (question order + answers)
      const { data: paper } = await supabase
        .from('student_papers').select('*')
        .eq('tournament_id', id).eq('user_id', user?.id || '').single()

      if (!paper) { setLoading(false); return }

      // Load full question data
      const { data: questions } = await supabase
        .from('question_bank')
        .select('*')
        .in('q_id', paper.question_ids)

      if (!questions) { setLoading(false); return }

      // Reconstruct per-question results
      const qMap       = Object.fromEntries(questions.map(q => [q.q_id, q]))
      const answerString = sub.answer_string || ''
      const perQuestion  = paper.question_ids.map((qId, i) => {
        const q             = qMap[qId]
        const studentAnswer = answerString[i] === 'S' ? null : answerString[i]
        const isCorrect     = studentAnswer === q?.correct_answer
        const result        = !studentAnswer ? 'unattempted'
          : isCorrect ? 'correct' : 'incorrect'

        return {
          q_id:           qId,
          position:       i + 1,
          topic_code:     q?.topic_code,
          subject:        q?.subject,
          question_text:  q?.question_text,
          options:        q?.options,
          student_answer: studentAnswer,
          correct_answer: q?.correct_answer,
          result,
          points:         result === 'correct' ? 2 : result === 'incorrect' ? -0.5 : 0,
          explanation_en: q?.explanation_en,
          why_wrong_a:    q?.why_wrong_a,
          why_wrong_b:    q?.why_wrong_b,
          why_wrong_c:    q?.why_wrong_c,
          why_wrong_d:    q?.why_wrong_d,
          all_wrong_reasons: {
            A: q?.correct_answer === 'A' ? null : q?.why_wrong_a,
            B: q?.correct_answer === 'B' ? null : q?.why_wrong_b,
            C: q?.correct_answer === 'C' ? null : q?.why_wrong_c,
            D: q?.correct_answer === 'D' ? null : q?.why_wrong_d,
          },
          why_wrong_student: studentAnswer ? q?.[`why_wrong_${studentAnswer?.toLowerCase()}`] : null,
          shortcut:          q?.shortcut,
          mnemonic:          q?.mnemonic,
          exam_frequency:    q?.exam_frequency,
          is_honeypot:       q?.is_honeypot,
        }
      })

      // Enrich with translations
      const userLang = preferredLanguage || 'en'
      const enriched = perQuestion.map(pq => {
        const q    = qMap[pq.q_id]
        const lang = `explanation_${userLang}`
        return { ...pq, explanation: q?.[lang] || q?.explanation_en || pq.explanation_en }
      })

      setReviewData(enriched)

      // Compute subject breakdown
      const subjects = {}
      for (const pq of enriched) {
        const s = pq.subject || 'general'
        if (!subjects[s]) subjects[s] = { correct:0, wrong:0, unattempted:0, total:0, score:0 }
        subjects[s][pq.result === 'correct'?'correct':pq.result==='incorrect'?'wrong':'unattempted']++
        subjects[s].total++
        subjects[s].score += pq.points
      }
      for (const s of Object.keys(subjects)) {
        const att = subjects[s].correct + subjects[s].wrong
        subjects[s].accuracy = att > 0 ? Math.round((subjects[s].correct/att)*100) : 0
      }
      setSubjectScores(subjects)

      // Weak topics
      const topics = {}
      for (const pq of enriched) {
        if (!pq.topic_code) continue
        if (!topics[pq.topic_code]) topics[pq.topic_code] = { wrong:0, total:0, subject:pq.subject }
        if (pq.result === 'incorrect') topics[pq.topic_code].wrong++
        topics[pq.topic_code].total++
      }
      const weak = Object.entries(topics)
        .filter(([,v]) => v.wrong > 0)
        .map(([topic,v]) => ({ topic, ...v, errorRate:Math.round((v.wrong/v.total)*100) }))
        .sort((a,b) => b.wrong - a.wrong).slice(0, 5)
      setWeakTopics(weak)
      setLoading(false)
    })()
  }, [id, user?.id])

  const handleAddToPractice = async (qId) => {
    try {
      await supabase.from('practice_queue').upsert({
        user_id:      user?.id,
        q_id:         qId,
        source:       'tournament_review',
        tournament_id: id,
        practiced:    false,
      }, { onConflict: 'user_id,q_id,tournament_id' })
    } catch {}
  }

  const handleAddAllMistakes = async () => {
    const mistakes = reviewData.filter(pq => pq.result !== 'correct')
    for (const pq of mistakes) {
      await handleAddToPractice(pq.q_id)
    }
    alert(`✅ ${mistakes.length} questions added to your Practice Queue!`)
  }

  const handleShareLearning = (pq) => {
    const text = `💡 Just learned this from TryIT Educations!\n\n` +
      `Topic: ${pq.topic_code}\n` +
      `Key Shortcut: ${pq.shortcut || pq.exam_frequency || 'Always verify your formula!'}\n\n` +
      `Preparing for exams? Join me at tryiteducations.net 🇮🇳`
    navigator.clipboard.writeText(text)
    alert('✅ Learning tip copied! Share it on WhatsApp.')
  }

  // Filter questions
  const filtered = reviewData
    .filter(pq => filter === 'all' || pq.result === filter)
    .filter(pq => subjectFilter === 'all' || pq.subject === subjectFilter)

  const stats = {
    correct:     reviewData.filter(p => p.result==='correct').length,
    incorrect:   reviewData.filter(p => p.result==='incorrect').length,
    unattempted: reviewData.filter(p => p.result==='unattempted').length,
  }

  // -- LOCKED STATE -----------------------------------------------------
  if (locked) return (
    <div style={{ minHeight:'100vh', background:BG, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', padding:24, textAlign:'center' }}>
      <p style={{ fontSize:48, marginBottom:12 }}>🔒</p>
      <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:20, margin:'0 0 8px' }}>
        Review unlocks at 8:00 PM
      </h2>
      <p style={{ fontSize:13, color:'var(--color-text-light,#64748B)', lineHeight:1.7, marginBottom:20 }}>
        Full review with explanations is available after results are announced.<br />
        Come back at 8 PM to see every question, correct answer, and why each option is right or wrong.
      </p>
      <button onClick={() => navigate(`/tournament/${id}/results`)}
        style={{ padding:'12px 24px', background:NAVY, color:'#fff', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>
        ← Back to Results
      </button>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight:'100vh', background:BG, display:'flex', alignItems:'center',
      justifyContent:'center', fontFamily:'Inter,sans-serif', color:'var(--color-text-light,#64748B)' }}>
      <p>Loading your review...</p>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`, padding:'20px 16px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <button onClick={() => navigate(`/tournament/${id}/results`)}
            style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>
            ←
          </button>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17, color:'#fff', margin:0 }}>
            📖 Question Review
          </h1>
        </div>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'0 0 16px' }}>
          {tournament?.exam_display_name} · {reviewData.length} questions
        </p>

        {/* Score summary */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {[
            { label:'Correct',     value:stats.correct,     emoji:'✅', color:'#22C55E' },
            { label:'Learn From',  value:stats.incorrect,   emoji:'📚', color:GOLD      },
            { label:'Unattempted', value:stats.unattempted, emoji:'⬜', color:'#94A3B8' },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 4px', textAlign:'center' }}>
              <p style={{ fontSize:18, margin:'0 0 2px' }}>{s.emoji}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:22, color:s.color, margin:'0 0 1px' }}>{s.value}</p>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:16, maxWidth:480, margin:'0 auto' }}>

        {/* Encouragement */}
        <div style={{ background:'#fff', borderRadius:14, padding:14, marginBottom:14,
          border:`1.5px solid ${NAVY}22`, textAlign:'center' }}>
          <p style={{ fontSize:14, color:NAVY, fontWeight:600, margin:0, lineHeight:1.6 }}>
            {encouragement(scoreResult ? (scoreResult.accuracy_pct || 0) : 70)}
          </p>
        </div>

        {/* Subject breakdown */}
        {Object.keys(subjectScores).length > 0 && (
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:1, marginBottom:8 }}>
              SUBJECT PERFORMANCE
            </p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {Object.entries(subjectScores).map(([s, d]) => (
                <SubjectCard key={s} subject={s} data={d} />
              ))}
            </div>
          </div>
        )}

        {/* Weak topics */}
        {weakTopics.length > 0 && (
          <div style={{ background:'#FFF7E6', border:`1px solid ${GOLD}`, borderRadius:14,
            padding:14, marginBottom:14 }}>
            <p style={{ fontSize:12, fontWeight:700, color:'#92400E', marginBottom:10 }}>
              🎯 Your Weak Areas (focus here first)
            </p>
            {weakTopics.map(t => (
              <div key={t.topic} style={{ display:'flex', justifyContent:'space-between',
                alignItems:'center', padding:'5px 0', borderBottom:'1px solid #FED7AA' }}>
                <span style={{ fontSize:12, color:'#78350F' }}>{t.topic} ({t.subject})</span>
                <span style={{ fontSize:12, fontWeight:700, color:'#92400E' }}>
                  {t.wrong}/{t.total} wrong ({t.errorRate}%)
                </span>
              </div>
            ))}
            <button onClick={handleAddAllMistakes}
              style={{ width:'100%', marginTop:10, padding:'10px', background:'#92400E',
                color:'#fff', border:'none', borderRadius:10, fontWeight:700,
                fontSize:12, cursor:'pointer' }}>
              + Add All Mistakes to Practice Queue ({stats.incorrect + stats.unattempted} questions)
            </button>
          </div>
        )}

        {/* Filters */}
        <div style={{ marginBottom:12 }}>
          <div style={{ display:'flex', gap:6, marginBottom:8, flexWrap:'wrap' }}>
            {[
              { id:'all',         label:`All (${reviewData.length})` },
              { id:'incorrect',   label:`📚 Mistakes (${stats.incorrect})` },
              { id:'correct',     label:`✅ Correct (${stats.correct})` },
              { id:'unattempted', label:`⬜ Skipped (${stats.unattempted})` },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                style={{ padding:'7px 12px', borderRadius:99, border:'none', cursor:'pointer',
                  fontSize:11, fontWeight:700,
                  background: filter===f.id ? NAVY : '#F1F5F9',
                  color:      filter===f.id ? '#fff' : '#64748B' }}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:6, overflowX:'auto' }}>
            {['all', ...Object.keys(subjectScores)].map(s => (
              <button key={s} onClick={() => setSubjectFilter(s)}
                style={{ padding:'5px 10px', borderRadius:99, border:'none', cursor:'pointer',
                  fontSize:10, fontWeight:700, whiteSpace:'nowrap',
                  background: subjectFilter===s ? (SUBJECT_COLORS[s]||NAVY) : '#F1F5F9',
                  color:      subjectFilter===s ? '#fff' : '#64748B' }}>
                {s === 'all' ? 'All Subjects' : s}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize:11, color:'#94A3B8', marginBottom:10 }}>
          Showing {filtered.length} questions
        </p>

        {/* Question cards */}
        {filtered.map((pq, i) => (
          <QuestionCard
            key={pq.q_id}
            pq={pq}
            index={reviewData.indexOf(pq)}
            userLanguage={preferredLanguage || 'en'}
            onAddToPractice={handleAddToPractice}
            onShare={handleShareLearning}
          />
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:32, color:'#94A3B8' }}>
            <p style={{ fontSize:24 }}>🎯</p>
            <p>No questions in this category.</p>
          </div>
        )}

        {/* Practice queue CTA */}
        {stats.incorrect > 0 && filter !== 'correct' && (
          <div style={{ background:`linear-gradient(135deg,${NAVY},#0F2140)`,
            borderRadius:16, padding:16, textAlign:'center', marginTop:8 }}>
            <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:'0 0 4px' }}>
              📚 {stats.incorrect} questions waiting in your Practice Queue
            </p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'0 0 12px' }}>
              Practice them in TestLauncher to close your weak areas before the next tournament.
            </p>
            <button onClick={() => navigate('/tests')}
              style={{ padding:'10px 24px', background:GOLD, color:NAVY, border:'none',
                borderRadius:10, fontWeight:800, fontSize:13, cursor:'pointer' }}>
              Start Practice →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}