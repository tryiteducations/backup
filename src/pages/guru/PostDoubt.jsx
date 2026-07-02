// src/pages/guru/PostDoubt.jsx - Premium standalone
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const EXAMS = [
  'UPSC CSE','UPSC CDS','SSC CGL','SSC CHSL','SSC MTS',
  'IBPS PO','IBPS Clerk','SBI PO','SBI Clerk',
  'RBI Grade B','TNPSC Group 1','TNPSC Group 2','TNPSC Group 4',
  'RRB NTPC','RRB Group D','NDA','CDS','NEET UG','JEE Main','GATE',
]
const SUBJECTS = [
  'Maths','Reasoning','English','GK / GS','Science',
  'History','Geography','Polity','Economics',
  'Current Affairs','Physics','Chemistry','Biology','Computer Science','Other',
]

export default function PostDoubt() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F'
  const a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B'
  const m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC'
  const c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'
  const isDark = theme?.isDark||false

  const [exam, setExam] = useState('')
  const [subject, setSubject] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // Attachments
  const [images, setImages] = useState([])       // [{file, url}]
  const [pdf, setPdf] = useState(null)            // {file, name}
  const [voiceBlob, setVoiceBlob] = useState(null) // {url, duration}
  const [video, setVideo] = useState(null)         // {file, url, name}
  const [recording, setRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const mediaRecorderRef = useState({ current: null })[0]
  const recordTimerRef = useState({ current: null })[0]
  const chunksRef = useState({ current: [] })[0]

  const MAX_IMAGES = 5

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_IMAGES - images.length)
    const newImages = files.map(file => ({ file, url: URL.createObjectURL(file) }))
    setImages(prev => [...prev, ...newImages].slice(0, MAX_IMAGES))
    e.target.value = ''
  }

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const handlePdfSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) setPdf({ file, name: file.name })
    e.target.value = ''
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setVoiceBlob({ url: URL.createObjectURL(blob), duration: recordSeconds })
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
      setRecordSeconds(0)
      recordTimerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000)
    } catch {
      alert('Microphone access denied or unavailable.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    clearInterval(recordTimerRef.current)
    setRecording(false)
  }

  const removeVoice = () => setVoiceBlob(null)

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) setVideo({ file, url: URL.createObjectURL(file), name: file.name })
    e.target.value = ''
  }

  const removeVideo = () => setVideo(null)

  const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  const submit = async () => {
    if (!exam || !subject || !title.trim()) return
    setSubmitting(true)
    // TODO: once Supabase Storage is wired, upload images[].file, pdf.file, and voiceBlob here
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setDone(true)
  }

  const inputStyle = {
    width:'100%', padding:'12px 14px', borderRadius:12,
    border:'1.5px solid '+b, background:isDark?'rgba(255,255,255,0.05)':c,
    color:t, fontSize:14, outline:'none', fontFamily:'Poppins,sans-serif',
    boxSizing:'border-box', transition:'border-color 0.2s',
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>

      {/* Header */}
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10,
        boxShadow:'0 1px 12px rgba(0,0,0,0.06)'}}>
        <button onClick={()=>nav('/student/guruhub')}
          style={{background:'transparent',border:'1px solid '+b,borderRadius:10,
            padding:'7px 16px',color:m,fontSize:13,cursor:'pointer',fontWeight:600}}>
          Back
        </button>
        <div>
          <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>Post a Doubt</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Well-framed doubts get faster answers</p>
        </div>
      </div>

      <div style={{padding:'24px 20px',maxWidth:640,margin:'0 auto'}}>

        {done ? (
          <div style={{textAlign:'center',padding:'48px 24px'}}>
            <div style={{fontSize:64,marginBottom:16}}>✅</div>
            <h2 style={{color:t,fontWeight:800,fontSize:22,margin:'0 0 8px'}}>Doubt Posted!</h2>
            <p style={{color:m,fontSize:14,margin:'0 0 24px'}}>
              Mentors will answer within 2 hours
            </p>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <button onClick={()=>{setDone(false);setTitle('');setDesc('');setExam('');setSubject('');setImages([]);setPdf(null);setVoiceBlob(null)}}
                style={{background:'transparent',border:'1px solid '+b,borderRadius:14,
                  padding:'12px 24px',color:m,fontWeight:700,fontSize:13,cursor:'pointer'}}>
                Post Another
              </button>
              <button onClick={()=>nav('/guru-hub/my-doubts')}
                style={{background:'linear-gradient(135deg,'+p+','+a+')',border:'none',
                  borderRadius:14,padding:'12px 24px',color:'#fff',fontWeight:700,
                  fontSize:13,cursor:'pointer'}}>
                View My Doubts
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Exam selector */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
                Select Exam *
              </label>
              <select value={exam} onChange={e=>setExam(e.target.value)}
                style={{...inputStyle,cursor:'pointer',
                  border:'1.5px solid '+(exam?a:b)}}>
                <option value="">- Choose your exam -</option>
                {EXAMS.map(e=><option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Subject pills */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:10}}>
                Subject *
              </label>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {SUBJECTS.map(s=>(
                  <button key={s} onClick={()=>setSubject(s)}
                    style={{padding:'7px 14px',borderRadius:20,border:'1.5px solid',
                      cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.15s',
                      borderColor:subject===s?a:b,
                      background:subject===s?a+'15':isDark?'rgba(255,255,255,0.05)':c,
                      color:subject===s?a:m}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{marginBottom:16}}>
              <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
                Doubt Title *
              </label>
              <input value={title} onChange={e=>setTitle(e.target.value)}
                placeholder="State the core question in one sentence"
                style={{...inputStyle,borderColor:title?a:b}}
                onFocus={e=>e.target.style.borderColor=a}
                onBlur={e=>e.target.style.borderColor=title?a:b}/>
            </div>

            {/* Description */}
            <div style={{marginBottom:24}}>
              <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
                Detailed Description
              </label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)}
                placeholder="Share what you already know, what is confusing you, and where you got stuck..."
                rows={4}
                style={{...inputStyle,resize:'vertical',lineHeight:1.6}}
                onFocus={e=>e.target.style.borderColor=a}
                onBlur={e=>e.target.style.borderColor=b}/>
            </div>

            {/* Attachments */}
            <div style={{marginBottom:24}}>
              <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:10}}>
                Attach (optional)
              </label>

              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
                <label style={{display:'flex',alignItems:'center',gap:6,padding:'9px 14px',
                  borderRadius:12,border:'1.5px solid '+b,cursor:images.length>=MAX_IMAGES?'not-allowed':'pointer',
                  fontSize:12,fontWeight:700,color:m,opacity:images.length>=MAX_IMAGES?0.5:1,
                  background:isDark?'rgba(255,255,255,0.05)':c}}>
                  📷 Add Photos ({images.length}/{MAX_IMAGES})
                  <input type="file" accept="image/*" multiple hidden
                    disabled={images.length>=MAX_IMAGES}
                    onChange={handleImageSelect}/>
                </label>

                <label style={{display:'flex',alignItems:'center',gap:6,padding:'9px 14px',
                  borderRadius:12,border:'1.5px solid '+b,cursor:pdf?'not-allowed':'pointer',
                  fontSize:12,fontWeight:700,color:m,opacity:pdf?0.5:1,
                  background:isDark?'rgba(255,255,255,0.05)':c}}>
                  📄 Add PDF
                  <input type="file" accept="application/pdf" hidden
                    disabled={!!pdf}
                    onChange={handlePdfSelect}/>
                </label>

                {!voiceBlob && !recording && (
                  <button onClick={startRecording}
                    style={{display:'flex',alignItems:'center',gap:6,padding:'9px 14px',
                      borderRadius:12,border:'1.5px solid '+b,cursor:'pointer',
                      fontSize:12,fontWeight:700,color:m,background:isDark?'rgba(255,255,255,0.05)':c}}>
                    🎤 Record Voice Note
                  </button>
                )}
                {recording && (
                  <button onClick={stopRecording}
                    style={{display:'flex',alignItems:'center',gap:6,padding:'9px 14px',
                      borderRadius:12,border:'1.5px solid #EF4444',cursor:'pointer',
                      fontSize:12,fontWeight:700,color:'#EF4444',background:'#EF444415'}}>
                    ⏺ Stop Recording ({fmtTime(recordSeconds)})
                  </button>
                )}

                <label style={{display:'flex',alignItems:'center',gap:6,padding:'9px 14px',
                  borderRadius:12,border:'1.5px solid '+b,cursor:video?'not-allowed':'pointer',
                  fontSize:12,fontWeight:700,color:m,opacity:video?0.5:1,
                  background:isDark?'rgba(255,255,255,0.05)':c}}>
                  🎬 Add Video
                  <input type="file" accept="video/*" hidden
                    disabled={!!video}
                    onChange={handleVideoSelect}/>
                </label>
              </div>

              {/* Image previews */}
              {images.length > 0 && (
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
                  {images.map((img, i) => (
                    <div key={i} style={{position:'relative',width:64,height:64}}>
                      <img src={img.url} alt=""
                        style={{width:64,height:64,objectFit:'cover',borderRadius:10,border:'1px solid '+b}}/>
                      <button onClick={()=>removeImage(i)}
                        style={{position:'absolute',top:-6,right:-6,width:20,height:20,
                          borderRadius:'50%',background:'#EF4444',color:'#fff',border:'2px solid '+c,
                          fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
                          lineHeight:1,padding:0}}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* PDF preview */}
              {pdf && (
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',
                  borderRadius:10,border:'1px solid '+b,marginBottom:12,
                  background:isDark?'rgba(255,255,255,0.05)':c}}>
                  <span style={{fontSize:16}}>📄</span>
                  <span style={{flex:1,color:t,fontSize:12,fontWeight:600,
                    overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{pdf.name}</span>
                  <button onClick={()=>setPdf(null)}
                    style={{background:'transparent',border:'none',color:'#EF4444',
                      cursor:'pointer',fontSize:16,padding:0}}>×</button>
                </div>
              )}

              {/* Voice note preview */}
              {voiceBlob && (
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',
                  borderRadius:10,border:'1px solid '+b,marginBottom:12,
                  background:isDark?'rgba(255,255,255,0.05)':c}}>
                  <span style={{fontSize:16}}>🎤</span>
                  <audio controls src={voiceBlob.url} style={{flex:1,height:32}}/>
                  <button onClick={removeVoice}
                    style={{background:'transparent',border:'none',color:'#EF4444',
                      cursor:'pointer',fontSize:16,padding:0}}>×</button>
                </div>
              )}

              {/* Video preview */}
              {video && (
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',
                  borderRadius:10,border:'1px solid '+b,marginBottom:12,
                  background:isDark?'rgba(255,255,255,0.05)':c}}>
                  <span style={{fontSize:16}}>🎬</span>
                  <span style={{flex:1,color:t,fontSize:12,fontWeight:600,
                    overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{video.name}</span>
                  <button onClick={removeVideo}
                    style={{background:'transparent',border:'none',color:'#EF4444',
                      cursor:'pointer',fontSize:16,padding:0}}>×</button>
                </div>
              )}
            </div>

            {/* Tip */}
            <div style={{background:a+'12',border:'1px solid '+a+'30',borderRadius:12,
              padding:'12px 16px',marginBottom:20}}>
              <p style={{color:a,fontSize:12,fontWeight:700,margin:'0 0 2px'}}>
                Tip for better answers
              </p>
              <p style={{color:m,fontSize:11,margin:0,lineHeight:1.6}}>
                Include what you already tried, the exact concept confusing you,
                and which step in the solution you are stuck at.
              </p>
            </div>

            {/* Submit */}
            <button onClick={submit}
              disabled={!exam||!subject||!title.trim()||submitting}
              style={{width:'100%',
                background:(!exam||!subject||!title.trim())
                  ?b
                  :'linear-gradient(135deg,'+p+','+a+')',
                border:'none',borderRadius:16,padding:'16px',
                color:(!exam||!subject||!title.trim())?m:'#fff',
                fontWeight:800,fontSize:15,cursor:(!exam||!subject||!title.trim())?'not-allowed':'pointer',
                transition:'all 0.2s',opacity:submitting?0.7:1}}>
              {submitting ? 'Posting...' : 'Post Doubt'}
            </button>

            <div style={{height:80}}/>
          </>
        )}
      </div>
    </div>
  )
}
