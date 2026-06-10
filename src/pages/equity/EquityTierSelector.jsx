import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EQUITY_TIERS } from '../../lib/equityTiers'
import { useEquity } from '../../context/EquityTierContext'
import EquityVerification from './EquityVerification'

const TIER_LIST = Object.values(EQUITY_TIERS)

export default function EquityTierSelector() {
  const navigate = useNavigate()
  const { equityTier } = useEquity()
  const [selected, setSelected]     = useState(null)
  const [showVerify, setShowVerify]  = useState(false)

  if (showVerify && selected) {
    return <EquityVerification tier={selected} onBack={() => setShowVerify(false)} />
  }

  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)',
      padding:20, overflowY:'auto',
    }}>
      <div style={{ maxWidth:680, margin:'0 auto', paddingTop:20 }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🇮🇳</div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
            color:'#fff', fontSize:'clamp(22px,4vw,32px)', marginBottom:8 }}>
            TryIT Cares
          </h1>
          <p style={{ color:'#D4AF37', fontStyle:'italic', fontSize:16, marginBottom:12 }}>
            Education is a right, not a privilege.
          </p>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.6, maxWidth:500, margin:'0 auto' }}>
            TryIT provides 100% free education for life to India's most vulnerable communities.
            If any of these descriptions match your situation, you deserve full access—completely free.
          </p>
        </div>

        {/* Tier cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
          {TIER_LIST.map(tier => (
            <motion.button key={tier.id}
              whileHover={{ scale:1.01 }}
              whileTap={{ scale:0.99 }}
              onClick={() => setSelected(selected?.id === tier.id ? null : tier)}
              style={{
                textAlign:'left', padding:'18px 20px', borderRadius:20,
                border:`2px solid ${selected?.id === tier.id ? tier.color : 'rgba(255,255,255,0.1)'}`,
                background: selected?.id === tier.id
                  ? `${tier.color}22`
                  : 'rgba(255,255,255,0.04)',
                cursor:'pointer', transition:'all 0.2s',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:32, flexShrink:0 }}>{tier.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                      color:'#fff', fontSize:15 }}>{tier.name}</span>
                    <span style={{
                      background: tier.isFree ? '#22C55E' : '#D4AF37',
                      color: tier.isFree ? '#fff' : '#1E3A5F',
                      fontSize:10, fontWeight:800, padding:'3px 10px',
                      borderRadius:20, letterSpacing:'0.5px',
                    }}>
                      {tier.isFree ? '100% FREE FOR LIFE' : `${tier.discount}% OFF FOR LIFE`}
                    </span>
                  </div>
                  <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12, marginTop:4 }}>
                    {tier.beneficiaries}
                  </p>
                  <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:2, fontStyle:'italic' }}>
                    {tier.tagline}
                  </p>
                </div>
                <span style={{ color: selected?.id===tier.id ? tier.color : 'rgba(255,255,255,0.2)',
                  fontSize:20, fontWeight:800, flexShrink:0 }}>
                  {selected?.id===tier.id ? '●' : '○'}
                </span>
              </div>

              {/* Expanded description */}
              <AnimatePresence>
                {selected?.id === tier.id && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                    exit={{ height:0, opacity:0 }} style={{ overflow:'hidden' }}>
                    <div style={{ marginTop:14, paddingTop:14,
                      borderTop:'1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, lineHeight:1.6 }}>
                        {tier.description}
                      </p>
                      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:8 }}>
                        📋 <strong style={{ color:'rgba(255,255,255,0.6)' }}>Verification needed:</strong>{' '}
                        {tier.verification.instructions}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, paddingBottom:40 }}>
          {selected && (
            <motion.button
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              onClick={() => setShowVerify(true)}
              style={{
                width:'100%', padding:18, borderRadius:16, border:'none',
                background:`linear-gradient(135deg,${selected.color},${selected.color}CC)`,
                fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
                color:'#fff', cursor:'pointer',
                boxShadow:`0 8px 30px ${selected.color}44`,
              }}
            >
              Apply for {selected.name} →
            </motion.button>
          )}
          <button onClick={() => navigate('/dashboard')}
            style={{ background:'none', border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:14, padding:'12px', color:'rgba(255,255,255,0.5)',
              fontFamily:'Poppins,sans-serif', fontWeight:600, cursor:'pointer', fontSize:14 }}>
            I don't qualify — Continue with regular pricing
          </button>
        </div>
      </div>
    </div>
  )
}
