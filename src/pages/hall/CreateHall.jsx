// src/pages/hall/CreateHall.jsx - Create a new study hall
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const SUBJECTS = ['SSC CGL','UPSC CSE','IBPS PO','TNPSC Group 1','RRB NTPC','NEET UG','JEE Main','Other']
const LEVELS = ['Beginner','Intermediate','Advanced','All Levels']

export default function CreateHall() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF'
  const b = theme?.border||'#E2E8F0'

  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [emoji, setEmoji] = useState('⚔️')
  const [creating, setCreating] = useState(false)

  const EMOJIS = ['⚔️','🏆','🔥','📚','💡','🎯','🚀','🌟']

  const create = async () => {
    if (!name.trim() || !subject || !level) return
    setCreating(true)
    await new Promise(r => setTimeout(r, 1000))
    nav('/student/hall')
  }

  const inp = {width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid '+b,
    background:c,color:t,fontSize:14,outline:'none',fontFamily:'Poppins,sans-serif',
    boxSizing:'border-box'}

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:'1px solid '+b,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>nav('/student/hall')} style={{background:'transparent',
          border:'1px solid '+b,borderRadius:10,padding:'7px 16px',color:m,
          fontSize:13,cursor:'pointer',fontWeight:600}}>Back</button>
        <h1 style={{color:t,fontSize:17,fontWeight:800,margin:0}}>Create a Hall</h1>
      </div>
      <div style={{padding:'24px 20px',maxWidth:500,margin:'0 auto'}}>

        <div style={{marginBottom:20}}>
          <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
            Hall Name *
          </label>
          <input value={name} onChange={e=>setName(e.target.value)}
            placeholder="e.g. UPSC Warriors Tamil Nadu"
            style={{...inp,borderColor:name?a:b}}/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
            Hall Emoji
          </label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {EMOJIS.map(e=>(
              <button key={e} onClick={()=>setEmoji(e)}
                style={{width:44,height:44,borderRadius:12,border:'2px solid',
                  fontSize:22,cursor:'pointer',
                  borderColor:emoji===e?a:b,
                  background:emoji===e?a+'15':c}}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
            Exam Focus *
          </label>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {SUBJECTS.map(s=>(
              <button key={s} onClick={()=>setSubject(s)}
                style={{padding:'7px 14px',borderRadius:20,border:'1.5px solid',
                  cursor:'pointer',fontSize:12,fontWeight:600,
                  borderColor:subject===s?a:b,
                  background:subject===s?a+'15':c,
                  color:subject===s?a:m}}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:24}}>
          <label style={{display:'block',color:t,fontWeight:700,fontSize:13,marginBottom:8}}>
            Level *
          </label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {LEVELS.map(l=>(
              <button key={l} onClick={()=>setLevel(l)}
                style={{padding:'7px 14px',borderRadius:20,border:'1.5px solid',
                  cursor:'pointer',fontSize:12,fontWeight:600,
                  borderColor:level===l?p:b,
                  background:level===l?p+'12':c,
                  color:level===l?p:m}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <button onClick={create}
          disabled={!name.trim()||!subject||!level||creating}
          style={{width:'100%',
            background:(!name.trim()||!subject||!level)
              ?b:'linear-gradient(135deg,'+p+','+a+')',
            border:'none',borderRadius:16,padding:'16px',
            color:(!name.trim()||!subject||!level)?m:'#fff',
            fontWeight:800,fontSize:15,cursor:'pointer',opacity:creating?0.7:1}}>
          {creating?'Creating Hall...':emoji+' Create Hall'}
        </button>
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
