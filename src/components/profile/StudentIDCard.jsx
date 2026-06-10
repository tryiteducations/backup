import { useState } from 'react'
import { useToast } from '../../context/ToastContext'
import { ID_TEMPLATES } from '../../data/mockSeeds'

const LEVEL_LOGOS = { 'The Fierce One':'🔥','The Fighter':'⚔️','The Riser':'📈',
  'The Gold Miner':'⛏️','The Grinder':'💪','Baahuveer':'🦁','Thalavan':'👑',
  'The Unstoppable':'⚡','The Legend':'🌟','The Absolute':'🏆' }

function IDCardFace({ user, template, isFront }) {
  const T = template

  if (isFront) return (
    <div style={{
      width:'100%', height:'100%',
      background: T.bg,
      borderRadius:'20px',
      border: `2px solid ${T.border}`,
      padding:'24px',
      display:'flex', flexDirection:'column',
      justifyContent:'space-between',
      position:'relative', overflow:'hidden',
      boxShadow:`0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${T.border}44`,
    }}>
      {/* Shine overlay */}
      {T.shine && (
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 50%,rgba(255,255,255,0.04) 100%)',
          borderRadius:'20px', pointerEvents:'none',
        }} />
      )}

      {/* Pattern overlay */}
      {T.pattern === 'circuit' && (
        <div style={{ position:'absolute', inset:0, opacity:0.06, pointerEvents:'none',
          backgroundImage:`repeating-linear-gradient(0deg,${T.border} 0,${T.border} 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,${T.border} 0,${T.border} 1px,transparent 1px,transparent 40px)`,
        }} />
      )}
      {T.pattern === 'holographic' && (
        <div style={{ position:'absolute', inset:0, opacity:0.15, pointerEvents:'none',
          background:`repeating-linear-gradient(45deg,${T.accent}22 0px,${T.accent}44 2px,transparent 2px,transparent 20px)`,
        }} />
      )}

      {/* Top row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'18px',
            color:T.textPrimary, letterSpacing:'2px' }}>
            TRY<span style={{ color:T.accent }}>IT</span>
          </div>
          <div style={{ color:T.textSecondary, fontSize:'8px', letterSpacing:'3px', marginTop:'1px' }}>
            EDUCATIONS
          </div>
        </div>
        <div style={{
          background:`${T.accent}22`, border:`1px solid ${T.accent}44`,
          borderRadius:'8px', padding:'4px 10px',
          color:T.accent, fontSize:'10px', fontWeight:700, letterSpacing:'1px',
        }}>
          {user.isPro ? '⚡ PRO' : 'STUDENT'}
        </div>
      </div>

      {/* Avatar + name */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px', margin:'20px 0 12px' }}>
        <div style={{
          width:'60px', height:'60px', borderRadius:'50%',
          background:`linear-gradient(135deg,${T.accent},${T.accent}88)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'22px',
          color: T.id === 'champion' ? '#1C1917' : '#1E3A5F',
          border:`2px solid ${T.border}`,
          boxShadow:`0 0 20px ${T.accent}44`,
          flexShrink:0,
        }}>
          {user.initials}
        </div>
        <div>
          <div style={{ color:T.textPrimary, fontFamily:'Poppins,sans-serif',
            fontWeight:700, fontSize:'16px', letterSpacing:'0.5px' }}>
            {user.name}
          </div>
          <div style={{ color:T.textSecondary, fontSize:'11px', marginTop:'3px' }}>
            {user.levelEmoji} {user.levelTitle}
          </div>
          <div style={{ color:T.textSecondary, fontSize:'10px', opacity:0.8, marginTop:'2px' }}>
            {user.city}, {user.state}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', gap:'8px' }}>
        {[
          { label:'RANK', val:`#${user.rank.toLocaleString()}` },
          { label:'STREAK', val:`${user.streak}d 🔥` },
          { label:'SCORE',  val:`${user.avgScore}%` },
        ].map(s => (
          <div key={s.label} style={{
            flex:1, background:`${T.accent}15`,
            border:`1px solid ${T.accent}30`,
            borderRadius:'10px', padding:'8px 6px', textAlign:'center',
          }}>
            <div style={{ color:T.accent, fontFamily:'Poppins,sans-serif',
              fontWeight:700, fontSize:'13px' }}>{s.val}</div>
            <div style={{ color:T.textSecondary, fontSize:'8px',
              letterSpacing:'1px', marginTop:'2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ display:'flex', justifyContent:'space-between',
        alignItems:'center', marginTop:'12px' }}>
        <div style={{ color:T.textSecondary, fontSize:'9px',
          fontFamily:'monospace', letterSpacing:'2px' }}>
          {user.userId}
        </div>
        <div style={{ color:T.textSecondary, fontSize:'9px' }}>
          {user.exams[0]?.name}
        </div>
      </div>
    </div>
  )

  // BACK of card
  return (
    <div style={{
      width:'100%', height:'100%', background:T.bg,
      borderRadius:'20px', border:`2px solid ${T.border}`,
      padding:'24px', display:'flex', flexDirection:'column',
      justifyContent:'center', alignItems:'center',
      gap:'16px', position:'relative', overflow:'hidden',
    }}>
      {T.shine && (
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 60%)',
          borderRadius:'20px', pointerEvents:'none' }} />
      )}
      <div style={{ fontSize:'40px' }}>{LEVEL_LOGOS[user.levelTitle] || '🎓'}</div>
      <div style={{ color:T.textPrimary, fontFamily:'Poppins,sans-serif',
        fontWeight:700, fontSize:'18px', textAlign:'center' }}>
        {user.levelTitle}
      </div>
      <div style={{ width:'60%', height:'1px', background:`${T.accent}40` }} />
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'100%' }}>
        {user.exams.slice(0,3).map(e => (
          <div key={e.id} style={{ display:'flex', alignItems:'center',
            justifyContent:'space-between', background:`${T.accent}15`,
            borderRadius:'10px', padding:'8px 12px' }}>
            <span style={{ color:T.textPrimary, fontSize:'12px', fontWeight:600 }}>{e.name}</span>
            <span style={{ color:T.accent, fontSize:'12px', fontWeight:700 }}>{e.readiness}%</span>
          </div>
        ))}
      </div>
      <div style={{ color:T.textSecondary, fontSize:'9px',
        textAlign:'center', letterSpacing:'1px', opacity:0.7 }}>
        tryiteducations.net
      </div>
    </div>
  )
}

export default function StudentIDCard({ user }) {
  const { showToast } = useToast()
  const [flipped, setFlipped]         = useState(false)
  const [activeTemplate, setTemplate] = useState(0)
  const T = ID_TEMPLATES[activeTemplate]

  const share = () => {
    if (navigator.share) {
      navigator.share({ title:'My TryIT Student ID', text:`${user.name} · Rank #${user.rank} · ${user.exams[0]?.name} | tryiteducations.net` })
    } else {
      navigator.clipboard?.writeText(`${user.name} · Rank #${user.rank} · ${user.levelEmoji} ${user.levelTitle} | tryiteducations.net`)
      showToast('success','ID card link copied! Share on WhatsApp 🔥')
    }
  }

  return (
    <div>
      {/* 3D Flip Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          width:'100%', maxWidth:'340px', height:'220px',
          margin:'0 auto', cursor:'pointer',
          perspective:'1200px',
        }}
      >
        <div style={{
          width:'100%', height:'100%',
          position:'relative',
          transformStyle:'preserve-3d',
          transition:'transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* Front */}
          <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden' }}>
            <IDCardFace user={user} template={T} isFront />
          </div>
          {/* Back */}
          <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)' }}>
            <IDCardFace user={user} template={T} isFront={false} />
          </div>
        </div>
      </div>
      <p style={{ textAlign:'center', color:'#94A3B8', fontSize:'12px', marginTop:'8px' }}>
        Tap card to flip
      </p>

      {/* Template selector */}
      <div style={{ display:'flex', gap:'8px', justifyContent:'center', margin:'16px 0 12px', flexWrap:'wrap' }}>
        {ID_TEMPLATES.map((t, i) => (
          <button key={t.id}
            onClick={() => setTemplate(i)}
            style={{
              padding:'6px 14px', borderRadius:'20px',
              border:`2px solid ${i === activeTemplate ? '#D4AF37' : '#E2E8F0'}`,
              background: i === activeTemplate ? '#D4AF37' : '#fff',
              color: i === activeTemplate ? '#1E3A5F' : '#64748B',
              fontFamily:'Poppins,sans-serif', fontWeight:600,
              fontSize:'12px', cursor:'pointer', transition:'all 0.2s',
            }}>
            {t.name}
          </button>
        ))}
      </div>

      {/* Share button */}
      <button onClick={share}
        style={{
          display:'flex', alignItems:'center', justifyContent:'center',
          gap:'8px', width:'100%', maxWidth:'340px',
          margin:'0 auto', padding:'12px',
          background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
          border:'none', borderRadius:'14px',
          fontFamily:'Poppins,sans-serif', fontWeight:700,
          fontSize:'14px', color:'#1E3A5F', cursor:'pointer',
        }}>
        📤 Share My ID Card
      </button>
    </div>
  )
}
