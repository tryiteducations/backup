// src/pages/mentor/MentorDoubts.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { doubtSystem } from '../../lib/dataInterconnect'

function timeAgo(iso) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function MentorDoubts() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [doubts, setDoubts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [answer, setAnswer] = useState('')
  const [filter, setFilter] = useState('pending')
  const [busyId, setBusyId] = useState(null)
  const [answerFile, setAnswerFile] = useState(null)
  const [uploadingAnswer, setUploadingAnswer] = useState(false)

  const loadDoubts = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const mine = await doubtSystem.getDoubts(user.id, 'mentor')
      const { data: openPool } = await supabase
        .from('doubts').select('*')
        .eq('status', 'open').is('assigned_mentor_id', null)
        .order('posted_at', { ascending: false })
      const merged = [...(mine || []), ...(openPool || [])]
      const dedup = Array.from(new Map(merged.map(d => [d.id, d])).values())
      setDoubts(dedup)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDoubts() }, [user?.id])

  const claimAndAnswer = async (doubtId) => {
    setSelected(doubtId)
  }

  const submitAnswer = async (id) => {
    if (!answer.trim() || !user?.id) return
    setBusyId(id)
    try {
      const doubt = doubts.find(d => d.id === id)
      if (doubt && !doubt.assigned_mentor_id) {
        await doubtSystem.assignDoubt(id, user.id)
      }
      let attachmentUrl = null
      if (answerFile) {
        setUploadingAnswer(true)
        const path = `doubt-answers/${user.id}/${Date.now()}_${answerFile.name}`
        const { error: upErr } = await supabase.storage.from('user-content').upload(path, answerFile)
        if (!upErr) {
          const { data } = supabase.storage.from('user-content').getPublicUrl(path)
          attachmentUrl = data.publicUrl
        }
        setUploadingAnswer(false)
      }
      await doubtSystem.resolveDoubt(id, answer.trim(), attachmentUrl)
      setSelected(null)
      setAnswer('')
      setAnswerFile(null)
      await loadDoubts()
    } finally {
      setBusyId(null)
    }
  }

  const filtered = doubts.filter(d => {
    if (filter === 'all') return true
    if (filter === 'answered') return d.status === 'resolved'
    return d.status !== 'resolved'
  })

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif',display:'flex'}}>

      {/* Back nav */}
      <div style={{position:'fixed',top:0,left:0,right:0,background:c,
        borderBottom:'1px solid '+b,padding:'14px 20px',zIndex:10,
        display:'flex',alignItems:'center',gap:12}}>
        <button onClick={()=>nav('/mentor-hub')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'6px 14px',
          color:m,fontSize:13,cursor:'pointer',fontWeight:600}}>← Back</button>
        <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>💬 Student Doubts</h1>
        <span style={{background:'#EF444420',color:'#EF4444',fontSize:12,fontWeight:700,
          padding:'3px 10px',borderRadius:20,marginLeft:'auto'}}>
          {doubts.filter(d=>d.status!=='resolved').length} pending
        </span>
      </div>

      <div style={{marginTop:64,padding:'20px',maxWidth:800,margin:'64px auto 0',width:'100%'}}>

        {/* Filter */}
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {['pending','answered','all'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:'7px 18px',borderRadius:20,border:'none',cursor:'pointer',
                fontSize:12,fontWeight:700,transition:'all 0.2s',
                background:filter===f?'linear-gradient(135deg,'+p+','+a+')':'transparent',
                color:filter===f?'#fff':m}}>
              {f==='pending'?'⏳ Pending':f==='answered'?'✅ Answered':'📋 All'}
            </button>
          ))}
        </div>

        {loading && <p style={{textAlign:'center',color:m,fontSize:13,padding:20}}>Loading doubts...</p>}
        {!loading && filtered.length===0 && (
          <p style={{textAlign:'center',color:m,fontSize:13,padding:30}}>
            No doubts here right now - check back soon or switch filters.
          </p>
        )}

        {/* Doubt cards */}
        {!loading && filtered.map(d=>(
          <div key={d.id} style={{background:c,border:'1.5px solid '+(selected===d.id?a:b),
            borderRadius:18,padding:'18px',marginBottom:12,
            boxShadow:'0 2px 12px rgba(0,0,0,0.05)',transition:'all 0.2s'}}>

            <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
              <span style={{background:p+'12',color:p,fontSize:9,fontWeight:700,
                padding:'3px 10px',borderRadius:20}}>{d.exam_id}</span>
              <span style={{background:a+'15',color:a,fontSize:9,fontWeight:700,
                padding:'3px 10px',borderRadius:20}}>{d.subject}</span>
              <span style={{marginLeft:'auto',color:m,fontSize:10}}>{timeAgo(d.posted_at)}</span>
              <span style={{background:d.status==='resolved'?'#22C55E15':'#F59E0B15',
                color:d.status==='resolved'?'#22C55E':'#F59E0B',
                fontSize:9,fontWeight:700,padding:'3px 10px',borderRadius:20}}>
                {d.status==='resolved'?'✓ Answered':d.assigned_mentor_id?'👨‍🏫 Assigned to you':'⏳ Open'}
              </span>
            </div>

            <p style={{color:t,fontWeight:700,fontSize:14,margin:'0 0 6px'}}>{d.topic}</p>
            <p style={{color:m,fontSize:12,margin:'0 0 10px',lineHeight:1.6}}>{d.question}</p>

            {d.images?.length > 0 && (
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
                {d.images.map((url,i) => (
                  url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                    ? <img key={i} src={url} alt="" style={{width:60,height:60,objectFit:'cover',borderRadius:8,border:'1px solid '+b}}/>
                    : <a key={i} href={url} target="_blank" rel="noreferrer"
                        style={{fontSize:11,color:p,background:p+'10',padding:'6px 10px',borderRadius:8,textDecoration:'none'}}>
                        📎 Attachment {i+1}
                      </a>
                ))}
              </div>
            )}

            {d.status === 'resolved' && d.solution && (
              <div style={{background:p+'08',border:'1px solid '+p+'20',
                borderRadius:12,padding:'12px',marginBottom:10}}>
                <p style={{color:p,fontWeight:700,fontSize:11,margin:'0 0 6px'}}>
                  Your Answer:
                </p>
                <p style={{color:t,fontSize:13,margin:0,lineHeight:1.6}}>
                  {d.solution}
                </p>
                {d.video_url && (
                  <a href={d.video_url} target="_blank" rel="noreferrer"
                    style={{display:'inline-block',marginTop:8,color:p,fontSize:12,fontWeight:600}}>
                    📎 View attached file
                  </a>
                )}
              </div>
            )}

            {d.status !== 'resolved' && (
              selected === d.id ? (
                <div>
                  <textarea value={answer} onChange={e=>setAnswer(e.target.value)}
                    placeholder="Type a clear, helpful answer... Avoid sugarcoating - accuracy matters more than flattery."
                    rows={4}
                    style={{width:'100%',padding:'12px',borderRadius:12,
                      border:'1.5px solid '+a,background:bg,color:t,
                      fontSize:13,outline:'none',resize:'vertical',
                      fontFamily:'Poppins,sans-serif',boxSizing:'border-box',
                      lineHeight:1.6,marginBottom:10}}/>
                  <label style={{display:'inline-flex',alignItems:'center',gap:6,
                    padding:'7px 12px',borderRadius:10,border:'1px solid '+b,
                    cursor:'pointer',fontSize:11,fontWeight:600,color:m,marginBottom:10}}>
                    📎 {answerFile ? answerFile.name : 'Attach a diagram or worked solution (optional)'}
                    <input type="file" accept="image/*,.pdf" hidden onChange={e=>setAnswerFile(e.target.files?.[0]||null)}/>
                  </label>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>submitAnswer(d.id)}
                      disabled={!answer.trim()||busyId===d.id}
                      style={{flex:1,background:answer.trim()
                        ?'linear-gradient(135deg,'+p+','+a+')':b,
                        border:'none',borderRadius:12,padding:'10px',
                        color:answer.trim()?'#fff':m,fontWeight:700,
                        fontSize:13,cursor:busyId===d.id?'wait':'pointer'}}>
                      {busyId===d.id ? (uploadingAnswer ? 'Uploading...' : 'Saving...') : '✅ Submit Answer'}
                    </button>
                    <button onClick={()=>{setSelected(null);setAnswer('')}}
                      style={{background:'transparent',border:'1px solid '+b,
                        borderRadius:12,padding:'10px 16px',color:m,
                        fontWeight:600,fontSize:12,cursor:'pointer'}}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={()=>claimAndAnswer(d.id)}
                  style={{background:'linear-gradient(135deg,'+p+','+a+')',
                    border:'none',borderRadius:12,padding:'10px 20px',
                    color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
                  {d.assigned_mentor_id ? 'Answer This Doubt →' : 'Claim & Answer →'}
                </button>
              )
            )}
          </div>
        ))}
        <div style={{height:40}}/>
      </div>
    </div>
  )
}
