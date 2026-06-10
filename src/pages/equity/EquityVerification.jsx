import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEquity } from '../../context/EquityTierContext'

export default function EquityVerification({ tier, onBack }) {
  const navigate = useNavigate()
  const { setEquityTier } = useEquity()
  const [fields, setFields]    = useState({})
  const [uploads, setUploads]  = useState({})
  const [submitted, setSubmit] = useState(false)
  const [errors, setErrors]    = useState({})
  const fileRefs = useRef({})

  const handleFile = (fieldName, file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setErrors(e => ({ ...e, [fieldName]: 'File too large. Max 5MB.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setUploads(u => ({ ...u, [fieldName]: {
      name: file.name, size: file.size, dataUrl: ev.target.result,
    }}))
    reader.readAsDataURL(file)
    setErrors(e => ({ ...e, [fieldName]: undefined }))
  }

  const submit = () => {
    const errs = {}
    tier.verification.options.forEach(opt => {
      if (opt.type === 'text' && !fields[opt.field]?.trim()) {
        errs[opt.field] = 'This field is required'
      }
    })
    if (Object.keys(errs).length) { setErrors(errs); return }
    // Save application to localStorage (TODO: send to Supabase)
    const apps = JSON.parse(localStorage.getItem('equity_applications') || '[]')
    apps.push({
      id: `app-${Date.now()}`,
      tier_id: tier.id,
      tier_name: tier.name,
      fields, uploads: Object.keys(uploads),
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })
    localStorage.setItem('equity_applications', JSON.stringify(apps))
    setEquityTier(tier.id, 'pending')
    setSubmit(true)
  }

  if (submitted) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
          style={{ background:'rgba(255,255,255,0.06)', borderRadius:28, padding:40,
            textAlign:'center', maxWidth:420, border:`2px solid ${tier.color}` }}>
          <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:22, marginBottom:12 }}>
            Application Submitted!
          </h2>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, lineHeight:1.7, marginBottom:12 }}>
            Your <strong style={{ color: tier.color }}>{tier.name}</strong> application
            is under review. We verify within <strong style={{ color:'#D4AF37' }}>24 hours</strong>.
          </p>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:16, marginBottom:24 }}>
            <p style={{ color:'#D4AF37', fontWeight:700, fontSize:14, marginBottom:6 }}>
              What happens next?
            </p>
            {['Our team reviews your documents','Verification email sent within 24 hours',
              tier.isFree ? 'Full free access activated for life!' : `${tier.discount}% discount applied to your account`
            ].map((s,i) => (
              <p key={i} style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginBottom:4 }}>
                {i+1}. {s}
              </p>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard')} style={{
            width:'100%', padding:14, borderRadius:14, border:'none',
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15,
            color:'#1E3A5F', cursor:'pointer',
          }}>
            Continue to TryIT →
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)',
      padding:20, overflowY:'auto' }}>
      <div style={{ maxWidth:520, margin:'0 auto', paddingTop:20 }}>
        {/* Back button */}
        <button onClick={onBack}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)',
            cursor:'pointer', fontSize:14, marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
          ← Back to tiers
        </button>

        {/* Tier header */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>{tier.emoji}</div>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:22 }}>
            {tier.name}
          </h2>
          <div style={{ background: tier.isFree ? '#22C55E' : '#D4AF37',
            color: tier.isFree ? '#fff' : '#1E3A5F',
            display:'inline-block', padding:'4px 16px', borderRadius:20,
            fontWeight:800, fontSize:12, marginTop:8, letterSpacing:'0.5px' }}>
            {tier.isFree ? '100% FREE FOR LIFE' : `${tier.discount}% OFF FOR LIFE`}
          </div>
        </div>

        {/* Verification form */}
        <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:24, padding:24,
          border:'1px solid rgba(255,255,255,0.1)', marginBottom:20 }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, letterSpacing:'2px',
            marginBottom:16, fontWeight:700 }}>VERIFICATION DOCUMENTS</p>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, lineHeight:1.6, marginBottom:20 }}>
            {tier.verification.instructions}
          </p>

          {tier.verification.options.map(opt => (
            <div key={opt.field} style={{ marginBottom:20 }}>
              <label style={{ display:'block', color:'rgba(255,255,255,0.8)', fontWeight:600,
                fontSize:13, marginBottom:8, fontFamily:'Poppins,sans-serif' }}>
                {opt.label}
              </label>
              {opt.type === 'text' ? (
                <input value={fields[opt.field] || ''} placeholder="Enter here..."
                  onChange={e => setFields(f => ({ ...f, [opt.field]: e.target.value }))}
                  style={{ width:'100%', padding:'12px 14px', borderRadius:12,
                    border:`1.5px solid ${errors[opt.field] ? '#EF4444' : 'rgba(255,255,255,0.2)'}`,
                    background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14,
                    outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
                />
              ) : (
                <div>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf"
                    ref={el => fileRefs.current[opt.field] = el}
                    onChange={e => handleFile(opt.field, e.target.files[0])}
                    style={{ display:'none' }}
                  />
                  <button onClick={() => fileRefs.current[opt.field]?.click()}
                    style={{
                      width:'100%', padding:'16px', borderRadius:12,
                      border:`2px dashed ${uploads[opt.field] ? tier.color : 'rgba(255,255,255,0.2)'}`,
                      background: uploads[opt.field] ? `${tier.color}18` : 'rgba(255,255,255,0.04)',
                      color: uploads[opt.field] ? tier.color : 'rgba(255,255,255,0.5)',
                      cursor:'pointer', fontSize:13, fontFamily:'Poppins,sans-serif',
                      fontWeight:600, transition:'all 0.2s',
                    }}>
                    {uploads[opt.field]
                      ? `✅ ${uploads[opt.field].name} (${Math.round(uploads[opt.field].size/1024)}KB)`
                      : '📎 Upload Document (JPG, PNG, PDF · Max 5MB)'
                    }
                  </button>
                </div>
              )}
              {errors[opt.field] && (
                <p style={{ color:'#EF4444', fontSize:12, marginTop:6 }}>{errors[opt.field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)',
          borderRadius:14, padding:14, marginBottom:20 }}>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, lineHeight:1.6 }}>
            🔒 <strong style={{ color:'#D4AF37' }}>Your documents are safe.</strong> TryIT uses AES-256
            encryption. Documents are used only for eligibility verification and never shared
            with third parties. Processed documents are permanently deleted after verification.
          </p>
        </div>

        <button onClick={submit} style={{
          width:'100%', padding:18, borderRadius:16, border:'none',
          background:`linear-gradient(135deg,${tier.color},${tier.color}AA)`,
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
          color:'#fff', cursor:'pointer',
          boxShadow:`0 8px 30px ${tier.color}44`,
          marginBottom:40,
        }}>
          Submit Application →
        </button>
      </div>
    </div>
  )
}
