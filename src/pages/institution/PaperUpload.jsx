// src/pages/institution/PaperUpload.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { testEnrollment } from '../../lib/testEnrollment'
import { paperExtraction } from '../../lib/paperExtraction'

const CONFIDENCE_STYLE = {
  high: { label: 'Looks clean', color: '#22C55E' },
  medium: { label: 'Please check', color: '#F59E0B' },
  needs_review: { label: 'Needs review', color: '#DC2626' },
}

export default function PaperUpload() {
  const { testId } = useParams()
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const [phase, setPhase] = useState('upload') // upload | extracting | review | publishing | done
  const [progressMsg, setProgressMsg] = useState('')
  const [warning, setWarning] = useState('')
  const [candidates, setCandidates] = useState([])
  const [paperUploadId, setPaperUploadId] = useState(null)
  const [error, setError] = useState('')

  const downloadTemplate = async () => {
    const XLSX = await import('xlsx')
    const sample = [
      { Question: 'What is the capital of India?', 'Option A': 'Mumbai', 'Option B': 'New Delhi', 'Option C': 'Kolkata', 'Option D': 'Chennai', 'Correct Answer': 'B', Marks: 1 },
      { Question: 'Which article guarantees Right to Equality?', 'Option A': 'Article 12', 'Option B': 'Article 14', 'Option C': 'Article 19', 'Option D': 'Article 21', 'Correct Answer': 'B', Marks: 2 },
    ]
    const ws = XLSX.utils.json_to_sheet(sample)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Questions')
    XLSX.writeFile(wb, 'TryIT_Question_Template.xlsx')
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    setError('')
    setPhase('extracting')
    try {
      setProgressMsg('Uploading file...')
      const upload = await testEnrollment.uploadPaper(user.id, testId, file)
      setPaperUploadId(upload.id)

      const extracted = await paperExtraction.extractFromFile(file, setProgressMsg)
      if (extracted.warning) setWarning(extracted.warning)

      let found
      if (extracted.candidates) {
        // Spreadsheet path - rows are already structured questions, no splitting needed
        found = extracted.candidates
      } else {
        setProgressMsg('Splitting into questions...')
        found = paperExtraction.splitIntoQuestions(extracted.text)
      }

      if (found.length === 0) {
        setError('Could not find any questions in this file. Try a clearer scan, or add questions manually instead.')
        setPhase('upload')
        return
      }
      await testEnrollment.saveExtractedQuestions(upload.id, found)
      setCandidates(found)
      setPhase('review')
    } catch (e) {
      setError(e.message || 'Something went wrong reading this file.')
      setPhase('upload')
    }
  }

  const updateCandidate = (idx, field, value) => {
    setCandidates(prev => prev.map((c,i) => i===idx ? {...c, [field]: value} : c))
  }
  const updateOption = (idx, optLabel, value) => {
    setCandidates(prev => prev.map((c,i) => i===idx
      ? {...c, options: c.options.map(o => o.label===optLabel ? {...o, text:value} : o)}
      : c))
  }
  const removeCandidate = (idx) => {
    setCandidates(prev => prev.filter((_,i) => i!==idx))
  }

  const publish = async () => {
    setPhase('publishing')
    const ok = await testEnrollment.publishReviewedQuestions(paperUploadId, testId, candidates)
    if (ok) setPhase('done')
    else { setError('Could not publish - please try again.'); setPhase('review') }
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/institution/tests')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>📄 Upload Question Paper</h1>
      </div>

      <div style={{padding:20,maxWidth:700,margin:'0 auto'}}>

        {phase === 'upload' && (
          <div style={{background:c,border:`2px dashed ${b}`,borderRadius:20,padding:40,textAlign:'center'}}>
            <p style={{fontSize:40,marginBottom:12}}>📄</p>
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 6px'}}>Upload your question paper</p>
            <p style={{color:m,fontSize:12,margin:'0 0 8px'}}>
              Supports PDF, Word (.docx), Excel (.xlsx), and images (scanned/photographed pages).
            </p>
            <p style={{color:m,fontSize:11,margin:'0 0 20px',lineHeight:1.6}}>
              💡 <strong>Excel is the most accurate option</strong> - one row per question (Question, Option A-D, Correct Answer, Marks) with no scanning guesswork at all.<br/>
              📄 Have this in <strong>Google Docs</strong>? Use File → Download → Word (.docx) or PDF first, then upload that file here.
            </p>
            {error && <p style={{color:'#DC2626',fontSize:12,marginBottom:14}}>{error}</p>}
            <label style={{display:'inline-block',background:`linear-gradient(135deg,${p},${a})`,
              borderRadius:12,padding:'12px 28px',color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer'}}>
              Choose File
              <input type="file" accept=".pdf,.docx,.xlsx,.xls,image/*" hidden onChange={handleFile}/>
            </label>
            <div style={{marginTop:14}}>
              <button onClick={downloadTemplate}
                style={{background:'transparent',border:`1px solid ${b}`,borderRadius:10,
                  padding:'8px 16px',color:m,fontWeight:600,fontSize:12,cursor:'pointer'}}>
                📥 Download Excel Template
              </button>
            </div>
          </div>
        )}

        {phase === 'extracting' && (
          <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:40,textAlign:'center'}}>
            <p style={{fontSize:32,marginBottom:12}}>⏳</p>
            <p style={{color:t,fontWeight:700,fontSize:14}}>{progressMsg}</p>
          </div>
        )}

        {phase === 'review' && (
          <div>
            {warning && (
              <div style={{background:'#FFF7E6',border:'1px solid #FDE68A',borderRadius:14,padding:14,marginBottom:16}}>
                <p style={{color:'#92400E',fontSize:12,margin:0}}>⚠️ {warning}</p>
              </div>
            )}
            <p style={{color:t,fontWeight:700,fontSize:15,margin:'0 0 14px'}}>
              Found {candidates.length} candidate questions - review and fix anything before publishing
            </p>

            {candidates.map((cand, idx) => (
              <div key={cand.tempId} style={{background:c,border:`1.5px solid ${b}`,borderRadius:16,padding:16,marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:700,color:CONFIDENCE_STYLE[cand.confidence].color,
                    background:`${CONFIDENCE_STYLE[cand.confidence].color}18`,padding:'2px 10px',borderRadius:20}}>
                    {CONFIDENCE_STYLE[cand.confidence].label}
                  </span>
                  <button onClick={()=>removeCandidate(idx)}
                    style={{background:'transparent',border:'none',color:'#DC2626',cursor:'pointer',fontSize:16}}>🗑</button>
                </div>
                <textarea value={cand.question_text} onChange={e=>updateCandidate(idx,'question_text',e.target.value)}
                  rows={2}
                  style={{width:'100%',padding:'10px 12px',borderRadius:10,border:`1.5px solid ${b}`,
                    marginBottom:8,fontSize:13,boxSizing:'border-box',resize:'vertical',fontWeight:600}}/>
                {cand.options.map(opt => (
                  <div key={opt.label} style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                    <button onClick={()=>updateCandidate(idx,'correct_answer',opt.label)}
                      style={{width:26,height:26,borderRadius:'50%',flexShrink:0,
                        border:`1.5px solid ${cand.correct_answer===opt.label?'#22C55E':b}`,
                        background:cand.correct_answer===opt.label?'#22C55E':'transparent',
                        color:cand.correct_answer===opt.label?'#fff':m,fontSize:11,fontWeight:700,cursor:'pointer'}}>
                      {opt.label}
                    </button>
                    <input value={opt.text} onChange={e=>updateOption(idx,opt.label,e.target.value)}
                      placeholder={`Option ${opt.label}`}
                      style={{flex:1,padding:'8px 12px',borderRadius:8,border:`1.5px solid ${b}`,fontSize:12,boxSizing:'border-box'}}/>
                  </div>
                ))}
                <p style={{fontSize:10,color:m,margin:'6px 0 0'}}>Tap the letter to mark the correct answer</p>
              </div>
            ))}

            {error && <p style={{color:'#DC2626',fontSize:12,marginBottom:10,textAlign:'center'}}>{error}</p>}
            <button onClick={publish}
              style={{width:'100%',background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
                padding:'14px',color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}>
              ✅ Publish {candidates.length} Questions to This Test
            </button>
          </div>
        )}

        {phase === 'publishing' && (
          <div style={{textAlign:'center',padding:40}}>
            <p style={{color:m,fontSize:14}}>Publishing...</p>
          </div>
        )}

        {phase === 'done' && (
          <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:40,textAlign:'center'}}>
            <p style={{fontSize:40,marginBottom:10}}>✅</p>
            <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 16px'}}>Questions published!</p>
            <button onClick={()=>nav('/institution/tests')}
              style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
                padding:'12px 24px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              Back to Tests
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
