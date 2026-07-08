// src/pages/student/StudentHall.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import ShareButton from '../../components/ShareButton'

export default function StudentHall() {
  const nav = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const p = theme?.primary||'#1E3A5F', a = theme?.accent||'#C9A84C'
  const t = theme?.text||'#1E293B', m = theme?.textLight||'#64748B'
  const bg = theme?.background||'#F8FAFC', c = theme?.surface||'#FFFFFF', b = theme?.border||'#E2E8F0'

  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('halls')
      .select('*, hall_members(count)')
      .eq('is_public', true)
      .order('total_score', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setHalls(data.map(h => ({
            ...h,
            memberCount: h.hall_members?.[0]?.count || 0,
          })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{minHeight:'100vh',background:bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{background:c,borderBottom:`1px solid ${b}`,padding:'16px 20px',
        display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10,boxShadow:`0 4px 24px ${a}18`}}>
        <button onClick={()=>nav('/student')} style={{background:'transparent',border:`1px solid ${b}`,
          borderRadius:10,padding:'6px 14px',color:m,fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{flex:1}}>
          <h1 style={{color:t,fontSize:18,fontWeight:800,margin:0}}>⚔️ Battle Hall</h1>
          <p style={{color:m,fontSize:11,margin:0}}>Study halls · Live battles · Compete</p>
        </div>
        <ShareButton headline="Battling it out in TryIT Halls" stat="⚔️" subLabel="Live study battles, team vs team" context="Battle Hall" emoji="⚔️" style={{marginRight:8}} />
        <button onClick={()=>nav('/hall/create')} style={{background:`linear-gradient(135deg,${p},${a})`,
          border:'none',borderRadius:12,padding:'8px 16px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>
          + Create Hall
        </button>
      </div>
      <div style={{padding:'20px',maxWidth:760,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:20}}>
          {[{l:'Active Halls',v:String(halls.length),e:'🏛️'},
            {l:'Total Members',v:String(halls.reduce((s,h)=>s+(h.memberCount||0),0)),e:'👥'}].map((x,i)=>(
            <div key={i} style={{background:c,border:`1px solid ${b}`,borderRadius:14,padding:'14px',textAlign:'center'}}>
              <div style={{fontSize:22,marginBottom:4}}>{x.e}</div>
              <p style={{color:t,fontWeight:800,fontSize:15,margin:'0 0 2px'}}>{x.v}</p>
              <p style={{color:m,fontSize:10,margin:0}}>{x.l}</p>
            </div>
          ))}
        </div>
        <div style={{background:`linear-gradient(135deg,${p},${p}cc)`,borderRadius:18,
          padding:'18px',marginBottom:20,display:'flex',gap:12,alignItems:'center'}}>
          <div style={{fontSize:36}}>⚔️</div>
          <div style={{flex:1}}>
            <p style={{color:'#fff',fontWeight:800,fontSize:14,margin:'0 0 4px'}}>Start a Live Battle</p>
            <p style={{color:'rgba(255,255,255,0.7)',fontSize:11,margin:0}}>
              Challenge any student to a 10-question rapid duel
            </p>
          </div>
          <button onClick={()=>nav('/games/battle')} style={{background:`linear-gradient(135deg,${a},#E8C44A)`,
            border:'none',borderRadius:12,padding:'10px 16px',color:p,fontWeight:700,fontSize:12,cursor:'pointer',flexShrink:0}}>
            Battle →
          </button>
        </div>
        <p style={{color:t,fontWeight:700,fontSize:14,marginBottom:10}}>Popular Halls</p>
        {!loading && halls.length === 0 && (
          <div style={{textAlign:'center',padding:'30px 20px',color:m,fontSize:13}}>
            No halls yet - be the first to create one! ⚔️
          </div>
        )}
        {halls.map((h)=>(
          <div key={h.id} onClick={()=>nav('/games/battle')}
            style={{background:c,border:`1px solid ${b}`,borderRadius:16,padding:'14px 16px',
              marginBottom:8,cursor:'pointer',display:'flex',alignItems:'center',gap:12,
              transition:'all 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=a}
            onMouseLeave={e=>e.currentTarget.style.borderColor=b}>
            <div style={{width:44,height:44,borderRadius:12,background:`${p}15`,
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{h.emoji || '🏛️'}</div>
            <div style={{flex:1}}>
              <p style={{color:t,fontWeight:700,fontSize:13,margin:'0 0 4px'}}>{h.name}</p>
              <div style={{display:'flex',gap:10}}>
                <span style={{color:m,fontSize:11}}>👥 {h.memberCount || 1}</span>
                <span style={{background:`${a}15`,color:a,fontSize:9,fontWeight:700,
                  padding:'2px 8px',borderRadius:20}}>{h.subject}</span>
              </div>
            </div>
            <button onClick={e=>{e.stopPropagation();nav('/games/battle')}}
              style={{background:`${p}10`,border:`1px solid ${p}30`,borderRadius:10,
                padding:'6px 14px',color:p,fontWeight:600,fontSize:11,cursor:'pointer',flexShrink:0}}>
              Join
            </button>
          </div>
        ))}
        <div style={{height:80}}/>
      </div>
    </div>
  )
}
