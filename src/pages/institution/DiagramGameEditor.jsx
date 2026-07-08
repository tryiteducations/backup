// src/pages/institution/DiagramGameEditor.jsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { diagramGames } from '../../lib/diagramGames'

export default function DiagramGameEditor() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const imgRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [hotspots, setHotspots] = useState([])
  const [pendingLabel, setPendingLabel] = useState('')
  const [subject, setSubject] = useState('Biology')
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState('label')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setHotspots([])
  }

  const handleImageClick = (e) => {
    if (!pendingLabel.trim()) {
      setError('Type the label name first, then click where it belongs on the image.')
      return
    }
    setError('')
    const rect = imgRef.current.getBoundingClientRect()
    const x_pct = ((e.clientX - rect.left) / rect.width) * 100
    const y_pct = ((e.clientY - rect.top) / rect.height) * 100
    setHotspots(prev => [...prev, { id: `h${prev.length}`, label: pendingLabel.trim(), x_pct, y_pct }])
    setPendingLabel('')
  }

  const removeHotspot = (id) => setHotspots(prev => prev.filter(h => h.id !== id))

  const save = async () => {
    if (!title.trim() || hotspots.length < 2 || !imageFile || !user?.id) {
      setError('Add a title, an image, and at least 2 labeled hotspots.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const imageUrl = await diagramGames.uploadImage(user.id, imageFile)
      const result = await diagramGames.create(user.id, {
        subject, title: title.trim(), mode, imageUrl, hotspots, difficulty: 2,
      })
      if (!result) throw new Error('Could not save - please try again.')
      setDone(true)
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Poppins,sans-serif'}}>
        <div style={{background:c,border:`1px solid ${b}`,borderRadius:20,padding:32,textAlign:'center'}}>
          <p style={{fontSize:40,marginBottom:10}}>✅</p>
          <p style={{color:t,fontWeight:800,fontSize:16,margin:'0 0 16px'}}>Diagram game created!</p>
          <button onClick={()=>nav('/institution')}
            style={{background:`linear-gradient(135deg,${p},${a})`,border:'none',borderRadius:12,
              padding:'12px 24px',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer'}}>
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav(-1)} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>🗺️ Create Diagram Game</h1>
      </div>

      <div style={{padding:20,maxWidth:700,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (e.g. Human Heart)"
            style={{padding:'10px 14px',borderRadius:10,border:`1.5px solid ${b}`,fontSize:13,boxSizing:'border-box'}}/>
          <select value={subject} onChange={e=>setSubject(e.target.value)}
            style={{padding:'10px 14px',borderRadius:10,border:`1.5px solid ${b}`,fontSize:13}}>
            {['Biology','Geography','History','Civics'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {!imagePreview ? (
          <label style={{display:'block',background:c,border:`2px dashed ${b}`,borderRadius:16,
            padding:40,textAlign:'center',cursor:'pointer'}}>
            <p style={{fontSize:32,marginBottom:10}}>🖼️</p>
            <p style={{color:t,fontWeight:600,fontSize:14}}>Upload the diagram or map image</p>
            <input type="file" accept="image/*" hidden onChange={handleImageChange}/>
          </label>
        ) : (
          <>
            <div style={{background:'#FFF7E6',border:'1px solid #FDE68A',borderRadius:12,padding:12,marginBottom:12}}>
              <p style={{color:'#92400E',fontSize:12,margin:0}}>
                1. Type a label name below → 2. Click the exact spot on the image it belongs to → repeat for each part.
              </p>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <input value={pendingLabel} onChange={e=>setPendingLabel(e.target.value)}
                placeholder="Next label name (e.g. Mitochondria)"
                style={{flex:1,padding:'10px 14px',borderRadius:10,border:`1.5px solid ${pendingLabel?a:b}`,fontSize:13,boxSizing:'border-box'}}/>
            </div>
            <div style={{position:'relative',display:'inline-block',maxWidth:'100%'}}>
              <img ref={imgRef} src={imagePreview} alt="" onClick={handleImageClick}
                style={{maxWidth:'100%',borderRadius:12,border:`1px solid ${b}`,cursor:'crosshair',display:'block'}}/>
              {hotspots.map(h => (
                <div key={h.id} onClick={(e)=>{e.stopPropagation();removeHotspot(h.id)}}
                  title="Click to remove"
                  style={{position:'absolute',left:`${h.x_pct}%`,top:`${h.y_pct}%`,
                    transform:'translate(-50%,-50%)',width:24,height:24,borderRadius:'50%',
                    background:a,border:'2px solid #fff',boxShadow:'0 2px 8px rgba(0,0,0,0.3)',
                    display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
                    fontSize:9,fontWeight:800,color:'#fff'}}>
                  {hotspots.indexOf(h)+1}
                </div>
              ))}
            </div>

            {hotspots.length > 0 && (
              <div style={{marginTop:14}}>
                <p style={{color:t,fontWeight:700,fontSize:13,marginBottom:8}}>Placed labels ({hotspots.length}):</p>
                {hotspots.map((h,i) => (
                  <div key={h.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'6px 12px',background:c,border:`1px solid ${b}`,borderRadius:8,marginBottom:4}}>
                    <span style={{fontSize:12,color:t}}>{i+1}. {h.label}</span>
                    <button onClick={()=>removeHotspot(h.id)} style={{background:'transparent',border:'none',color:'#DC2626',cursor:'pointer'}}>×</button>
                  </div>
                ))}
              </div>
            )}

            {error && <p style={{color:'#DC2626',fontSize:12,margin:'14px 0 0'}}>{error}</p>}

            <button onClick={save} disabled={saving}
              style={{width:'100%',marginTop:16,background:`linear-gradient(135deg,${p},${a})`,
                border:'none',borderRadius:12,padding:'14px',color:'#fff',fontWeight:800,fontSize:14,cursor:saving?'wait':'pointer'}}>
              {saving ? 'Saving...' : `✅ Save Diagram Game (${hotspots.length} labels)`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
