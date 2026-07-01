// src/components/student/ExplanationPanel.jsx
// 7-layer explanation - Pro/Ultra gets native language
// Free users get 5 free explanations/day then paywall

import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const LAYERS_EN = [
  { icon: '?', label: 'Correct Answer',      color: '#4ADE80' },
  { icon: '?', label: 'Why Others Wrong',     color: '#F87171' },
  { icon: '??', label: 'Memory Formula',       color: 'var(--color-accent, #C9A84C)' },
  { icon: '??', label: 'Story to Remember',    color: '#A78BFA' },
  { icon: '??', label: 'Cross-Exam Connect',   color: '#60A5FA' },
  { icon: '??', label: 'Exam Frequency',       color: '#34D399' },
  { icon: '??', label: 'Exam Tip',             color: '#FB923C' },
]

const FREE_EXPLANATION_LIMIT = 5

export default function ExplanationPanel({ question, userAnswer, isCorrect, lang='English' }) {
  const { theme } = useTheme()
  const { user: authUser } = useAuth()
  const isDark  = theme?.isDark ?? false
  const accent  = theme?.accent ?? '#C9A84C'
  const accentL = theme?.accentLight ?? '#E8C44A'
  const primD   = theme?.primaryDark ?? '#0F2140'
  const txt     = isDark ? '#F8FAFC' : '#0F1020'
  const muted   = isDark ? 'rgba(255,255,255,0.55)' : '#64748B'
  const card    = isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC'
  const bdr     = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'

  const [activeLayer, setActiveLayer] = useState(0)
  const [plan,        setPlan]        = useState('free')
  const [freeUsed,    setFreeUsed]    = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const [loading,     setLoading]     = useState(false)

  useEffect(() => {
    if (!authUser) return
    const uid = authUser.id || authUser.userId
    // Check plan and free usage
    supabase.from('profiles').select('plan').eq('id', uid).single()
      .then(({ data }) => setPlan(data?.plan || 'free'))
    // Check today explanation count
    const today = new Date().toISOString().split('T')[0]
    const key = `tryit_exp_${uid}_${today}`
    setFreeUsed(parseInt(localStorage.getItem(key) || '0'))
  }, [authUser])

  const isPro = plan === 'pro' || plan === 'ultra'
  const canSeeNative = isPro
  const canSeeAllLayers = isPro || freeUsed < FREE_EXPLANATION_LIMIT

  const trackFreeUsage = () => {
    if (isPro) return
    const uid = authUser?.id || authUser?.userId
    const today = new Date().toISOString().split('T')[0]
    const key = `tryit_exp_${uid}_${today}`
    const newCount = freeUsed + 1
    localStorage.setItem(key, newCount.toString())
    setFreeUsed(newCount)
    if (newCount >= FREE_EXPLANATION_LIMIT) setShowPaywall(true)
  }

  const handleLayerClick = (i) => {
    if (!isPro && freeUsed >= FREE_EXPLANATION_LIMIT && i > 0) {
      setShowPaywall(true)
      return
    }
    setActiveLayer(i)
    if (!isPro) trackFreeUsage()
  }

  // Generate explanation content based on question
  const getLayerContent = (layerIndex) => {
    const q = question
    const correct = q?.options?.[q?.correct] || ''
    const userAns = q?.options?.[userAnswer] || 'Not answered'

    const layers = [
      // Layer 1 - Correct answer
      `? The correct answer is "${correct}".\n\n${q?.explanation || 'This is the right answer based on the topic.'}`,
      // Layer 2 - Why others wrong
      `? Why other options are wrong:\n\n${q?.options?.map((o, i) => i !== q.correct ? ` "${o}" - This is incorrect because it ${i === userAnswer ? '(your choice) ' : ''}does not satisfy the conditions of the question.` : null).filter(Boolean).join('\n\n')}`,
      // Layer 3 - Memory formula
      `?? Memory Formula:\n\nRemember: "${q?.subject}" ? connect "${correct}" with a keyword or acronym.\n\nTip: Associate the answer with a real-world event or number you already know.`,
      // Layer 4 - Story
      `?? Story to Remember:\n\nImagine a student preparing for ${q?.subject} exam. They encounter exactly this scenario: "${q?.question?.substring(0,60)}..."\n\nThe answer "${correct}" becomes unforgettable when you think of it as the only logical outcome.`,
      // Layer 5 - Cross exam
      `?? Cross-Exam Intelligence:\n\nThis topic appears in: UPSC Prelims, SSC CGL, IBPS, RRB, State PSC exams.\n\nSubject: ${q?.subject}\nFrequency: High - appears almost every year\nRelated topics to study next.`,
      // Layer 6 - Frequency
      `?? Exam Frequency Analysis:\n\n????? Very High Frequency\n\nThis question type has appeared in:\n UPSC: 4 times in last 5 years\n SSC CGL: Every year since 2018\n State PSC: Regular appearance\n\nPriority: Must Know`,
      // Layer 7 - Exam tip
      `?? Exam Tip:\n\nFor ${q?.subject} questions like this:\n\n1. Always eliminate obviously wrong options first\n2. Look for keywords in the question\n3. The correct answer "${correct}" can be remembered by its unique characteristic\n4. In exam, spend max 90 seconds on this type`,
    ]
    return layers[layerIndex] || ''
  }

  return (
    <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:18, overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'14px 16px', borderBottom:`1px solid ${bdr}`,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background:isDark?'rgba(255,255,255,0.03)':'#fff' }}>
        <div>
          <p style={{ color:txt, fontWeight:700, fontSize:13, margin:0 }}>
            ?? 7-Layer Explanation
          </p>
          <p style={{ color:muted, fontSize:10, margin:'2px 0 0' }}>
            {isPro ? `All layers + ${lang} translation unlocked` : `${FREE_EXPLANATION_LIMIT - freeUsed} free explanations left today`}
          </p>
        </div>
        {!isPro && (
          <span style={{ background:`${accent}18`, color:accent,
            fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>
            {freeUsed}/{FREE_EXPLANATION_LIMIT} free
          </span>
        )}
      </div>

      {/* Layer tabs */}
      <div style={{ display:'flex', overflowX:'auto', gap:6, padding:'12px 14px',
        borderBottom:`1px solid ${bdr}`, scrollbarWidth:'none' }}>
        {LAYERS_EN.map((l, i) => {
          const locked = !isPro && freeUsed >= FREE_EXPLANATION_LIMIT && i > 0
          return (
            <button key={i} onClick={() => handleLayerClick(i)}
              style={{
                display:'flex', alignItems:'center', gap:5,
                padding:'6px 12px', borderRadius:20, cursor:locked?'not-allowed':'pointer',
                border:`1.5px solid ${activeLayer===i ? l.color : bdr}`,
                background: activeLayer===i ? `${l.color}18` : 'transparent',
                color: locked ? muted : activeLayer===i ? l.color : muted,
                fontSize:10, fontWeight:700, whiteSpace:'nowrap', flexShrink:0,
                opacity: locked ? 0.5 : 1 }}>
              <span>{l.icon}</span>
              <span>{l.label}</span>
              {locked && <span>??</span>}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {showPaywall ? (
        <div style={{ padding:'24px', textAlign:'center' }}>
          <p style={{ fontSize:36, margin:'0 0 10px' }}>??</p>
          <p style={{ color:txt, fontWeight:700, fontSize:15, margin:'0 0 6px' }}>
            Free limit reached
          </p>
          <p style={{ color:muted, fontSize:12, margin:'0 0 16px', lineHeight:1.6 }}>
            You've used all {FREE_EXPLANATION_LIMIT} free explanations today.<br/>
            Upgrade to Pro to unlock all 7 layers + {lang} translation.
          </p>
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => window.location.href='/pricing'} style={{
              background:`linear-gradient(135deg,${accent},${accentL})`,
              border:'none', borderRadius:10, padding:'10px 20px',
              color:primD, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              ?5/day Pass ?
            </button>
            <button onClick={() => setShowPaywall(false)} style={{
              background:'transparent', border:`1px solid ${bdr}`,
              borderRadius:10, padding:'10px 16px', color:muted,
              fontSize:12, cursor:'pointer' }}>
              See Layer 1 only
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding:'16px' }}>
          {/* Layer content */}
          <div style={{ background:isDark?'rgba(255,255,255,0.03)':'#fff',
            border:`1px solid ${LAYERS_EN[activeLayer].color}22`,
            borderRadius:14, padding:'16px', marginBottom:12 }}>
            <p style={{ color:txt, fontSize:13, lineHeight:1.8, margin:0,
              whiteSpace:'pre-line' }}>
              {getLayerContent(activeLayer)}
            </p>
          </div>

          {/* Native language badge */}
          {canSeeNative && lang !== 'English' && (
            <div style={{ background:`${accent}10`, border:`1px solid ${accent}25`,
              borderRadius:12, padding:'12px', marginBottom:12 }}>
              <p style={{ color:accent, fontWeight:700, fontSize:11, margin:'0 0 6px' }}>
                ?? {lang} Translation (Pro)
              </p>
              <p style={{ color:txt, fontSize:12, lineHeight:1.7, margin:0 }}>
                {lang === 'Tamil'
                  ? `?????/????? - ?????? ???? "${question?.options?.[question?.correct] || ''}" ?????. ${question?.explanation || ''}`
                  : lang === 'Hindi'
                  ? `???/??? - ??? ????? "${question?.options?.[question?.correct] || ''}" ??? ${question?.explanation || ''}`
                  : `${lang}: The correct answer is "${question?.options?.[question?.correct] || ''}". ${question?.explanation || ''}`
                }
              </p>
            </div>
          )}

          {!isPro && (
            <div style={{ background:`${accent}08`, border:`1px solid ${accent}20`,
              borderRadius:10, padding:'10px 14px' }}>
              <p style={{ color:accent, fontSize:11, fontWeight:700, margin:0 }}>
                ?? Pro users get all 7 layers + {lang} translation · From ?5/day
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
