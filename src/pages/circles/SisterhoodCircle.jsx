import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isValidAPAAR, formatAPAAR, verifyAPAAR } from '../../lib/apaarValidator'
import { useToast } from '../../context/ToastContext'

const REQUIRED = 5
const DISCOUNT  = 25

export default function SisterhoodCircle() {
  const navigate  = useNavigate()
  const { showToast } = useToast()
  const STORE_KEY = 'my_sisterhood_circle'
  const [circle]     = useState(() => JSON.parse(localStorage.getItem(STORE_KEY) || 'null'))
  const [members, setMembers]     = useState([])
  const [newApaar, setNewApaar]   = useState('')
  const [verifying, setVerifying] = useState(false)
  const unlocked = members.length >= REQUIRED

  const add = async () => {
    if (!isValidAPAAR(newApaar)) { showToast('error','Invalid APAAR ID'); return }
    if (members.some(m => m.apaarId === newApaar.replace(/\D/g,''))) {
      showToast('error','Already added'); return
    }
    setVerifying(true)
    const r = await verifyAPAAR(newApaar)
    setVerifying(false)
    if (r.valid) {
      const updated = [...members, { ...r, joinedAt: new Date().toISOString() }]
      setMembers(updated)
      setNewApaar('')
      if (updated.length >= REQUIRED) {
        const data = { id:`sc-${Date.now()}`, type:'sisterhood', discount:DISCOUNT,
          members:updated, activatedAt:new Date().toISOString() }
        localStorage.setItem(STORE_KEY, JSON.stringify(data))
        showToast('success',`🌸 Sisterhood Circle complete! ${DISCOUNT}% off for all 5 members!`)
      } else { showToast('success',`✅ ${updated.length}/${REQUIRED} members`) }
    } else { showToast('error','Verification failed') }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#4A0E4E,#2D0A2E)',padding:20 }}>
      <div style={{ maxWidth:480, margin:'0 auto', paddingTop:20 }}>
        <button onClick={() => navigate(-1)}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', marginBottom:20 }}>
          ← Back
        </button>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🌸</div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:24, marginBottom:8 }}>
            TryIT Sisterhood Circle
          </h1>
          <div style={{ background:'linear-gradient(135deg,#EC4899,#DB2777)', display:'inline-block',
            padding:'5px 18px', borderRadius:20, fontWeight:800, fontSize:13, color:'#fff', marginBottom:12 }}>
            25% OFF FOR LIFE
          </div>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.7 }}>
            5 female students from the same institution. One circle. Lifelong discount.
            Closing India's tech gender gap — one circle at a time.
          </p>
        </div>

        {/* Progress */}
        <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:20, padding:20, marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ color:'#fff', fontWeight:700 }}>Circle Members</span>
            <span style={{ color:'#EC4899', fontWeight:800 }}>{members.length}/{REQUIRED}</span>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            {Array.from({length:REQUIRED}).map((_,i)=>(
              <div key={i} style={{ flex:1, height:8, borderRadius:4,
                background: i<members.length ? '#EC4899' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          {members.map((m,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <span style={{ color:'#EC4899' }}>🌸</span>
              <span style={{ color:'#fff', fontSize:13 }}>{m.studentName}</span>
            </div>
          ))}
        </div>

        {!unlocked && (
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            <input value={formatAPAAR(newApaar)}
              onChange={e => setNewApaar(e.target.value.replace(/\D/g,'').slice(0,12))}
              placeholder="Enter APAAR ID"
              style={{ flex:1, padding:'12px', borderRadius:12,
                border:'1.5px solid rgba(236,72,153,0.4)',
                background:'rgba(255,255,255,0.06)', color:'#fff',
                fontSize:15, fontFamily:'monospace', letterSpacing:3, outline:'none' }}
            />
            <button onClick={add} disabled={verifying||newApaar.length<12}
              style={{ padding:'12px 18px', borderRadius:12, border:'none',
                background:'linear-gradient(135deg,#EC4899,#DB2777)',
                color:'#fff', fontWeight:700, cursor:'pointer', flexShrink:0 }}>
              {verifying?'...':'Add'}
            </button>
          </div>
        )}
        {unlocked && (
          <button onClick={() => navigate('/dashboard')} style={{
            width:'100%', padding:16, borderRadius:16, border:'none',
            background:'linear-gradient(135deg,#EC4899,#DB2777)',
            fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
            color:'#fff', cursor:'pointer',
          }}>
            🌸 Sisterhood Activated — 25% OFF →
          </button>
        )}
      </div>
    </div>
  )
}
