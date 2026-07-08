// src/pages/student/StudentReview.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { spacedRepetition } from '../../lib/spacedRepetition'

export default function StudentReview() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    spacedRepetition.getDueReviews(user.id, { limit: 30 })
      .then(data => setItems(data))
      .finally(() => setLoading(false))
  }, [user?.id])

  const current = items[idx]

  const handleSelect = async (optIdx) => {
    if (selected !== null || !current) return
    setSelected(optIdx)
    setShowResult(true)
    const wasCorrect = optIdx === current.item_snapshot?.correct
    await spacedRepetition.recordReview(
      user.id, current.item_type, current.item_id, wasCorrect, current.item_snapshot
    )
    setReviewedCount(n => n + 1)
  }

  const handleNext = () => {
    setSelected(null)
    setShowResult(false)
    setIdx(i => i + 1)
  }

  if (loading) {
    return (
      <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:m,fontFamily:'Poppins,sans-serif'}}>Loading your reviews...</p>
      </div>
    )
  }

  if (items.length === 0 || idx >= items.length) {
    return (
      <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'Poppins,sans-serif'}}>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:32,maxWidth:380,textAlign:'center'}}>
          <p style={{fontSize:40,marginBottom:10}}>{items.length === 0 ? '🎉' : '✅'}</p>
          <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 6px'}}>
            {items.length === 0 ? 'Nothing due right now!' : 'Review complete!'}
          </p>
          <p style={{color:m,fontSize:13,margin:'0 0 20px'}}>
            {items.length === 0
              ? 'Come back later - questions you\'ve gotten wrong will resurface here right when you\'re about to forget them.'
              : `You reviewed ${reviewedCount} question${reviewedCount!==1?'s':''}. Great work!`}
          </p>
          <button onClick={()=>nav('/student')}
            style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
              padding:'12px 24px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const q = current.item_snapshot
  if (!q) { handleNext(); return null }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Exit</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:16,fontWeight:800,margin:0}}>🔁 Review</h1>
          <p style={{color:m,fontSize:11,margin:0}}>{idx+1} of {items.length}</p>
        </div>
      </div>

      <div style={{padding:20,maxWidth:560,margin:'0 auto'}}>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:18,padding:20}}>
          <p style={{color:m,fontSize:11,marginBottom:10}}>
            {current.repetitions > 0 ? `You've seen this ${current.repetitions} time${current.repetitions!==1?'s':''} before` : 'First time seeing this again'}
          </p>
          <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 16px',lineHeight:1.6}}>{q.question}</p>

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {(q.options || []).map((opt, i) => {
              let borderColor = b, bgColor = 'transparent'
              if (showResult) {
                if (i === q.correct) { borderColor = '#22C55E'; bgColor = '#22C55E15' }
                else if (i === selected) { borderColor = '#DC2626'; bgColor = '#DC262615' }
              }
              return (
                <button key={i} onClick={()=>handleSelect(i)} disabled={selected !== null}
                  style={{textAlign:'left',padding:'12px 16px',borderRadius:12,
                    border:`1.5px solid ${borderColor}`,background:bgColor,
                    color:t,fontSize:13,cursor:selected===null?'pointer':'default'}}>
                  {opt}
                </button>
              )
            })}
          </div>

          {showResult && q.micro_explanation && (
            <div style={{background:`${p}08`,borderRadius:12,padding:12,marginTop:14}}>
              <p style={{color:p,fontSize:12,margin:0,lineHeight:1.6}}>{q.micro_explanation}</p>
            </div>
          )}

          {showResult && (
            <button onClick={handleNext}
              style={{width:'100%',marginTop:16,background:`linear-gradient(135deg,${p},${a})`,
                border:'none',borderRadius:12,padding:'12px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              {idx === items.length - 1 ? 'Finish Review' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
